"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
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
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        // This endpoint is paginated, so follow `next` until every page is collected
        // rather than silently truncating a prolific instructor's course list.
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

  const handleExport = async (exportFormat) => {
    if (!selectedCourseId) return;
    setExporting(true);
    try {
      const response = await axiosInstance.get(
        `/instructor/courses/${selectedCourseId}/students/export/`,
        {
          params: { export_format: exportFormat },
          responseType: "blob",
        }
      );

      const disposition = response.headers["content-disposition"] || "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : `students.${exportFormat}`;

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}`);
    } catch (err) {
      console.error("Error exporting students:", err);
      toast.error("Failed to export students. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const chartData = progressData
    ? [
        { status: "completed", count: progressData.completed, fill: chartConfig.completed.color },
        { status: "inProgress", count: progressData.in_progress, fill: chartConfig.inProgress.color },
        { status: "incomplete", count: progressData.incomplete, fill: chartConfig.incomplete.color },
      ]
    : [];
  const hasProgressActivity = chartData.some((d) => d.count > 0);

  if (error) {
    return <p className="text-destructive text-center py-12">{error}</p>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Students</h1>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={!selectedCourseId || exporting} className="gap-2">
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")} disabled={exporting}>
                <FileText className="h-4 w-4 mr-2" /> Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("xlsx")} disabled={exporting}>
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Export as Excel (.xlsx)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <CardTitle className="text-sm font-medium text-foreground">
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
