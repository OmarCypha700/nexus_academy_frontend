"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios"
import Link from "next/link";

import { CalendarIcon, BookOpenIcon, GraduationCapIcon, ClipboardListIcon } from "lucide-react";
// Import shadcn UI components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardPage() {
  // const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const {user} = useAuth();
 
  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("accessToken");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  if (!token) {
    // Redirect to login with error message
    router.push(`/login?error=${encodeURIComponent("You must be logged in to access the dashboard.")}`);
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
}, []);

  const initials = (user?.last_name?.[0] || "") + (user?.first_name?.[0] || "")

  // Format date in a more readable way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.username || "User"} />
              <AvatarFallback className="bg-black text-white">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.last_name} {user?.first_name}
              </h1>
              <p className="text-gray-600">Let's continue your learning journey</p>
            </div>
          </div>
          <Button>
          <Link href="/courses"> Browse Courses </Link>
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(3).fill().map((_, i) => (
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
                        <Progress value={course.progress_percent} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      <Badge variant={course.progress_percent === 100 ? "success" : "outline"}>
                        {course.progress_percent === 100 ? "Completed" : "In Progress"}
                      </Badge>
                      <Button asChild variant="outline" size="sm">
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
                      You haven't enrolled in any courses. Browse our catalog to get started.
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

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ClipboardListIcon className="mr-2 h-5 w-5" /> Pending Assignments
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  Array(3).fill().map((_, i) => (
                    <div key={i} className="py-2 space-y-2">
                      <Skeleton className="h-6 w-3/4 rounded" />
                      <Skeleton className="h-4 w-1/4 rounded" />
                    </div>
                  ))
                ) : dashboardData?.upcoming_assignments?.length ? (
                  <div className="space-y-4">
                    {dashboardData.upcoming_assignments.map((assignment) => (
                      <div key={assignment.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {assignment.description?.substring(0, 100) || "No description available"}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="flex items-center">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {formatDate(assignment.due_date)}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No pending assignments. Enjoy your free time!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
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
                  Array(3).fill().map((_, i) => (
                    <div key={i} className="py-2 space-y-2">
                      <Skeleton className="h-6 w-1/2 rounded" />
                      <Skeleton className="h-4 w-1/4 rounded" />
                    </div>
                  ))
                ) : dashboardData?.quizzes?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData.quizzes.map((quiz) => (
                      <Card key={quiz.id} className="border">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-500">
                            {quiz.description || "Test your knowledge with this quiz"}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm">Take Quiz</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No quizzes available at the moment.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Cards (always visible) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-12 rounded" />
                ) : (
                  dashboardData?.courses?.filter(c => c.progress_percent === 100).length || 0
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
                  dashboardData?.courses?.filter(c => c.progress_percent > 0 && c.progress_percent < 100).length || 0
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Study Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-12 rounded" />
                ) : (
                  "12h"  // This would ideally come from the API
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}