"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axios";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";

export default function AssignmentList({ courseId, openAssignmentModal }) {
  const [assignments, setAssignments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
    fetchLessons();
  }, [courseId]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/assignments/?course_id=${courseId}`);
      setAssignments(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load assignments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/lessons/`);
      setLessons(response.data);
    } catch (err) {
      console.error("Failed to load lessons:", err);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm("Delete this assignment?")) return;
    try {
      await axiosInstance.delete(`/assignments/${assignmentId}/`);
      setAssignments(assignments.filter((a) => a.id !== assignmentId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete assignment");
    }
  };

  const lessonTitle = (lessonId) =>
    lessons.find((l) => l.id === lessonId)?.title || "Unassigned";

  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Assignments</h3>
        <Button onClick={() => openAssignmentModal(null)} className="gap-1">
          <Plus size={16} /> New Assignment
        </Button>
      </div>
      {assignments.length === 0 ? (
        <p className="text-muted-foreground">No assignments available.</p>
      ) : (
        <ul className="space-y-2">
          {assignments.map((assignment) => (
            <li
              key={assignment.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <div>
                <p className="font-medium">{assignment.title}</p>
                <p className="text-sm text-muted-foreground">
                  {lessonTitle(assignment.lesson)}
                  {assignment.due_date &&
                    ` · Due ${new Date(assignment.due_date).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAssignmentModal(assignment)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAssignment(assignment.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
