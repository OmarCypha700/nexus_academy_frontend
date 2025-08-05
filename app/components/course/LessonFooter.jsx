import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function LessonFooter({
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
    currentLesson.id === course.modules[0].lessons[0].id;

  const isLastLesson =
    currentModule.id === course.modules[course.modules.length - 1].id &&
    currentLesson.id ===
      course.modules[course.modules.length - 1].lessons[
        course.modules[course.modules.length - 1].lessons.length - 1
      ].id;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="outline"
          onClick={navigateToPreviousLesson}
          disabled={isFirstLesson}
          aria-label="Go to previous lesson"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={navigateToNextLesson}
          disabled={isLastLesson}
          aria-label="Go to next lesson"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {!completedLessons.includes(currentLesson.id) && (
          <Button
            variant="default"
            className="ml-auto"
            onClick={() => markLessonComplete(currentLesson.id)}
            aria-label="Mark lesson as complete"
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Complete
          </Button>
        )}
      </div>
    </div>
  );
}