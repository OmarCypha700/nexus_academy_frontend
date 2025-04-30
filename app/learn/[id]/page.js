"use client";

import { useParams } from "next/navigation";
import CourseLearnPage from "@/app/components/CourseLearnPage";

export default function LearnPage() {
  const params = useParams();
  const id = params.id;
  
  return <CourseLearnPage courseId={id} />;
}