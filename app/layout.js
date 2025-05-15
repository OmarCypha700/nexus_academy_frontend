import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import { Toaster } from "@/app/components/ui/Sonner"
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="bg-gray-100 flex-1 p-6">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
