"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axios";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Progress } from "@/app/components/ui/progress";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { SendMessageDialog } from "@/app/components/dashboard/students/SendMessageDialog";

export default function StudentDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 max-w-xl">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!student) return <p className="p-6">Student not found.</p>;

  const name = student.student.name || "Student";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-xl">
      <Button variant="ghost" size="sm" className="gap-1 -ml-2" onClick={() => router.back()}>
        <ArrowLeft size={16} /> Back
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-black text-white text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">{student.student.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{student.progress.progress_percent}%</span>
            </div>
            <Progress value={student.progress.progress_percent} className="h-2" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Enrolled</span>
            <span className="font-medium">
              {new Date(student.enrolled_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Button className="gap-2" onClick={() => setIsMessageOpen(true)}>
        <MessageSquare size={16} /> Message Student
      </Button>
      <SendMessageDialog
        student={student}
        open={isMessageOpen}
        onOpenChange={setIsMessageOpen}
      />
    </div>
  );
}
