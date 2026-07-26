"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { PieChart, Pie, Cell } from "recharts";
import {
  CalendarIcon,
  BookOpenIcon,
  ClipboardListIcon,
  FileQuestion,
  FileText,
  Lock,
  CheckCircle2,
  Clock,
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/app/components/ui/chart";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useAuth } from "@/app/context/AuthContext";
import DOMPurify from "dompurify";

const courseChartConfig = {
  completed: { label: "Completed", color: "var(--chart-3)" },
  inProgress: { label: "In Progress", color: "var(--chart-2)" },
  notStarted: { label: "Not Started", color: "var(--chart-5)" },
};

// Groups a flat list of {course_id, lesson_id, ...} items (quizzes or assignments) into
// { [courseId]: { title, progress_percent, lessons: { [lessonId]: { title, items } } } },
// using lesson titles already present in dashboardData.courses[].modules[].lessons[] — no
// extra API calls needed. Courses with no matching items are omitted entirely.
function groupByCourseAndLesson(items, courses) {
  const grouped = {};
  courses.forEach((course) => {
    const courseItems = items.filter((item) => item.course_id === course.id);
    if (courseItems.length === 0) return;

    const lessonTitles = {};
    course.modules?.forEach((module) => {
      module.lessons?.forEach((lesson) => {
        lessonTitles[lesson.id] = lesson.title;
      });
    });

    const lessons = {};
    courseItems.forEach((item) => {
      if (!lessons[item.lesson_id]) {
        lessons[item.lesson_id] = {
          title: lessonTitles[item.lesson_id] || "Untitled Lesson",
          items: [],
        };
      }
      lessons[item.lesson_id].items.push(item);
    });

    grouped[course.id] = {
      title: course.title,
      progress_percent: course.progress_percent,
      lessons,
    };
  });
  return grouped;
}

function dueDateStatus(dueDate) {
  if (!dueDate) return "none";
  const diffDays = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "soon";
  return "normal";
}

const dueDateBadgeClass = {
  overdue: "bg-destructive/10 text-destructive hover:bg-destructive/10",
  soon: "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/40",
  normal: "bg-muted text-muted-foreground hover:bg-muted",
  none: "bg-muted/50 text-muted-foreground hover:bg-muted/50",
};

const dueDateLabelPrefix = {
  overdue: "Overdue",
  soon: "Due soon",
  normal: "Due",
};

function StatTile({ icon: Icon, label, value, loading, iconClassName }) {
  return (
    <Card className="border shadow-none">
      <CardContent className="flex items-center gap-2 p-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            iconClassName || "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] leading-tight text-muted-foreground truncate">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-5 w-8 rounded" />
          ) : (
            <p className="text-lg font-semibold text-foreground">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

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

  const quizzesByCourseLesson = useMemo(() => {
    if (!dashboardData?.quizzes || !dashboardData?.courses) return {};
    const quizzesWithProgress = dashboardData.quizzes.map((quiz) => ({
      ...quiz,
      lesson_completed: lessonProgressMap[quiz.lesson_id] || false,
    }));
    return groupByCourseAndLesson(quizzesWithProgress, dashboardData.courses);
  }, [dashboardData?.quizzes, dashboardData?.courses, lessonProgressMap]);

  const assignmentsByCourseLesson = useMemo(() => {
    if (!dashboardData?.assignments || !dashboardData?.courses) return {};
    return groupByCourseAndLesson(dashboardData.assignments, dashboardData.courses);
  }, [dashboardData?.assignments, dashboardData?.courses]);

  const courseStatusData = useMemo(() => {
    const courses = dashboardData?.courses || [];
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    courses.forEach((course) => {
      if (isCourseCompleted(course)) completed += 1;
      else if ((course.progress_percent || 0) > 0) inProgress += 1;
      else notStarted += 1;
    });
    return [
      { status: "completed", label: "Completed", count: completed, fill: courseChartConfig.completed.color },
      { status: "inProgress", label: "In Progress", count: inProgress, fill: courseChartConfig.inProgress.color },
      { status: "notStarted", label: "Not Started", count: notStarted, fill: courseChartConfig.notStarted.color },
    ];
  }, [dashboardData?.courses, lessonProgressMap]);

  const upcomingDeadlinesCount = useMemo(() => {
    if (!dashboardData?.assignments) return 0;
    return dashboardData.assignments.filter((a) => {
      const s = dueDateStatus(a.due_date);
      return s === "overdue" || s === "soon";
    }).length;
  }, [dashboardData?.assignments]);

  const hasCourseActivity = courseStatusData.some((d) => d.count > 0);

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.username || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Welcome back, {user?.last_name} {user?.first_name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Let&apos;s continue your learning journey
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <Card className="border shadow-none">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-medium text-foreground">
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {loading ? (
                <Skeleton className="h-[180px] w-full rounded" />
              ) : hasCourseActivity ? (
                <ChartContainer config={courseChartConfig} className="mx-auto h-[180px] w-full">
                  <PieChart>
                    <Pie
                      data={courseStatusData}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={45}
                      outerRadius={70}
                      strokeWidth={2}
                    >
                      {courseStatusData.map((entry) => (
                        <Cell key={entry.status} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend
                      content={<ChartLegendContent nameKey="status" className="flex-wrap gap-x-4 gap-y-1" />}
                      wrapperStyle={{ width: "100%" }}
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Enroll in a course to see your progress here.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 content-start">
            <StatTile
              icon={BookOpenIcon}
              label="Enrolled Courses"
              loading={loading}
              value={dashboardData?.courses?.length || 0}
              iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
            />
            <StatTile
              icon={CheckCircle2}
              label="Completed"
              loading={loading}
              value={dashboardData?.courses?.filter((c) => isCourseCompleted(c)).length || 0}
              iconClassName="bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
            />
            <StatTile
              icon={Clock}
              label="Upcoming Deadlines"
              loading={loading}
              value={upcomingDeadlinesCount}
              iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
            />
          </div>
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
                  <Card key={course.id} className="overflow-hidden border shadow-none hover:shadow-sm transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription
                        className="line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(course.description || ""),
                        }}
                      />
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
                            ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40"
                            : "bg-muted text-muted-foreground hover:bg-muted/70"
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
                        className={"hover:bg-primary hover:text-primary-foreground"}
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
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardListIcon className="mr-2 h-5 w-5" /> Assignments
                </CardTitle>
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
                ) : Object.keys(assignmentsByCourseLesson).length ? (
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(assignmentsByCourseLesson).map(
                      ([courseId, course]) => (
                        <AccordionItem key={courseId} value={`a-course-${courseId}`} className="border-b">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <BookOpenIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                                <span className="font-medium text-foreground">{course.title}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  course.progress_percent === 100
                                    ? "ml-2 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40"
                                    : "ml-2 bg-muted text-muted-foreground hover:bg-muted/70"
                                }
                              >
                                {course.progress_percent}% Complete
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Accordion type="single" collapsible className="w-full pl-4">
                              {Object.entries(course.lessons).map(([lessonId, lesson]) => (
                                <AccordionItem
                                  key={lessonId}
                                  value={`a-lesson-${courseId}-${lessonId}`}
                                  className="border-b-0"
                                >
                                  <AccordionTrigger className="hover:no-underline py-2 text-sm">
                                    <span className="flex items-center gap-2 text-foreground">
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                      {lesson.title}
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-2 pl-6">
                                      {lesson.items.map((assignment) => {
                                        const status = dueDateStatus(assignment.due_date);
                                        return (
                                          <button
                                            key={assignment.id}
                                            type="button"
                                            onClick={() =>
                                              router.push(
                                                `/learn/${courseId}?assignmentId=${assignment.id}&lessonId=${lessonId}`
                                              )
                                            }
                                            className="w-full flex items-center justify-between gap-2 rounded-lg border p-3 text-left hover:bg-muted transition-colors"
                                          >
                                            <span className="flex items-center gap-2 text-sm font-medium text-foreground truncate">
                                              <ClipboardListIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                              <span className="truncate">{assignment.title}</span>
                                            </span>
                                            <Badge className={`shrink-0 ${dueDateBadgeClass[status]}`}>
                                              <CalendarIcon className="mr-1 h-3 w-3" />
                                              {status === "none"
                                                ? "No due date"
                                                : `${dueDateLabelPrefix[status]} ${formatDate(assignment.due_date)}`}
                                            </Badge>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground">
                    No assignments yet. Enjoy your free time!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes">
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpenIcon className="mr-2 h-5 w-5" /> Available Quizzes
                </CardTitle>
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
                ) : Object.keys(quizzesByCourseLesson).length ? (
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(quizzesByCourseLesson).map(
                      ([courseId, course]) => (
                        <AccordionItem key={courseId} value={`q-course-${courseId}`} className="border-b">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <BookOpenIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                                <span className="font-medium text-foreground">{course.title}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  course.progress_percent === 100
                                    ? "ml-2 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40"
                                    : "ml-2 bg-muted text-muted-foreground hover:bg-muted/70"
                                }
                              >
                                {course.progress_percent}% Complete
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Accordion type="single" collapsible className="w-full pl-4">
                              {Object.entries(course.lessons).map(([lessonId, lesson]) => (
                                <AccordionItem
                                  key={lessonId}
                                  value={`q-lesson-${courseId}-${lessonId}`}
                                  className="border-b-0"
                                >
                                  <AccordionTrigger className="hover:no-underline py-2 text-sm">
                                    <span className="flex items-center gap-2 text-foreground">
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                      {lesson.title}
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-2 pl-6">
                                      {lesson.items.map((quiz) => (
                                        <TooltipProvider key={quiz.id}>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                className="w-full justify-between text-left h-auto py-2 border"
                                                disabled={!quiz.lesson_completed || !quiz.can_attempt}
                                                onClick={() =>
                                                  router.push(
                                                    `/learn/${courseId}?quizId=${quiz.id}&lessonId=${lessonId}`
                                                  )
                                                }
                                                aria-label={
                                                  quiz.lesson_completed && quiz.can_attempt
                                                    ? `Take quiz: ${quiz.title}`
                                                    : `Quiz unavailable: ${quiz.title}`
                                                }
                                              >
                                                <div className="flex items-center justify-between w-full">
                                                  <div className="flex items-center">
                                                    <FileQuestion className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span className="text-sm truncate">{quiz.title}</span>
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                    <Badge
                                                      variant={quiz.lesson_completed ? "default" : "secondary"}
                                                    >
                                                      {quiz.lesson_completed
                                                        ? `${quiz.attempts_count}/${quiz.max_attempts} Attempts`
                                                        : "Lesson Incomplete"}
                                                    </Badge>
                                                    {!quiz.lesson_completed && (
                                                      <Lock className="h-4 w-4 text-muted-foreground/60" />
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
                              ))}
                            </Accordion>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground">
                    No quizzes available at the moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
