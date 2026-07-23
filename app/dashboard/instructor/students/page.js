"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import StudentsList from "@/app/components/dashboard/students/StudentsList";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/app/components/ui/chart";
import { Skeleton } from "@/app/components/ui/skeleton";
import axiosInstance from "@/app/lib/axios";

const chartConfig = {
  completed: { label: "Completed", color: "var(--chart-3)" },
  inProgress: { label: "In Progress", color: "var(--chart-2)" },
  incomplete: { label: "Incomplete", color: "var(--chart-5)" },
};

export default function InstructorDashboardStudents() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        // H6: /instructor/courses/ is a ListCreateAPIView, so it's also affected by the
        // global DEFAULT_PAGINATION_CLASS — response.data is now {count, next, previous,
        // results}, not a bare array. An instructor's own course list realistically stays
        // well under one page (20) for most users, but rather than assume that and risk
        // silently hiding courses for a prolific instructor, this follows `next` until
        // every page is collected — same approach as the public catalog page.
        let allCourses = [];
        let url = "/instructor/courses/";
        while (url) {
          const response = await axiosInstance.get(url);
          const data = response.data;
          if (Array.isArray(data)) {
            allCourses = data;
            break;
          }
          allCourses = allCourses.concat(data.results || []);
          url = data.next || null;
        }
        setCourses(allCourses);
        if (allCourses.length > 0) setSelectedCourseId(allCourses[0].id);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please check your connection or try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setProgressData(null);
      setProgressLoading(false);
      return;
    }
    const fetchProgress = async () => {
      setProgressLoading(true);
      try {
        const response = await axiosInstance.get(
          `/instructor/progress-overview/${selectedCourseId}/`
        );
        // This endpoint always responds with an array (even for a single course_id),
        // so pick the one entry rather than treating the array itself as the data object.
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        setProgressData(data || null);
      } catch (error) {
        console.error("Error fetching course progress:", error);
        setProgressData(null);
      } finally {
        setProgressLoading(false);
      }
    };
    fetchProgress();
  }, [selectedCourseId]);

  const chartData = progressData
    ? [
        { status: "completed", count: progressData.completed, fill: chartConfig.completed.color },
        { status: "inProgress", count: progressData.in_progress, fill: chartConfig.inProgress.color },
        { status: "incomplete", count: progressData.incomplete, fill: chartConfig.incomplete.color },
      ]
    : [];
  const hasProgressActivity = chartData.some((d) => d.count > 0);

  if (error) {
    return <p className="text-red-500 text-center py-12">{error}</p>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="text-sm text-muted-foreground">
          Review your roster and each course&apos;s completion progress.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">
          {loading ? (
            <Skeleton className="h-10 w-[200px]" />
          ) : courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No courses available</p>
          ) : (
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={() => alert("Export CSV functionality to be implemented")}>
            Export CSV
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm md:text-base">
          No courses available
        </div>
      ) : (
        <>
          {selectedCourseId && <StudentsList courseId={selectedCourseId} />}

          <Card className="border shadow-none max-w-md">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-medium text-gray-700">
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {progressLoading ? (
                <Skeleton className="h-[180px] w-full rounded" />
              ) : hasProgressActivity ? (
                <ChartContainer config={chartConfig} className="mx-auto h-[180px] w-full">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={45}
                      outerRadius={70}
                      strokeWidth={2}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.status} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend
                      content={<ChartLegendContent nameKey="status" className="flex-wrap gap-x-4 gap-y-1" />}
                      wrapperStyle={{ width: "100%" }}
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No enrollment activity yet for this course.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
