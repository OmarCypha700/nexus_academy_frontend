"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  UserCog,
  LayoutDashboard,
  LibraryBig,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
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

export function AppSidebar() {
  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      title: "Course Management",
      url: "/dashboard/instructor",
      icon: LibraryBig,
    },
    {
      title: "Student Management",
      url: "#",
      icon: UserCog,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];
  const pathname = usePathname();
  const isActive = (path) => pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" variant="floating" className={"sticky"}>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel className={'font-bold text-black'}>Instructor Dashboard</SidebarGroupLabel> */}
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
                          ? "bg-black text-white"
                          : ""
                      )}
                    >
                      <Tooltip>
                        <TooltipTrigger>
                          <item.icon
                            size={20}
                            color={clsx(isActive(item.url) ? "white" : "black")}
                          />
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
    </Sidebar>
  );
}
