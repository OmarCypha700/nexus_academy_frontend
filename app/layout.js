import { headers } from "next/headers";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Nexus Academy",
  description: "Online courses and learning management for Nexus Academy.",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // iOS Safari doesn't read manifest.json for "Add to Home Screen" — it needs these meta
  // tags directly to launch standalone (no browser chrome) instead of as a bookmark tab.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nexus Academy",
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({ children }) {
  // Available for a future inline <script nonce={nonce}>; Next's own injected scripts
  // already pick up the CSP nonce from middleware.js automatically.
  const nonce = (await headers()).get("x-nonce");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <main className="bg-background text-foreground flex-1 p-6">{children}</main>
            <Footer />
          </AuthProvider>
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}