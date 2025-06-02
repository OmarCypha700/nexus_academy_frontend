"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axios";
import {
  Clock,
  BookOpen,
  Star,
  Users,
  ExternalLink,
  PlayCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useAuth } from "@/app/context/AuthContext";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

useEffect(() => {
  const fetchCourseData = async () => {
    try {
      // Fetch course data
      const courseRes = await axiosInstance.get(`courses/${id}/`);
      const courseData = courseRes.data;
      console.log("Course data received:", courseData);
      setCourse(courseData);

      // Check if user is enrolled
      if (user) {
        const enrollmentRes = await axiosInstance.get(`enrollments/check/${id}/`);
        setIsEnrolled(enrollmentRes.data.enrolled);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.detail || error.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchCourseData();
  }
}, [id, user]);

  // Pre-load the thumbnail image to check if it's available
  useEffect(() => {
    if (course?.intro_video_id) {
      const img = new Image();
      img.onerror = () => setThumbnailError(true);
      img.src = `https://img.youtube.com/vi/${course.intro_video_id}/maxresdefault.jpg`;
    }
  }, [course]);

  // Function to get the best available YouTube thumbnail
  const getYouTubeThumbnail = (videoId) => {
    if (thumbnailError) {
      // Fallback to high quality thumbnail if maxres is not available
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

const handleEnroll = async () => {
  if (!user) {
    router.push('/login?redirect=' + encodeURIComponent(`/courses/${id}`));
    return;
  }

  if (isEnrolled) {
    router.push(`/learn/${id}`);
    return;
  }

  setEnrolling(true);
  try {
    const res = await axiosInstance.post("/enroll/", { course_id: id });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(res.data?.detail || "Failed to enroll in course");
    }

    setIsEnrolled(true);
    router.push(`/learn/${id}`);
  } catch (err) {
    console.error("Enrollment error:", err);
    setError(err.response?.data?.detail || err.message || "Enrollment failed");
  } finally {
    setEnrolling(false);
  }
};

  // Skeleton loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Image Skeleton */}
        <Skeleton className="h-96 w-full" />

        {/* Content Skeleton */}
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />

              <div className="flex space-x-4 my-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-24" />
              </div>

              <Skeleton className="h-10 w-40 mb-4" />

              {/* Tabs Skeleton */}
              <div className="mt-8">
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Video Skeleton */}
              <Skeleton className="aspect-video w-full rounded-lg" />

              {/* Card Skeleton */}
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Course Not Found</AlertTitle>
          <AlertDescription>
            The course you&apos;re looking for doesn&apos;t exist or you don&apos;t have access
            to it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatCourseLength = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} minutes`;
    return `${hours} hour${hours > 1 ? "s" : ""} ${
      mins > 0 ? `${mins} min` : ""
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-96 bg-gray-900">
        {course.intro_video_id && (
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url(${getYouTubeThumbnail(
                course.intro_video_id
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <Badge className="mb-4" variant="secondary">
                {course.category || "Course"}
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-gray-200 text-lg max-w-2xl mb-6 line-clamp-2">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                {course.instructor_details && (
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      Instructor: {course.instructor_details.first_name}{" "}
                      {course.instructor_details.last_name}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    {course.duration
                      ? formatCourseLength(course.duration)
                      : "5+ hours"}
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  <span>{course.rating || "4.7"}/5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{course.description}</p>
                    <p className="text-gray-700 mt-4">
                      This comprehensive course will take you through all the
                      essential concepts and give you practical, hands-on
                      experience. By the end, you&apos;ll have the skills and
                      confidence to apply these principles in real-world
                      scenarios.
                    </p>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div>
                  <h3 className="text-xl font-bold mb-3">What You&apos;ll Learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {course.outcomes?.map((outcome) => (
                      <li key={outcome.id} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{outcome.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-xl font-bold mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {course.requirements?.map((requirement) => (
                      <li key={requirement.id} className="flex items-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-700 mr-2"></div>
                        <span>{requirement.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              {/* Curriculum Tab - From API*/}
              <TabsContent value="curriculum" className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                <div className="space-y-3">
                  {course.modules?.map((module, index) => (
                    <Card key={module.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            Module {index + 1}: {module.title}
                          </CardTitle>
                          <Badge variant="outline" className="ml-2">
                            {module.duration} min
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        {module.lessons?.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center text-sm text-gray-500 mt-2"
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            <span>{lesson.title}</span>
                            <Badge variant="outline" className="ml-auto">
                              {lesson.duration} min
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent value="instructor" className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Your Instructor</h2>

                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={null} alt="Instructor" />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {course.instructor_details
                        ? `${course.instructor_details.first_name.charAt(
                            0
                          )}${course.instructor_details.last_name.charAt(0)}`
                        : "IN"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">
                      {course.instructor_details
                        ? `${course.instructor_details.first_name} ${course.instructor_details.last_name}`
                        : "Instructor Name"}
                    </h3>
                    <p className="text-gray-600">
                      {course.instructor_details?.position ||
                        "Subject Matter Expert"}
                    </p>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700">
                    {course.instructor_details?.bio ||
                      `An experienced instructor with a passion for teaching and expertise in this field.
                      With years of practical experience and a dedicated approach to education, they
                      will guide you through this course with clarity and insight.`}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Enrollment and Video */}
          <div className="space-y-6">
            {/* Preview Video */}
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${course.intro_video_id}`}
                title="Course Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              ></iframe>
            </div>

            {/* Enrollment Card */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">
                  ${course.price}
                </CardTitle>
                {isEnrolled ? (
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 mb-2"
                  >
                    Already Enrolled
                  </Badge>
                ) : null}
                <CardDescription>
                  Full lifetime access to course content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>
                      {course.modules.length} modules with detailed lessons
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Downloadable resources & exercises</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Completion certificate</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>24/7 support</span>
                  </li>
                </ul>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling
                    ? "Processing..."
                    : isEnrolled
                    ? "Continue Learning"
                    : "Enroll Now"}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  30-day money-back guarantee, no questions asked
                </p>
              </CardContent>
            </Card>

            {/* Share Button */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Share this course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}