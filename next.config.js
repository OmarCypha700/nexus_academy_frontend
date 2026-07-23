/**
 * H9 (revised): CSP moved to middleware.js — it needs a fresh nonce per request, which a
 * static headers() config here can't generate. See middleware.js for the full explanation.
 * The remaining headers here are safe to be static (they don't need a nonce and don't
 * change per-request), so they stay.
 */
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};