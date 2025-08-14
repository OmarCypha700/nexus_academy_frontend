"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axios";
import CourseProgressPieChart from "@/app/components/CourseProgressPieChart";
import { SectionCards } from "@/app/components/section-cards";
import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar";

export default function InstructorDashboardOverview() {
  const [dashboardData, setDashboardData] = useState({
    total_courses: 0,
    total_enrolled_students: 0,
    published_courses: 0,
    draft_courses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          "/instructor/dashboard-overview/"
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return(
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards dashboardData={dashboardData} />
              <div className="px-4 lg:px-6">
                <CourseProgressPieChart />
              </div>
              <div className="px-4 lg:px-6"></div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
