"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { Pencil, BookOpen, FileText, Video, Trash2, Plus } from "lucide-react";

// Import shadcn components
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [introVideoId, setIntroVideoId] = useState("");

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/courses/");
      setCourses(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Could not load courses");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setPlaylistId("");
    setIntroVideoId("");
    setError(null);
    setSuccess(null);
    setEditMode(false);
    setSelectedCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const courseData = {
      title,
      description,
      price,
      playlist_id: playlistId,
      intro_video_id: introVideoId,
    };

    try {
      if (editMode && selectedCourse) {
        // Update existing course
        const response = await axiosInstance.put(`/courses/${selectedCourse.id}/`, courseData);
        setCourses(courses.map(c => c.id === selectedCourse.id ? response.data : c));
        setSuccess("Course updated successfully!");
      } else {
        // Create new course
        const response = await axiosInstance.post("/courses/", courseData);
        setCourses((prev) => [...prev, response.data]);
        setSuccess("Course created successfully!");
      }
      resetForm();
      setDialogOpen(false);
    } catch (err) {
      console.error(`Failed to ${editMode ? "update" : "create"} course:`, err);
      setError(`Failed to ${editMode ? "update" : "create"} course`);
    }
  };

  const handleEditCourse = (course) => {
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setPlaylistId(course.playlist_id || "");
    setIntroVideoId(course.intro_video_id || "");
    setSelectedCourse(course);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    try {
      await axiosInstance.delete(`/courses/${courseId}/`);
      setCourses(courses.filter(c => c.id !== courseId));
      setSuccess("Course deleted successfully!");
    } catch (err) {
      console.error("Failed to delete course:", err);
      setError("Failed to delete course");
    }
  };

  const openCourseDetails = (course) => {
    setSelectedCourse(course);
    setDetailsOpen(true);
  };

  const CourseForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          placeholder="Enter course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-32"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="playlistId">YouTube Playlist ID (Optional)</Label>
        <Input
          id="playlistId"
          placeholder="Enter YouTube playlist ID"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="introVideoId">Intro Video ID (Optional)</Label>
        <Input
          id="introVideoId"
          placeholder="Enter YouTube video ID"
          value={introVideoId}
          onChange={(e) => setIntroVideoId(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm();
            setDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editMode ? "Update Course" : "Create Course"}
        </Button>
      </DialogFooter>
    </form>
  );

  const CourseCard = ({ course }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openCourseDetails(course)} 
              title="Course Details"
            >
              <BookOpen size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleEditCourse(course)} 
              title="Edit Course"
            >
              <Pencil size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDeleteCourse(course.id)} 
              className="text-red-500 hover:text-red-600 hover:bg-red-50" 
              title="Delete Course"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-2 flex justify-between">
        <Badge variant="outline">${course.price}</Badge>
        <span className="text-xs text-muted-foreground">
          {course.lessons ? `${course.lessons.length} lessons` : "No lessons"}
        </span>
      </CardFooter>
    </Card>
  );

  const CourseDetails = () => {
    if (!selectedCourse) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            <p className="text-muted-foreground">{selectedCourse.id ? `Course ID: ${selectedCourse.id}` : ""}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => handleEditCourse(selectedCourse)}
            className="gap-1"
          >
            <Pencil size={16} /> Edit Course
          </Button>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Description</h3>
          <p className="text-muted-foreground mt-1">{selectedCourse.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${selectedCourse.price}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={selectedCourse.is_published ? "success" : "secondary"}>
                {selectedCourse.is_published ? "Published" : "Draft"}
              </Badge>
            </CardContent>
          </Card>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lessons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Lessons</h3>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus size={16} /> Add Lesson
              </Button>
            </div>
            
            {selectedCourse.lessons && selectedCourse.lessons.length > 0 ? (
              <div className="space-y-2">
                {selectedCourse.lessons.map((lesson, index) => (
                  <Accordion key={lesson.id || index} type="single" collapsible>
                    <AccordionItem value={`lesson-${index}`}>
                      <AccordionTrigger className="hover:bg-accent hover:no-underline px-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="rounded-full w-6 h-6 flex items-center justify-center p-0">
                            {index + 1}
                          </Badge>
                          <span>{lesson.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {lesson.description || "No description available"}
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Pencil size={14} className="mr-1" /> Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 size={14} className="mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">No lessons added yet</p>
                  <Button>
                    <Plus size={16} className="mr-1" /> Create First Lesson
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="assignments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Assignments</h3>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus size={16} /> Add Assignment
              </Button>
            </div>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">No assignments added yet</p>
                <Button>
                  <Plus size={16} className="mr-1" /> Create First Assignment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quizzes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Quizzes</h3>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus size={16} /> Add Quiz
              </Button>
            </div>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">No quizzes added yet</p>
                <Button>
                  <Plus size={16} className="mr-1" /> Create First Quiz
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Instructor Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : courses.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CardTitle className="text-xl mb-4">Welcome to your Instructor Dashboard</CardTitle>
            <CardDescription className="mb-6 text-center max-w-md">
              You haven't created any courses yet. Get started by creating your first course!
            </CardDescription>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">Create Your First Course</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Course</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create your first course.
                  </DialogDescription>
                </DialogHeader>
                <CourseForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Courses</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()} className="gap-1">
                  <Plus size={16} /> New Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editMode ? "Edit Course" : "Create Course"}</DialogTitle>
                  <DialogDescription>
                    {editMode 
                      ? "Update your course information" 
                      : "Fill in the details to create a new course"}
                  </DialogDescription>
                </DialogHeader>
                <CourseForm />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                  {selectedCourse ? selectedCourse.title : "Course Details"}
                </DialogTitle>
              </DialogHeader>
              <CourseDetails />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}