"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon,
  Menu,
  X,
  BarChart,
} from "lucide-react";

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
import { DiscussionPanel } from "@/app/components/course/DiscussionPanel";
import { CourseSidebar } from "@/app/components/course/CourseSidebar";

export default function CourseLearnPage({ courseId }) {
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [expandedModules, setExpandedModules] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  // Notes state
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Discussion state
  const [discussionComments, setDiscussionComments] = useState([]);
  const [discussionComment, setDiscussionComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Attempting to fetch course with ID: ${courseId}`);

        if (!courseId) {
          throw new Error("Course ID is missing");
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        // Make the API request
        const response = await fetch(
          `http://localhost:8000/api/enrollments/course/${courseId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Store full response text for debugging
        const responseText = await response.text();
        let data;

        try {
          data = JSON.parse(responseText);
          setApiResponse(data); // Store the raw API response
        } catch (e) {
          console.error("Failed to parse API response:", responseText);
          throw new Error("Invalid response format from API");
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch course: ${response.status} - ${responseText}`
          );
        }

        console.log("Course data received:", data);
        setCourseData(data);

        // Handle empty modules array by creating a default structure
        if (!data.modules || data.modules.length === 0) {
          console.log(
            "No modules found in course data. Creating default structure."
          );

          // Set up a default structure with available course info
          const enhancedData = {
            ...data,
            modules: [
              {
                id: 1,
                title: "Course Content",
                lessons: [],
              },
            ],
          };

          setCourseData(enhancedData);
        }
        // If modules exist but there's no active lesson yet
        else if (
          data.modules &&
          data.modules.length > 0 &&
          data.modules[0].lessons &&
          data.modules[0].lessons.length > 0
        ) {
          setActiveLessonId(data.modules[0].lessons[0].id);

          // Auto-expand the first module
          if (data.modules[0].id) {
            setExpandedModules([data.modules[0].id.toString()]);
          }

          // Load notes for the first lesson
          loadLessonNotes(data.modules[0].lessons[0].id);

          // Load comments for the first lesson
          loadLessonComments(data.modules[0].lessons[0].id);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    } else {
      setError("No course ID provided");
      setLoading(false);
    }
  }, [courseId]);

  const markLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8000/api/enrollments/complete-lesson/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_id: courseId,
            lesson_id: lessonId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to mark lesson as complete (${response.status})`
        );
      }

      // Update local state to reflect completion
      setCourseData((prev) => {
        if (!prev) return null;

        const updatedModules = prev.modules.map((module) => {
          const updatedLessons = module.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson
          );
          return { ...module, lessons: updatedLessons };
        });

        const newCompletedLessons = prev.completed_lessons
          ? [...prev.completed_lessons]
          : [];
        if (!newCompletedLessons.includes(lessonId)) {
          newCompletedLessons.push(lessonId);
        }

        // Recalculate progress
        const totalLessons = updatedModules.reduce(
          (total, module) => total + module.lessons.length,
          0
        );
        const progress = totalLessons
          ? (newCompletedLessons.length / totalLessons) * 100
          : 0;

        return {
          ...prev,
          modules: updatedModules,
          completed_lessons: newCompletedLessons,
          progress: progress,
        };
      });
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  };

  // Get the active lesson
  const getActiveLesson = () => {
    if (!courseData || !courseData.modules) return null;

    for (const module of courseData.modules) {
      if (!module.lessons) continue;
      const lesson = module.lessons.find((l) => l.id === activeLessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  // Get the active module
  const getActiveModule = () => {
    if (!courseData || !courseData.modules) return null;

    for (const module of courseData.modules) {
      if (!module.lessons) continue;
      const lessonExists = module.lessons.some((l) => l.id === activeLessonId);
      if (lessonExists) return module;
    }
    return courseData.modules[0] || null;
  };

  // Navigate to previous lesson
  const navigateToPreviousLesson = () => {
    if (!courseData || !courseData.modules) return;

    let previousLessonId = null;
    let previousModuleId = null;
    let foundCurrent = false;

    // Traverse modules and lessons in reverse to find the previous lesson
    for (let i = courseData.modules.length - 1; i >= 0; i--) {
      const module = courseData.modules[i];
      if (!module.lessons) continue;

      for (let j = module.lessons.length - 1; j >= 0; j--) {
        const lesson = module.lessons[j];

        if (foundCurrent) {
          previousLessonId = lesson.id;
          previousModuleId = module.id;
          break;
        }

        if (lesson.id === activeLessonId) {
          foundCurrent = true;

          // If not the first lesson in this module
          if (j > 0) {
            previousLessonId = module.lessons[j - 1].id;
            previousModuleId = module.id;
            break;
          }
          // Need to get the last lesson from the previous module
          else if (i > 0) {
            const prevModule = courseData.modules[i - 1];
            if (prevModule.lessons && prevModule.lessons.length > 0) {
              previousLessonId =
                prevModule.lessons[prevModule.lessons.length - 1].id;
              previousModuleId = prevModule.id;
              break;
            }
          }
        }
      }

      if (previousLessonId) break;
    }

    if (previousLessonId) {
      setActiveLessonId(previousLessonId);
      loadLessonNotes(previousLessonId);
      loadLessonComments(previousLessonId);
    }
  };

  // Navigate to next lesson
  const navigateToNextLesson = () => {
    if (!courseData || !courseData.modules) return;

    let nextLessonId = null;
    let nextModuleId = null;
    let foundCurrent = false;

    // Find next lesson
    for (let i = 0; i < courseData.modules.length; i++) {
      const module = courseData.modules[i];
      if (!module.lessons) continue;

      for (let j = 0; j < module.lessons.length; j++) {
        const lesson = module.lessons[j];

        if (foundCurrent) {
          nextLessonId = lesson.id;
          nextModuleId = module.id;
          break;
        }

        if (lesson.id === activeLessonId) {
          foundCurrent = true;

          // If not the last lesson in this module
          if (j < module.lessons.length - 1) {
            nextLessonId = module.lessons[j + 1].id;
            nextModuleId = module.id;
            break;
          }
          // Need to get the first lesson from the next module
          else if (i < courseData.modules.length - 1) {
            const nextModule = courseData.modules[i + 1];
            if (nextModule.lessons && nextModule.lessons.length > 0) {
              nextLessonId = nextModule.lessons[0].id;
              nextModuleId = nextModule.id;
              break;
            }
          }
        }
      }

      if (nextLessonId) break;
    }

    if (nextLessonId) {
      setActiveLessonId(nextLessonId);
      loadLessonNotes(nextLessonId);
      loadLessonComments(nextLessonId);
    }
  };

  // Navigate to specific lesson
  const navigateToLesson = (
    moduleId,
    lessonId,
    quizId = null,
    assignmentId = null
  ) => {
    setActiveLessonId(lessonId);
    setSelectedQuizId(quizId);
    setSelectedAssignmentId(assignmentId);
    loadLessonNotes(lessonId);
    loadLessonComments(lessonId);
    setSidebarOpen(false);
  };

  // Helper function to handle module expansion
  const handleModuleToggle = (moduleId) => {
    setExpandedModules((prev) => {
      const id = moduleId.toString();
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Load notes for a lesson
  const loadLessonNotes = (lessonId) => {
    // This would typically be an API call
    // For now, we'll just simulate with empty notes
    setNotes("");
  };

  // Save notes for a lesson
  const saveNotes = async () => {
    if (!activeLessonId) return;

    try {
      setSavingNotes(true);

      // Simulate API call to save notes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Notes saved for lesson ${activeLessonId}: ${notes}`);

      // Success notification could be added here
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setSavingNotes(false);
    }
  };

  // Load comments for a lesson
  const loadLessonComments = (lessonId) => {
    // This would typically be an API call
    // For now, we'll just simulate with empty or mock comments
    setDiscussionComments([
      // Optionally add some mock comments here
    ]);
  };

  // Submit a comment
  const submitComment = async () => {
    if (!activeLessonId || !discussionComment.trim()) return;

    try {
      setSubmittingComment(true);

      // Simulate API call to submit comment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add the new comment to the local state
      const newComment = {
        id: Date.now(),
        user: {
          name: "You",
          avatar: "",
        },
        timestamp: new Date().toLocaleString(),
        content: discussionComment,
      };

      setDiscussionComments((prev) => [newComment, ...prev]);
      setDiscussionComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Calculate total lessons and completed count
  const calculateProgress = () => {
    if (!courseData || !courseData.modules)
      return { totalLessons: 0, completedCount: 0 };

    let totalLessons = 0;

    courseData.modules.forEach((module) => {
      if (module.lessons) {
        totalLessons += module.lessons.length;
      }
    });

    const completedCount = courseData.completed_lessons
      ? courseData.completed_lessons.length
      : 0;

    return { totalLessons, completedCount };
  };

  // API data display for debugging
  const ApiDebugPanel = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>API Response Data</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-auto">
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );

  // Content display when no modules or lessons are available
  const EmptyCourseContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Welcome to {courseData?.title}</h2>
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
              <strong>Duration:</strong> {courseData?.duration || 0}{" "}
              {courseData?.duration === 1 ? "hour" : "hours"}
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

  // Get the current active lesson and module
  const currentLesson = getActiveLesson();
  const currentModule = getActiveModule();
  const { totalLessons, completedCount } = calculateProgress();
  const completedLessons = courseData?.completed_lessons || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 max-w-7xl">
        {/* Top navigation area */}
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/user" className="flex items-center">
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="ml-2">{sidebarOpen ? "Close" : "Menu"}</span>
          </Button>
        </div>

        {/* Show API response for debugging */}
        {/* {apiResponse && <ApiDebugPanel />} */}

        {loading ? (
          <div className="space-y-4 px-2">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <Skeleton className="h-80 md:col-span-1" />
              <Skeleton className="h-96 md:col-span-3" />
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mx-2 mb-6">
            <AlertTitle>Error loading course</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : courseData ? (
          <div className="flex flex-col md:flex-row">
            {/* Use the CourseSidebar component */}
            {courseData.modules && courseData.modules.length > 0 && (
              <CourseSidebar
                course={courseData}
                progress={courseData.progress || 0}
                currentModule={currentModule || {}}
                currentLesson={currentLesson || {}}
                completedLessons={courseData.completed_lessons || []}
                navigateToLesson={navigateToLesson}
                totalLessons={totalLessons}
                completedCount={completedCount}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            )}

            {/* Main content area */}
            <div className="flex-1 md:ml-4 lg:ml-6 p-2 sm:p-4 md:p-0">
              {/* Course Header */}
              <div className="mb-4 md:mb-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  {courseData.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {courseData.instructor &&
                    `Instructor: ${courseData.instructor} · `}
                  Progress: {Math.round(courseData.progress || 0)}%
                </p>
                <Progress
                  value={courseData.progress || 0}
                  className="h-2 mt-2"
                />
              </div>

              {/* Main content card */}
              <Card className="mb-4 md:mb-6 shadow-sm">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  {currentLesson && currentModule ? (
                    <div className="space-y-4 md:space-y-6">
                      {/* LessonHeader component */}
                      <LessonHeader
                        currentModule={currentModule}
                        currentLesson={currentLesson}
                        completedLessons={completedLessons}
                        navigateToPreviousLesson={navigateToPreviousLesson}
                        navigateToNextLesson={navigateToNextLesson}
                        markLessonComplete={markLessonComplete}
                        course={courseData}
                      />

                      <Separator />

                      {/* Lesson Content component */}
                      <LessonContent
                        currentLesson={{
                          ...currentLesson,
                          video_id: currentLesson.video_id || "",
                          content_html:
                            currentLesson.content_html || currentLesson.content || "<p>No content available for this lesson.</p>"
                        }}
                      />

                      {/* Additional resources section */}
                      {currentLesson.resources && currentLesson.resources.length > 0 && (
                        <>
                          <Separator />
                          <AdditionalResources resources={currentLesson.resources} />
                        </>
                      )}

                      {/* Quiz and Assignment sections would go here */}
                      {selectedQuizId && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-4">Quiz</h3>
                          {/* Quiz component would go here */}
                          <Alert>
                            <AlertTitle>Quiz content</AlertTitle>
                            <AlertDescription>
                              Quiz component for ID: {selectedQuizId} would be rendered here.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}

                      {selectedAssignmentId && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-4">Assignment</h3>
                          {/* Assignment component would go here */}
                          <Alert>
                            <AlertTitle>Assignment content</AlertTitle>
                            <AlertDescription>
                              Assignment component for ID: {selectedAssignmentId} would be rendered here.
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

              {/* Notes section */}
              {currentLesson && (
                <Card className="mb-4 md:mb-6 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Your Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col">
                      <textarea
                        className="min-h-32 p-3 border rounded-md mb-4 text-sm"
                        placeholder="Add your notes for this lesson here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <Button
                        onClick={saveNotes}
                        disabled={savingNotes}
                        className="self-end"
                      >
                        {savingNotes ? "Saving..." : "Save Notes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Discussion section */}
              {currentLesson && (
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Discussion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DiscussionPanel
                      comments={discussionComments}
                      commentText={discussionComment}
                      setCommentText={setDiscussionComment}
                      onSubmitComment={submitComment}
                      isSubmitting={submittingComment}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No course data available</p>
          </div>
        )}
      </div>
    </div>
  );
}