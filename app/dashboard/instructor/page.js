"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axios";
import { Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

// Custom components
import CourseCard from "@/app/components/dashboard/course/CourseCard";
import CourseForm from "@/app/components/dashboard/course/CourseForm";
import CourseDetails from "@/app/components/dashboard/course/CourseDetails";
import LessonForm from "@/app/components/dashboard/lesson/LessonForm";
import ModuleRenameDialog from "@/app/components/dashboard/module/ModuleRenameDialog";
import ModuleForm from "@/app/components/dashboard/module/ModuleForm";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  // Dialog & Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Feedback
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  // Module State
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [moduleToRename, setModuleToRename] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [addModuleOpen, setAddModuleOpen] = useState(false);

  const router = useRouter();

  // Fetch courses
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (!token) {
      // Redirect to login with error message
      router.push(
        `/login?error=${encodeURIComponent(
          "You must be logged in to access the dashboard."
        )}`
      );
      return;
    }

    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/courses/");
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setSelectedCourse(null);
    setError(null);
    setSuccess(null);
  };

  // Course Handlers
  const handleCourseFormSubmit = async (courseData) => {
    try {
      if (editMode && selectedCourse) {
        const res = await axiosInstance.put(
          `/courses/${selectedCourse.id}/`,
          courseData
        );
        setCourses(
          courses.map((c) => (c.id === selectedCourse.id ? res.data : c))
        );
        setSuccess("Course updated successfully!");
      } else {
        const res = await axiosInstance.post("/courses/", courseData);
        setCourses((prev) => [...prev, res.data]);
        setSuccess("Course created successfully!");
      }
      resetForm();
      setDialogOpen(false);
    } catch (err) {
      setError(`Failed to ${editMode ? "update" : "create"} course`);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Delete this course?")) return;
    try {
      await axiosInstance.delete(`/courses/${courseId}/`);
      setCourses(courses.filter((c) => c.id !== courseId));
      setSuccess("Course deleted successfully!");
    } catch (err) {
      setError("Failed to delete course");
    }
  };

  const openCourseDetails = (course) => {
    setSelectedCourse(course);
    setDetailsOpen(true);
  };

  // Lesson Handlers
  const handleEditLesson = (lesson) => {
    setCurrentLesson(lesson);
    setIsEditOpen(true);
  };

  const handleUpdateLesson = async (formData) => {
    try {
      const updatedLesson = {
        ...formData,
        course: selectedCourse.id,
      };
      const res = await axiosInstance.put(
        `/lessons/${currentLesson.id}/`,
        updatedLesson
      );

      if (res.status === 200) {
        const updated = res.data;
        const updatedModules = selectedCourse.modules.map((mod) => ({
          ...mod,
          lessons: mod.lessons.map((l) => (l.id === updated.id ? updated : l)),
        }));

        setSelectedCourse((prev) => ({ ...prev, modules: updatedModules }));
        setIsEditOpen(false);
        setSuccess("Lesson updated successfully!");
      }
    } catch (err) {
      setError("Failed to update lesson");
    }
  };

  const handleAddLesson = async (formData) => {
    try {
      const newLesson = {
        ...formData,
        course: selectedCourse.id,
      };
      const res = await axiosInstance.post("/lessons/", newLesson);

      if (res.status === 201) {
        const added = res.data;
        const updatedModules = selectedCourse.modules.map((mod) =>
          mod.id === parseInt(formData.module)
            ? { ...mod, lessons: [...mod.lessons, added] }
            : mod
        );

        setSelectedCourse((prev) => ({ ...prev, modules: updatedModules }));
        setIsAddLessonOpen(false);
        setSuccess("Lesson added successfully!");
      }
    } catch (err) {
      setError("Failed to add lesson");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await axiosInstance.delete(`/lessons/${lessonId}/`);
      const updatedModules = selectedCourse.modules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.filter((l) => l.id !== lessonId),
      }));
      setSelectedCourse((prev) => ({ ...prev, modules: updatedModules }));
      setSuccess("Lesson deleted successfully!");
    } catch (err) {
      setError("Failed to delete lesson");
    }
  };

  // Module Handlers

  // Open rename module modal
  const handleOpenRenameModule = (module) => {
    setModuleToRename(module);
    setRenameModalOpen(true);
  };

  // Submit new module title
  const handleRenameModule = async (newTitle) => {
    try {
      // optimistic UI update
      setSelectedCourse((prev) => ({
        ...prev,
        modules: prev.modules.map((m) =>
          m.id === moduleToRename.id ? { ...m, title: newTitle } : m
        ),
      }));

      await axiosInstance.patch(`/modules/${moduleToRename.id}/`, {
        title: newTitle,
      });

      setSuccess("Module renamed");
    } catch (err) {
      setError("Failed to rename module");
      // rollback UI if needed
      fetchCourses();
    }
  };

  // Re-order handler (up / down)
  const handleReorderModule = async (moduleId, direction) => {
    const delta = direction === "up" ? -1 : 1;

    const courseCopy = { ...selectedCourse };
    const idx = courseCopy.modules.findIndex((m) => m.id === moduleId);
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= courseCopy.modules.length) return;

    // swap locally
    [courseCopy.modules[idx], courseCopy.modules[newIdx]] = [
      courseCopy.modules[newIdx],
      courseCopy.modules[idx],
    ];
    // optimistic UI
    setSelectedCourse(courseCopy);

    try {
      // send new positions to backend (simple approach)
      await Promise.all(
        courseCopy.modules.map((m, i) =>
          axiosInstance.patch(`/modules/${m.id}/`, { position: i + 1 })
        )
      );
      setSuccess("Module order updated");
    } catch (err) {
      setError("Failed to reorder modules");
      fetchCourses(); // rollback
    }
  };

  // Add module
  const handleCreateModule = async (title) => {
    try {
      const res = await axiosInstance.post("/modules/", {
        title,
        course: selectedCourse.id,
      });

      setSelectedCourse((prev) => ({
        ...prev,
        modules: [...prev.modules, res.data],
      }));

      setSuccess("Module created");
    } catch (err) {
      setError("Failed to create module");
    }
  };

  // Delete module
  const handleDeleteModule = async (moduleId) => {
    if (!confirm("Delete this module and its lessons?")) return;

    try {
      await axiosInstance.delete(`/modules/${moduleId}/`);

      setSelectedCourse((prev) => ({
        ...prev,
        modules: prev.modules.filter((m) => m.id !== moduleId),
      }));

      setSuccess("Module deleted");
    } catch (err) {
      setError("Failed to delete module");
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Instructor Dashboard</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : courses.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CardTitle className="text-xl mb-4">
              Welcome to your Instructor Dashboard
            </CardTitle>
            <CardDescription className="mb-6 text-center max-w-md">
              You haven't created any courses yet. Get started by creating your
              first course!
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
                <CourseForm
                  editMode={false}
                  onSubmit={handleCourseFormSubmit}
                  onCancel={() => setDialogOpen(false)}
                  error={error}
                  success={success}
                />
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
                  <DialogTitle>
                    {editMode ? "Edit Course" : "Create Course"}
                  </DialogTitle>
                  <DialogDescription>
                    {editMode
                      ? "Update your course information"
                      : "Fill in the details to create a new course"}
                  </DialogDescription>
                </DialogHeader>
                <CourseForm
                  editMode={editMode}
                  initialData={selectedCourse}
                  onSubmit={handleCourseFormSubmit}
                  onCancel={() => setDialogOpen(false)}
                  error={error}
                  success={success}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onViewDetails={openCourseDetails}
              />
            ))}
          </div>

          {/* Course Details View */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedCourse?.title || "Course Details"}
                </DialogTitle>
              </DialogHeader>
              <CourseDetails
                course={selectedCourse}
                onEditCourse={handleEditCourse}
                onAddLesson={() => setIsAddLessonOpen(true)}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
                onRenameModule={handleOpenRenameModule}
                onReorderModule={handleReorderModule}
                setSelectedModule={setSelectedModule}
                // selectedModule={selectedModule}
                setAddModuleOpen={setAddModuleOpen}
                onDeleteModule={handleDeleteModule}
                onClose={() => setDetailsOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Add Lesson Modal */}
          <LessonForm
            open={isAddLessonOpen}
            onOpenChange={setIsAddLessonOpen}
            mode="add"
            modules={selectedCourse?.modules || []}
            onSubmit={handleAddLesson}
          />

          {/* Edit Lesson Modal */}
          <LessonForm
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            mode="edit"
            modules={selectedCourse?.modules || []}
            initialData={currentLesson}
            onSubmit={handleUpdateLesson}
          />

          <ModuleRenameDialog
            open={renameModalOpen}
            onOpenChange={setRenameModalOpen}
            moduleData={moduleToRename}
            onSubmit={handleRenameModule}
          />

          <ModuleForm
            open={addModuleOpen}
            onOpenChange={setAddModuleOpen}
            course={selectedCourse?.id}
            onSubmit={handleCreateModule}
            moduleCount={selectedCourse?.modules?.length || 0}
          />
        </>
      )}
    </div>
  );
}
