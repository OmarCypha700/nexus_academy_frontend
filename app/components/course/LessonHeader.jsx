import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

export function LessonHeader({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  isCompleted,
  currentModule,
  course,
}) {
  // Defensive checks
  if (!lesson || !course?.modules?.length) {
    return (
      <div className="mb-6">
        <p className="text-gray-500">No lesson selected</p>
      </div>
    );
  }

  const isFirstLesson =
    currentModule?.id &&
    course.modules[0]?.id &&
    lesson.id &&
    course.modules[0].lessons[0]?.id &&
    currentModule.id === course.modules[0].id &&
    lesson.id === course.modules[0].lessons[0].id;

  const isLastLesson =
    currentModule?.id &&
    course.modules[course.modules.length - 1]?.id &&
    lesson.id &&
    course.modules[course.modules.length - 1].lessons[
      course.modules[course.modules.length - 1].lessons.length - 1
    ]?.id &&
    currentModule.id === course.modules[course.modules.length - 1].id &&
    lesson.id ===
      course.modules[course.modules.length - 1].lessons[
        course.modules[course.modules.length - 1].lessons.length - 1
      ].id;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h1 className="text-2xl font-bold">{lesson.title || "Untitled Lesson"}</h1>
        <Badge
          variant={isCompleted ? "success" : "outline"}
          className={isCompleted ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
        >
          {isCompleted ? "Completed" : "In Progress"}
        </Badge>
      </div>
      <p className="text-gray-500 mb-4">
        <span className="font-medium">{currentModule?.title || "Unknown Module"}</span> •{" "}
        {lesson.duration ? `${lesson.duration} min` : "Duration not specified"}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!hasPrevious || isFirstLesson}
          aria-label="Go to previous lesson"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={onNext}
          disabled={!hasNext || isLastLesson}
          aria-label="Go to next lesson"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {!isCompleted && (
          <Button
            variant="default"
            className="ml-auto"
            onClick={() => onComplete(lesson.id)}
            aria-label="Mark lesson as complete"
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Complete
          </Button>
        )}
      </div>
    </div>
  );
}