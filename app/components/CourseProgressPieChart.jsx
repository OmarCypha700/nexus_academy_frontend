"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/app/components/ui/chart";
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
import axiosInstance from "../lib/axios";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--chart-3)", // OKLCH color from globals.css
  },
  inProgress: {
    label: "In Progress",
    color: "var(--chart-2)",
  },
  incomplete: {
    label: "Incomplete",
    color: "var(--chart-5)",
  },
};

export default function CourseProgressPieChart() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("all"); // "all" for all courses
  const [chartData, setChartData] = useState([
    { status: "completed", count: 0, fill: chartConfig.completed.color },
    { status: "inProgress", count: 0, fill: chartConfig.inProgress.color },
    { status: "incomplete", count: 0, fill: chartConfig.incomplete.color },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch instructor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/instructor/courses/");
        setCourses(response.data.results || response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      try {
        const url =
          selectedCourseId === "all"
            ? "/instructor/progress-overview/"
            : `/instructor/progress-overview/${selectedCourseId}/`;
        const response = await axiosInstance.get(url);
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];

        let completed = 0;
        let inProgress = 0;
        let incomplete = 0;

        data.forEach((course) => {
          completed += course.completed;
          inProgress += course.in_progress;
          incomplete += course.incomplete;
        });

        setChartData([
          {
            status: "completed",
            count: completed,
            fill: chartConfig.completed.color,
          },
          {
            status: "inProgress",
            count: inProgress,
            fill: chartConfig.inProgress.color,
          },
          {
            status: "incomplete",
            count: incomplete,
            fill: chartConfig.incomplete.color,
          },
        ]);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courses.length > 0) {
      fetchProgressData();
    }
  }, [courses, selectedCourseId]);

  if (loading) return(
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>);
  if (courses.length === 0) return <p>No courses available.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Progress Distribution</CardTitle>
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={{
                fontSize: 16, // Increase font size of data labels
                fill: "var(--foreground)", // Use theme foreground color
                fontWeight: 500, // Optional: make labels bolder
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
