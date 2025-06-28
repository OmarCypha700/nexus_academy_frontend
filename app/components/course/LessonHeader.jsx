import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

export function LessonHeader({
  currentModule,
  currentLesson,
  completedLessons,
  navigateToPreviousLesson,
  navigateToNextLesson,
  markLessonComplete,
  course,
}) {
  const isFirstLesson =
    currentModule.id === course.modules[0].id &&
    currentLesson.id === currentModule.lessons[0].id;

  const isLastLesson =
    currentModule.id === course.modules[course.modules.length - 1].id &&
    currentLesson.id === currentModule.lessons[currentModule.lessons.length - 1].id;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
        <Badge
          variant={completedLessons.includes(currentLesson.id) ? "success" : "outline"}
          className={
            completedLessons.includes(currentLesson.id)
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : ""
          }
        >
          {completedLessons.includes(currentLesson.id) ? "Completed" : "In Progress"}
        </Badge>
      </div>
      <p className="text-gray-500 mb-4">
        <span className="font-medium">{currentModule.title}</span> •{" "}
        {currentLesson.duration && `${currentLesson.duration} min`}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="outline"
          onClick={navigateToPreviousLesson}
          disabled={isFirstLesson}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={navigateToNextLesson}
          disabled={isLastLesson}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {!completedLessons.includes(currentLesson.id) && (
          <Button
            variant="default"
            className="ml-auto"
            onClick={() => markLessonComplete(currentLesson.id)}
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Complete
          </Button>
        )}
      </div>
    </div>
  );
}
