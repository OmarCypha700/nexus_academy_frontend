// // app/components/dashboard/course/CourseDetails.js
"use client";

import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import LessonList from "@/app/components/dashboard/lesson/LessonList";
import QuizList from "@/app/components/dashboard/quiz/QuizList";
// import CourseOutcomeDialog from "@/app/components/dashboard/course/CourseOutcomeForm";

export default function CourseDetails({
  course,
  onEditCourse,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onRenameModule,
  onReorderModule,
  onDeleteModule,
  // setSelectedModule,
  setAddModuleOpen,
  openQuizModal,
  openQuestionModal,
  onClose,
  // openOutcomeModal,
  // onOpenChange,
  outcomes,
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{course?.title}</h2>
        <div className="flex gap-2">
          <Button onClick={() => onEditCourse(course)}>Edit Course</Button>
          {/* <Button onClick={() => openOutcomeModal()}>Course Outcome</Button>
          <Button onClick={() => onEditCourse(course)}>
            Course Requirements
          </Button> */}
        </div>
      </div>
      <p className="text-muted-foreground">{course?.description}</p>
      {/* {outcomes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Course Outcomes</h3>
          <ul className="list-disc pl-5">
            {outcomes.map((outcome) => (
              <li key={outcome.id}>{outcome.text}</li>
            ))}
          </ul>
        </div>
      )} */}
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
