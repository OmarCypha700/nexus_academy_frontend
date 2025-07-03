import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar"

export default function Layout({ children }) {
  return (
    <SidebarProvider
    defaultOpen={false}
    style={{
    "--sidebar-width": "10rem",
    "--sidebar-width-mobile": "10rem",
  }}>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}