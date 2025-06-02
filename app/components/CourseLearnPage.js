"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "../lib/axios";
import { ChevronLeftIcon, Menu, X } from "lucide-react";

// Import shadcn UI components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Separator } from "@/app/components/ui/separator";

// Import custom components
import { LessonContent } from "@/app/components/course/LessonContent";
import { AdditionalResources } from "@/app/components/course/AdditionalResources";
import { LessonHeader } from "@/app/components/course/LessonHeader";
import { CourseSidebar } from "@/app/components/course/CourseSidebar";

export default function CourseLearnPage({ courseId }) {
  const router = useRouter();

  // Core state
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  // Get current lesson and module (memoized for performance)
  const { currentLesson, currentModule } = useMemo(() => {
    if (!courseData?.modules || !activeLessonId) {
      return { currentLesson: null, currentModule: null };
    }

    for (const module of courseData.modules) {
      if (!module.lessons) continue;
      const lesson = module.lessons.find((l) => l.id === activeLessonId);
      if (lesson) {
        return { currentLesson: lesson, currentModule: module };
      }
    }
    return { currentLesson: null, currentModule: null };
  }, [courseData, activeLessonId]);

  // Calculate progress (memoized)
  const progressInfo = useMemo(() => {
    if (!courseData?.modules)
      return { totalLessons: 0, completedCount: 0, progress: 0 };

    const totalLessons = courseData.modules.reduce(
      (total, module) => total + (module.lessons?.length || 0),
      0
    );
    const completedCount = courseData.completed_lessons?.length || 0;
    const progress = totalLessons
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

    return { totalLessons, completedCount, progress };
  }, [courseData]);

  // Fetch course data
  const fetchCourseData = useCallback(async () => {
    if (!courseId) {
      setError("Course ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/enrollments/course/${courseId}/`
      );
      const data = response.data;

      // Handle empty modules by creating default structure
      const processedData = {
        ...data,
        modules:
          data.modules?.length > 0
            ? data.modules
            : [
                {
                  id: 1,
                  title: "Course Content",
                  lessons: [],
                },
              ],
      };

      setCourseData(processedData);

      // Set initial active lesson if available
      if (processedData.modules?.[0]?.lessons?.length > 0) {
        const firstLesson = processedData.modules[0].lessons[0];
        setActiveLessonId(firstLesson.id);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Mark lesson as complete
  const markLessonComplete = useCallback(
    async (lessonId) => {
      try {
        await axiosInstance.post("/enrollments/complete-lesson/", {
          course_id: courseId,
          lesson_id: lessonId,
        });

        setCourseData((prev) => {
          if (!prev) return null;

          const newCompletedLessons = [...(prev.completed_lessons || [])];
          if (!newCompletedLessons.includes(lessonId)) {
            newCompletedLessons.push(lessonId);
          }

          return {
            ...prev,
            completed_lessons: newCompletedLessons,
            modules: prev.modules.map((module) => ({
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, completed: true } : lesson
              ),
            })),
          };
        });
      } catch (error) {
        console.error("Error marking lesson complete:", error);
      }
    },
    [courseId]
  );

  // Navigation helpers
  const findAdjacentLesson = useCallback(
    (direction) => {
      if (!courseData?.modules || !activeLessonId) return null;

      const allLessons = [];
      courseData.modules.forEach((module) => {
        if (module.lessons) {
          module.lessons.forEach((lesson) => {
            allLessons.push({ ...lesson, moduleId: module.id });
          });
        }
      });

      const currentIndex = allLessons.findIndex(
        (lesson) => lesson.id === activeLessonId
      );
      if (currentIndex === -1) return null;

      const targetIndex =
        direction === "next" ? currentIndex + 1 : currentIndex - 1;
      return allLessons[targetIndex] || null;
    },
    [courseData, activeLessonId]
  );

  const navigateToNextLesson = useCallback(() => {
    const nextLesson = findAdjacentLesson("next");
    if (nextLesson) {
      setActiveLessonId(nextLesson.id);
    }
  }, [findAdjacentLesson]);

  const navigateToPreviousLesson = useCallback(() => {
    const prevLesson = findAdjacentLesson("prev");
    if (prevLesson) {
      setActiveLessonId(prevLesson.id);
    }
  }, [findAdjacentLesson]);

  const navigateToLesson = useCallback(
    (moduleId, lessonId, quizId = null, assignmentId = null) => {
      setActiveLessonId(lessonId);
      setSelectedQuizId(quizId);
      setSelectedAssignmentId(assignmentId);
      setSidebarOpen(false);
    },
    []
  );

  // Initialize course data
  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // Empty course content component
  const EmptyCourseContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Welcome to {courseData?.title}
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          {courseData?.description || "No description available"}
        </p>
      </div>

      <Alert>
        <AlertTitle>Course content is being prepared</AlertTitle>
        <AlertDescription>
          This course doesn't have any modules or lessons available yet. Please
          check back later.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm sm:text-base">
            <p>
              <strong>Instructor:</strong>{" "}
              {courseData?.instructor || "Not specified"}
            </p>
            <p>
              <strong>Duration:</strong> {courseData?.duration || 0} hours
            </p>
            {courseData?.start_date && (
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(courseData.start_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 max-w-7xl">
          <div className="space-y-4 px-2">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <Skeleton className="h-80 md:col-span-1" />
              <Skeleton className="h-96 md:col-span-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 max-w-7xl">
          <Alert variant="destructive" className="mx-2 mb-6">
            <AlertTitle>Error loading course</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // No course data
  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 max-w-7xl">
          <div className="text-center py-20">
            <p className="text-gray-500">No course data available</p>
          </div>
        </div>
      </div>
    );
  }

  const hasContent =
    courseData.modules?.length > 0 &&
    courseData.modules.some((m) => m.lessons?.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 max-w-7xl">
        {/* Top navigation */}
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/user" className="flex items-center">
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>

          {hasContent && (
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="ml-2">{sidebarOpen ? "Close" : "Menu"}</span>
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          {hasContent && (
            <CourseSidebar
              course={courseData}
              progress={progressInfo.progress}
              currentModule={currentModule || {}}
              currentLesson={currentLesson || {}}
              completedLessons={courseData.completed_lessons || []}
              navigateToLesson={navigateToLesson}
              totalLessons={progressInfo.totalLessons}
              completedCount={progressInfo.completedCount}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          )}

          {/* Main content */}
          <div className="flex-1 md:ml-4 lg:ml-6 p-2 sm:p-4 md:p-0">
            {/* Course header */}
            <div className="mb-4 md:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                {courseData.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {courseData.instructor &&
                  `Instructor: ${courseData.instructor} · `}
                Progress: {progressInfo.progress}%
              </p>
              <Progress value={progressInfo.progress} className="h-2 mt-2" />
            </div>

            {/* Main content card */}
            <Card className="mb-4 md:mb-6 shadow-sm">
              <CardContent className="p-3 sm:p-4 md:p-6">
                {currentLesson && currentModule ? (
                  <div className="space-y-4 md:space-y-6">
                    <LessonHeader
                      currentModule={currentModule}
                      currentLesson={currentLesson}
                      completedLessons={courseData.completed_lessons || []}
                      navigateToPreviousLesson={navigateToPreviousLesson}
                      navigateToNextLesson={navigateToNextLesson}
                      markLessonComplete={markLessonComplete}
                      course={courseData}
                    />

                    <Separator />

                    <LessonContent
                      currentLesson={{
                        ...currentLesson,
                        video_id: currentLesson.video_id || "",
                        content_html:
                          currentLesson.content_html ||
                          currentLesson.content ||
                          "<p>No content available for this lesson.</p>",
                      }}
                    />

                    {/* Additional resources */}
                    {currentLesson.resources?.length > 0 && (
                      <>
                        <Separator />
                        <AdditionalResources
                          resources={currentLesson.resources}
                        />
                      </>
                    )}

                    {/* Quiz section */}
                    {selectedQuizId && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Quiz</h3>
                        <Alert>
                          <AlertTitle>Quiz content</AlertTitle>
                          <AlertDescription>
                            Quiz component for ID: {selectedQuizId} would be
                            rendered here.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {/* Assignment section */}
                    {selectedAssignmentId && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Assignment</h3>
                        <Alert>
                          <AlertTitle>Assignment content</AlertTitle>
                          <AlertDescription>
                            Assignment component for ID: {selectedAssignmentId}{" "}
                            would be rendered here.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyCourseContent />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
