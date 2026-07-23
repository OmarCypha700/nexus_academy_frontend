import { NextResponse } from "next/server";

/**
 * H9 (revised): CSP via middleware, not next.config.js headers().
 *
 * The previous version set a static `script-src 'self'` in next.config.js. That blocks
 * every inline <script> tag — including the ones Next.js itself injects for hydration
 * data and (in dev) Turbopack's HMR client — because those don't come from a same-origin
 * .js file, they're inline. There's no way to allow "Next's own inline scripts" without
 * either allowing ALL inline scripts (`unsafe-inline`, which defeats most of the point of
 * having a script-src CSP at all) or using a nonce, which is the approach Next.js is
 * actually built to support: https://nextjs.org/docs/app/guides/content-security-policy
 *
 * Middleware runs per-request, so it can mint a fresh, unpredictable nonce every time and
 * put it in both the CSP header and (via the `x-nonce` request header) somewhere the app
 * itself can read it if it ever needs to nonce a custom inline script. Next.js detects the
 * nonce in the CSP header it receives and automatically applies it to the scripts it
 * manages — no per-component changes needed for that part.
 *
 * `style-src` still uses 'unsafe-inline' rather than a nonce, deliberately: Tailwind/Radix/
 * shadcn set inline `style="..."` attributes via JS constantly (not <style> tags), and
 * nonces don't cover style attributes at all — only 'unsafe-inline' or CSP3's separate
 * `style-src-attr` (poor browser support) can. This is a standard, accepted trade-off;
 * style-attribute injection is a much lower-severity vector than script injection.
 *
 * `'unsafe-eval'` is added to script-src ONLY when NODE_ENV !== "production". Turbopack's
 * (and webpack's) dev-mode Fast Refresh compiles source maps in a way that calls eval(),
 * which script-src blocks by default — without this, `next dev` throws a CSP violation on
 * essentially every HMR update. Production builds don't use eval() for this and get no
 * such allowance, which is the setting that actually matters: an XSS payload that relies
 * on eval()/Function() to execute stays blocked in production.
 */
export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV !== "production";

  const apiOrigin = (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "").origin;
    } catch {
      return "";
    }
  })();

  // 'unsafe-eval' is only added in development: Turbopack's (and webpack's) Fast Refresh
  // uses eval()-based source maps for HMR, which script-src blocks without it. This must
  // never leak into production — a real eval-executing XSS payload is exactly the kind of
  // thing 'unsafe-eval' would let through, and production doesn't need HMR at all.
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval';`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic';`;

  const cspHeader = `
    default-src 'self';
    ${scriptSrc}
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' ${apiOrigin} https://api.paystack.co;
    frame-src https://www.youtube.com https://checkout.paystack.com https://standard.paystack.co;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    // Run on everything except static assets and image optimization files, which don't
    // need CSP headers and don't benefit from the per-request nonce.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};