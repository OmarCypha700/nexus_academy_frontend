"use client";

import { useState, useEffect } from "react";
import StudentsList from "@/app/components/dashboard/students/StudentsList";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Skeleton } from "@/app/components/ui/skeleton";
import axiosInstance from "@/app/lib/axios";

export default function InstructorDashboardStudents() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/instructor/courses/");
        setCourses(response.data);
        if (response.data.length > 0) setSelectedCourseId(response.data[0].id);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please check your connection or try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col justify-even items-start gap-4">
          <div className="flex flex-wrap justify-between items-center space-x-2 w-full">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div>
          <StudentsList courseId={null} />
        </div>
        <div className="mt-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center py-12">{error}</p>;

  if (courses.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center py-12 text-muted-foreground text-sm md:text-base">
          No courses available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-even items-start gap-4">
        <div className="flex flex-wrap justify-between items-center space-x-2">
          <Select
            value={selectedCourseId}
            onValueChange={setSelectedCourseId}
          >
            <SelectTrigger className="w-[200px]">
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
          <Button onClick={() => alert("Export CSV functionality to be implemented")}>
            Export CSV
          </Button>
        </div>
      </div>
      <div>
        {selectedCourseId && <StudentsList courseId={selectedCourseId} />}
      </div>
      <div className="mt-4">
        <h3>Course Progress Overview</h3>
        <p>Chart placeholder (implement with canvas panel)</p>
      </div>
      <div>
        <h3>Recent Activities</h3>
        <p>Activity log placeholder (fetch from backend)</p>
      </div>
    </div>
  );
}