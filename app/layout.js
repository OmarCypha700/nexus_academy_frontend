// import "./globals.css";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import { AuthProvider } from "./context/AuthContext";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex flex-col min-h-screen">
//         <AuthProvider>
//           <Navbar />
//           <main className="bg-gray-100 flex-1 p-6">{children}</main>
//           <Footer />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }



import { headers } from "next/headers";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import { AuthProvider } from "./context/AuthContext";

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
  // H9: available in case a custom inline <script nonce={nonce}> is ever added directly
  // in this layout — Next.js's own injected scripts pick up the nonce automatically from
  // the CSP header set in middleware.js, so this isn't required for the app to work today,
  // but it's the documented pattern and costs nothing to have in place now.
  const nonce = (await headers()).get("x-nonce");

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="bg-gray-100 flex-1 p-6">{children}</main>
          <Footer />
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}