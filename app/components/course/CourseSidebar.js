// app/components/course/CourseSidebar.js
import { BookMarked, CheckCircle, PlayCircle, FileQuestion } from "lucide-react";
import { Progress } from "@/app/components/ui/progress";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

export function CourseSidebar({
  course,
  progress,
  currentModule,
  currentLesson,
  currentQuiz,
  completedLessons,
  navigateToLesson,
  navigateToQuiz,
  totalLessons,
  completedCount,
  sidebarOpen,
  setSidebarOpen,
}) {
  // Handle sidebar close on mobile
  const closeSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      <div
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          transition-transform duration-200 
          fixed md:sticky md:top-0 
          w-[85vw] sm:w-72 md:w-64 lg:w-80 
          h-full md:h-[calc(100vh-64px)] 
          bg-white border-r border-gray-200 
          flex-shrink-0 overflow-auto
          z-40
        `}
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-base lg:text-lg truncate">{course.title}</h2>
          {/* Close button visible only on mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </Button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center">
            <p className="text-xs lg:text-sm text-gray-500 mr-2">Your progress:</p>
            <Progress value={progress} className="h-2 flex-grow" />
            <span className="text-xs text-gray-500 ml-2">{Math.round(progress)}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {completedCount} of {totalLessons} lessons completed
          </p>
        </div>

        <div className="p-2 pb-20 md:pb-4"> {/* Added padding at bottom for mobile */}
          <div className="space-y-1">
            {course.modules.map((module) => (
              <Accordion
                key={module.id}
                type="single"
                collapsible
                defaultValue={module.id === currentModule?.id ? module.id.toString() : undefined}
                className="border rounded-md"
              >
                <AccordionItem value={module.id.toString()} className="border-none">
                  <AccordionTrigger className="px-3 py-2 text-left hover:bg-gray-50 text-sm">
                    <div className="flex items-center">
                      <BookMarked className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">{module.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 pl-2 sm:pl-4">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="space-y-1">
                          {/* Video Lesson Button */}
                          <Button
                            variant={currentLesson?.id === lesson.id && !currentQuiz ? "secondary" : "ghost"}
                            className={`w-full justify-start text-xs sm:text-sm pl-2 ${completedLessons.includes(lesson.id) ? "text-gray-500" : ""}`}
                            onClick={() => {
                              navigateToLesson(module.id, lesson.id);
                              closeSidebar();
                            }}
                          >
                            <div className="flex items-center w-full">
                              {completedLessons.includes(lesson.id) ? (
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-green-500 flex-shrink-0" />
                              ) : (
                                <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                              )}
                              <span className="truncate text-left">{lesson.title}</span>
                              {lesson.duration && (
                                <span className="ml-auto text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                                  {lesson.duration} min
                                </span>
                              )}
                            </div>
                          </Button>
                          
                          {/* Associated Quiz Button (if the lesson has a quiz) */}
                          {lesson.quizzes?.map((quiz) => (
                            <Button
                              key={quiz.id}
                              variant={currentQuiz?.id === quiz.id ? "secondary" : "ghost"}
                              className="w-full justify-start text-xs sm:text-sm pl-6 text-gray-600"
                              onClick={() => {
                                navigateToQuiz(module.id, lesson.id, quiz.id);
                                closeSidebar();
                              }}
                            >
                              <div className="flex items-center w-full">
                                {completedLessons.includes(`quiz-${quiz.id}`) ? (
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-green-500 flex-shrink-0" />
                                ) : (
                                  <FileQuestion className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                                )}
                                <span className="truncate">Quiz: {quiz.title}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>

        <div className="p-3 border-t sticky bottom-0 bg-white shadow-md">
          <Card className="bg-gray-50">
            <CardContent className="p-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary mr-2">
                  <path d="M3 3v18h18"></path>
                  <path d="m3 11 8-8 4 4 6-6"></path>
                  <path d="m14 10 3-3 4 4"></path>
                </svg>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Your Stats</p>
                  <p className="text-xs text-gray-500">
                    {completedCount} of {totalLessons} lessons completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}