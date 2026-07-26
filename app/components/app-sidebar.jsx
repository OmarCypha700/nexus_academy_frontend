"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  UserCog,
  LayoutDashboard,
  LibraryBig,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import ThemeToggle from "@/app/components/ThemeToggle";

export function AppSidebar() {
  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard/instructor/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Courses",
      url: "/dashboard/instructor/courses",
      icon: LibraryBig,
    },
    {
      title: "Students",
      url: "/dashboard/instructor/students",
      icon: UserCog,
    },
  ];
  const pathname = usePathname();
  const isActive = (path) => pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" variant="floating" className={"sticky"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={clsx(
                        "flex items-center gap-2",
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground"
                          : ""
                      )}
                    >
                      <Tooltip>
                        <TooltipTrigger>
                          <item.icon size={20} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:justify-center">
              <span className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
