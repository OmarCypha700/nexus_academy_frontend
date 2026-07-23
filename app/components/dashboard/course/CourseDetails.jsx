"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Plus, FileDown } from "lucide-react";
import LessonList from "@/app/components/dashboard/lesson/LessonList";
import QuizList from "@/app/components/dashboard/quiz/QuizList";
import AssignmentList from "@/app/components/dashboard/assignment/AssignmentSection";
import AikenImportExportDialog from "@/app/components/dashboard/quiz/AikenImportExportDialog";
import DOMPurify from "dompurify";

export default function CourseDetails({
  course,
  onEditCourse,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onRenameModule,
  onReorderModule,
  onDeleteModule,
  setAddModuleOpen,
  openQuizModal,
  openQuestionModal,
  openAssignmentModal,
  onClose,
  onDeleteResource,
  outcomes,
}) {
  const [aikenDialogOpen, setAikenDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{course?.title}</h2>
        <div className="flex gap-2">
          <Button onClick={() => onEditCourse(course)}>Edit Course</Button>
          <Button variant="outline" onClick={() => setAikenDialogOpen(true)} className="gap-1">
            <FileDown size={16} /> Export All Questions
          </Button>
        </div>
      </div>
      <div
        className="text-muted-foreground prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(course?.description || "") }}
      />
      <LessonList
        modules={course?.modules || []}
        setAddModuleOpen={setAddModuleOpen}
        onAddLesson={onAddLesson}
        onAddLessonToModule={(moduleId) => onAddLesson(moduleId)}
        onEditLesson={onEditLesson}
        onDeleteLesson={onDeleteLesson}
        onRenameModule={onRenameModule}
        onReorderModule={onReorderModule}
        onDeleteModule={onDeleteModule}
        onDeleteResource={onDeleteResource} // Pass the prop to LessonList
      />
      <QuizList
        courseId={course?.id}
        openQuizModal={openQuizModal}
        openQuestionModal={openQuestionModal}
      />
      <AssignmentList
        courseId={course?.id}
        openAssignmentModal={openAssignmentModal}
      />
      <Button onClick={onClose}>Close</Button>

      <AikenImportExportDialog
        courseId={course?.id}
        mode="course"
        open={aikenDialogOpen}
        onOpenChange={setAikenDialogOpen}
      />
    </div>
  );
}