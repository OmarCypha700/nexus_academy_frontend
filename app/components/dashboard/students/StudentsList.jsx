// components/dashboard/students/StudentsList.jsx
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
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/instructor/courses/${courseId}/students/`);
        const data = response.data.results || response.data;
        console.log("Student data:", data); // Debug the API response
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students. Please check your connection or try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <DataTable columns={columns} data={students} />;
}