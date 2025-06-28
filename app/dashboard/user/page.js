"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import Link from "next/link";
import {
  CalendarIcon,
  BookOpenIcon,
  ClipboardListIcon,
  FileQuestion,
  Lock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push(
        `/login?error=${encodeURIComponent(
          "You must be logged in to access the dashboard."
        )}`
      );
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/user-dashboard/");
        setDashboardData(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const initials = (user?.last_name?.[0] || "") + (user?.first_name?.[0] || "");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Map lesson progress for quick lookup
  const lessonProgressMap = useMemo(() => {
    if (!dashboardData?.lesson_progress) return {};
    return dashboardData.lesson_progress.reduce((map, progress) => {
      map[progress.lesson_id] = progress.completed;
      return map;
    }, {});
  }, [dashboardData?.lesson_progress]);

  // Group quizzes by course
  const quizzesByCourse = useMemo(() => {
    if (!dashboardData?.quizzes || !dashboardData?.courses) return {};
    const grouped = {};
    dashboardData.courses.forEach((course) => {
      grouped[course.id] = {
        title: course.title,
        progress_percent: course.progress_percent,
        quizzes: dashboardData.quizzes
          .filter((quiz) => quiz.course_id === course.id)
          .map((quiz) => ({
            ...quiz,
            lesson_completed: lessonProgressMap[quiz.lesson_id] || false,
          })),
      };
    });
    return grouped;
  }, [dashboardData, lessonProgressMap]);

  // Check if a course is completed
  const isCourseCompleted = (course) => {
    if (!course.modules || !dashboardData?.lesson_progress) return false;
    const lessonIds = course.modules.flatMap(
      (module) => module.lessons?.map((lesson) => lesson.id) || []
    );
    return (
      lessonIds.length > 0 && lessonIds.every((id) => lessonProgressMap[id])
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.username || "User"} />
              <AvatarFallback className="bg-black text-white">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.last_name} {user?.first_name}
              </h1>
              <p className="text-gray-600">
                Let&apos;s continue your learning journey
              </p>
            </div>
          </div>
          <Button>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(3)
                  .fill()
                  .map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-32 w-full rounded-xl" />
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-4 w-1/2 rounded" />
                    </div>
                  ))
              ) : dashboardData?.courses?.length ? (
                dashboardData.courses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress_percent}%</span>
                        </div>
                        <Progress
                          value={course.progress_percent}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      <Badge
                        variant={
                          isCourseCompleted(course) ? "success" : "outline"
                        }
                        className={
                          isCourseCompleted(course)
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      >
                        {isCourseCompleted(course)
                          ? "Completed"
                          : "In Progress"}
                      </Badge>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className={"hover:bg-black hover:text-white"}
                      >
                        <Link href={`/learn/${course.id}`}>Continue</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No courses yet</CardTitle>
                    <CardDescription>
                      You haven&apos;t enrolled in any courses. Browse our
                      catalog to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ClipboardListIcon className="mr-2 h-5 w-5" /> Pending
                    Assignments
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  Array(3)
                    .fill()
                    .map((_, i) => (
                      <div key={i} className="py-2 space-y-2">
                        <Skeleton className="h-6 w-3/4 rounded" />
                        <Skeleton className="h-4 w-1/4 rounded" />
                      </div>
                    ))
                ) : dashboardData?.upcoming_assignments?.length ? (
                  <div className="space-y-4">
                    {dashboardData.upcoming_assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {assignment.description?.substring(0, 100) ||
                                "No description available"}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className="flex items-center"
                            >
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {formatDate(assignment.due_date)}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No pending assignments. Enjoy your free time!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BookOpenIcon className="mr-2 h-5 w-5" /> Available Quizzes
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  Array(3)
                    .fill()
                    .map((_, i) => (
                      <div key={i} className="py-2 space-y-2">
                        <Skeleton className="h-6 w-1/2 rounded" />
                        <Skeleton className="h-4 w-1/4 rounded" />
                      </div>
                    ))
                ) : Object.keys(quizzesByCourse).length ? (
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(quizzesByCourse).map(
                      ([courseId, course]) =>
                        course.quizzes.length > 0 && (
                          <AccordionItem
                            key={courseId}
                            value={courseId}
                            className="border-b"
                          >
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <BookOpenIcon className="h-5 w-5 mr-2 text-gray-600" />
                                  <span className="font-medium text-gray-800">
                                    {course.title}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    course.progress_percent ===100
                                      ? "ml-2 bg-green-100 text-green-800 hover:bg-green-200"
                                      : "ml-2 bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  }
                                >
                                  {course.progress_percent}% Complete
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pl-4">
                                {course.quizzes.map((quiz) => (
                                  <TooltipProvider key={quiz.id}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="w-full justify-between text-left h-auto py-2"
                                          disabled={
                                            !quiz.lesson_completed ||
                                            !quiz.can_attempt
                                          }
                                          onClick={() =>
                                            router.push(
                                              `/learn/${quiz.course_id}?quizId=${quiz.id}&lessonId=${quiz.lesson_id}`
                                            )
                                          }
                                          aria-label={
                                            quiz.lesson_completed &&
                                            quiz.can_attempt
                                              ? `Take quiz: ${quiz.title}`
                                              : `Quiz unavailable: ${quiz.title}`
                                          }
                                        >
                                          <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                              <FileQuestion className="h-4 w-4 mr-2 text-gray-500" />
                                              <span className="text-sm truncate">
                                                {quiz.title}
                                              </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Badge
                                                variant={
                                                  quiz.lesson_completed
                                                    ? "default"
                                                    : "secondary"
                                                }
                                              >
                                                {quiz.lesson_completed
                                                  ? `${quiz.attempts_count}/${quiz.max_attempts} Attempts`
                                                  : "Lesson Incomplete"}
                                              </Badge>
                                              {!quiz.lesson_completed && (
                                                <Lock className="h-4 w-4 text-gray-400" />
                                              )}
                                            </div>
                                          </div>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {quiz.lesson_completed
                                            ? quiz.can_attempt
                                              ? `Take ${quiz.title} (${quiz.attempts_count}/${quiz.max_attempts} attempts used)`
                                              : "No attempts remaining"
                                            : "Complete the associated lesson to unlock this quiz"}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                    )}
                  </Accordion>
                ) : (
                  <p className="text-gray-500">
                    No quizzes available at the moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-12 rounded" />
                ) : (
                  dashboardData?.courses?.filter((c) => isCourseCompleted(c))
                    .length || 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-12 rounded" />
                ) : (
                  dashboardData?.courses?.filter(
                    (c) => c.progress_percent > 0 && !isCourseCompleted(c)
                  ).length || 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Study Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-12 rounded" /> : "12h"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
