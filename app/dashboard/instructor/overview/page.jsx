"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axios";
import CourseProgressPieChart from "@/app/components/CourseProgressPieChart";
import { SectionCards } from "@/app/components/section-cards";
import { Skeleton } from "@/app/components/ui/skeleton";

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

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of your courses and students.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill()
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
        </div>
      ) : (
        <SectionCards dashboardData={dashboardData} />
      )}

      <CourseProgressPieChart />
    </div>
  );
}
