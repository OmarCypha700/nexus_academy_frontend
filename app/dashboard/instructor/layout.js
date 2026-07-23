import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar"
import { Toaster } from "@/app/components/ui/sonner"

export default function Layout({ children }) {
  return (
    <SidebarProvider
    // defaultOpen={false}
    style={{
    "--sidebar-width": "10rem",
    "--sidebar-width-mobile": "10rem",
  }}>
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <SidebarTrigger />
        {children}
      </main>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  )
}