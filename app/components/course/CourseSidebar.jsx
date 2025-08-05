"use client";

import {
  BookMarked,
  CheckCircle,
  PlayCircle,
  FileQuestion,
  X,
  Lock,
  FileText,
} from "lucide-react";
import { Progress } from "@/app/components/ui/progress";
import { Button } from "@/app/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/app/components/ui/tooltip";

export function CourseSidebar({
  course,
  progress,
  currentModule,
  currentLesson,
  currentQuiz,
  completedLessons,
  navigateToLesson,
  navigateToQuiz,
  navigateToAssignment,
  totalLessons,
  completedCount,
  sidebarOpen,
  setSidebarOpen,
}) {
  const closeSidebar = () => {
    if (setSidebarOpen) setSidebarOpen(false);
  };

  // Ensure completedLessons is an array
  const safeCompletedLessons = Array.isArray(completedLessons) ? completedLessons : [];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <div
        className={`
          fixed md:sticky md:top-0 
          top-0 left-0
          w-[85vw] sm:w-72 md:w-64 lg:w-80 
          h-full md:h-[calc(100vh-64px)] 
          bg-white border-r border-gray-200 
          flex-shrink-0 overflow-auto
          z-50 md:z-auto
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-base lg:text-lg truncate pr-2">
            {course?.title || "Untitled Course"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <p className="text-xs lg:text-sm text-gray-600">Your progress:</p>
            <Progress value={progress || 0} className="h-2 flex-grow" />
            <span className="text-sm text-gray-500">{Math.round(progress || 0)}%</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {completedCount || 0} of {totalLessons || 0} lessons completed
          </p>
        </div>

        <div className="p-2 flex-1 overflow-y-auto">
          {course?.modules?.length ? (
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={currentModule?.id?.toString()}
            >
              {course.modules.map((module) => (
                <AccordionItem
                  key={module.id}
                  value={module.id.toString()}
                  className="border-none"
                >
                  <AccordionTrigger className="px-3 py-2 text-sm hover:bg-gray-50">
                    <div className="flex items-center w-full">
                      <BookMarked className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
                      <span className="truncate font-medium">{module.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-4 space-y-1">
                    {module.lessons?.length ? (
                      module.lessons.map((lesson) => (
                        <div key={lesson.id} className="space-y-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={
                                    currentLesson?.id === lesson.id &&
                                    !currentQuiz &&
                                    !lesson.assignments?.some((a) => a.id === currentLesson?.id)
                                      ? "secondary"
                                      : "ghost"
                                  }
                                  className="w-full justify-start text-sm h-auto py-2 px-2"
                                  onClick={() => navigateToLesson(module.id, lesson.id)}
                                  aria-label={`Go to lesson: ${lesson.title}`}
                                >
                                  <div className="flex items-center w-full">
                                    {safeCompletedLessons.includes(lesson.id) ? (
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                                    ) : (
                                      <PlayCircle className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                    )}
                                    <span className="truncate">{lesson.title}</span>
                                  </div>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{lesson.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {lesson.quizzes?.map((quiz) => (
                            <TooltipProvider key={quiz.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={currentQuiz?.id === quiz.id ? "secondary" : "ghost"}
                                    className="w-full justify-start text-sm h-auto py-2 pl-6"
                                    disabled={!quiz.can_attempt || !safeCompletedLessons.includes(lesson.id)}
                                    onClick={() => navigateToQuiz(module.id, lesson.id, quiz.id)}
                                    aria-label={
                                      quiz.can_attempt && safeCompletedLessons.includes(lesson.id)
                                        ? `Take quiz: ${quiz.title}`
                                        : `Quiz unavailable: ${quiz.title}`
                                    }
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center">
                                        <FileQuestion className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                        <span className="truncate">{quiz.title}</span>
                                      </div>
                                      {!safeCompletedLessons.includes(lesson.id) && (
                                        <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                      )}
                                    </div>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {safeCompletedLessons.includes(lesson.id)
                                      ? quiz.can_attempt
                                        ? `Take ${quiz.title} (${quiz.attempts_count}/${quiz.max_attempts} attempts)`
                                        : `No attempts left for ${quiz.title}`
                                      : `Complete "${lesson.title}" to unlock this quiz`}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}

                          {lesson.assignments?.map((assignment) => (
                            <TooltipProvider key={assignment.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={
                                      lesson.assignments.some((a) => a.id === currentLesson?.id)
                                        ? "secondary"
                                        : "ghost"
                                    }
                                    className="w-full justify-start text-sm h-auto py-2 pl-6"
                                    disabled={!safeCompletedLessons.includes(lesson.id)}
                                    onClick={() => navigateToAssignment(module.id, lesson.id, assignment.id)}
                                    aria-label={`View assignment: ${assignment.title}`}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                        <span className="truncate">{assignment.title}</span>
                                      </div>
                                      {!safeCompletedLessons.includes(lesson.id) && (
                                        <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                      )}
                                    </div>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {safeCompletedLessons.includes(lesson.id)
                                      ? `View ${assignment.title}`
                                      : `Complete "${lesson.title}" to unlock this assignment`}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 pl-4">No lessons available</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-gray-600 p-2">No modules available</p>
          )}
        </div>
      </div>
    </>
  );
}