"use client";

import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import LessonList from "@/app/components/dashboard/lesson/LessonList";
import QuizList from "@/app/components/dashboard/quiz/QuizList";

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
  onClose,
  onDeleteResource,
  outcomes,
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{course?.title}</h2>
        <div className="flex gap-2">
          <Button onClick={() => onEditCourse(course)}>Edit Course</Button>
        </div>
      </div>
      <p className="text-muted-foreground">{course?.description}</p>
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
      <Button onClick={onClose}>Close</Button>
    </div>
  );
}