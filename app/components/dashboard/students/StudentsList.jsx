"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import axiosInstance from "@/app/lib/axios";

export default function StudentsList({ courseId }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!courseId) {
        setStudents([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `/instructor/courses/${courseId}/students/`
        );
        const data = response.data.results || response.data;
        console.log("Student data:", data); // Debug the API response
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError(
          "Failed to load students. Please check your connection or try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center py-12">{error}</p>;

  if (students.length === 0) {
    return (
      <div className="w-[72vw] border border-solid border-gray-400 rounded-lg overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400">
        <div className="text-center py-12 text-muted-foreground text-sm md:text-base">
          No students enrolled
        </div>
      </div>
    );
  }

  return (
    <div className="w-[72vw] border border-solid border-gray-400 rounded-lg overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400">
      <DataTable columns={columns} data={students} />
    </div>
  );
}