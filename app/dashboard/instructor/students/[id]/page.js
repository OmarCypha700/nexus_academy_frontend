// app/dashboard/students/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/lib/axios";
import { Button } from "@/app/components/ui/button";

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/instructor/students/${id}/`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
        setError("Failed to load student details. Please check your connection or try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!student) return <p>Student not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold">Student Details</h2>
      <div className="grid gap-4">
        <div>
          <h3 className="font-medium">Name</h3>
          <p>{student.student.name}</p>
        </div>
        <div>
          <h3 className="font-medium">Email</h3>
          <p>{student.student.email}</p>
        </div>
        <div>
          <h3 className="font-medium">Progress</h3>
          <p>{student.progress.progress_percent}%</p>
        </div>
        <div>
          <h3 className="font-medium">Enrolled</h3>
          <p>{new Date(student.enrolled_at).toLocaleDateString()}</p>
        </div>
      </div>
      <Button
        variant="default"
        onClick={() => alert(`Initiate chat with ${student.student.name}`)} // Placeholder
      >
        Message Student
      </Button>
    </div>
  );
}