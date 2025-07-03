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
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

// Custom components
import CourseCard from "@/app/components/dashboard/course/CourseCard";
import CourseForm from "@/app/components/dashboard/course/CourseForm";
import CourseDetails from "@/app/components/dashboard/course/CourseDetails";
import LessonForm from "@/app/components/dashboard/lesson/LessonForm";
import ModuleRenameDialog from "@/app/components/dashboard/module/ModuleRenameDialog";
import ModuleForm from "@/app/components/dashboard/module/ModuleForm";
import QuizForm from "@/app/components/dashboard/quiz/QuizForm";
import QuestionForm from "@/app/components/dashboard/quiz/QuestionForm";
import CourseOutcomeForm from "@/app/components/dashboard/course/CourseOutcomeForm";

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
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [quizFormData, setQuizFormData] = useState(null); // null or quiz object
  const [questionFormData, setQuestionFormData] = useState(null); // null or question object
  const [selectedQuizId, setSelectedQuizId] = useState(null); // For question management
  const [outcomeModalOpen, setOutcomeModalOpen] = useState(false); // New state for outcome dialog
  const [outcomes, setOutcomes] = useState([]);

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

  // Fetch courses and handle auth
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push(
        `/login?error=${encodeURIComponent(
          "You must be logged in to access the dashboard."
        )}`
      );
      return;
    }

    fetchCourses();
  }, []);

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/instructor/courses/");
      setCourses(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load courses");
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
          `/instructor/courses/${selectedCourse.id}/`,
          courseData
        );
        setCourses(
          courses.map((c) => (c.id === selectedCourse.id ? res.data : c))
        );
        setSuccess("Course updated successfully!");
      } else {
        const res = await axiosInstance.post("/instructor/courses/", courseData);
        setCourses((prev) => [...prev, res.data]);
        setSuccess("Course created successfully!");
      }
      resetForm();
      setDialogOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          `Failed to ${editMode ? "update" : "create"} course`
      );
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
      await axiosInstance.delete(`/instructor/courses/${courseId}/`);
      setCourses(courses.filter((c) => c.id !== courseId));
      setSuccess("Course deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete course");
    }
  };

  const openCourseDetails = async (course) => {
    try {
      const response = await axiosInstance.get(`/courses/${course.id}/`);
      setSelectedCourse(response.data);
      setDetailsOpen(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load course details");
      console.error(err);
    }
  };

  // Outcome Handlers

  // const handleOutcome = () => {
  //   setOutcomeModalOpen(true);
  // };

  // const handleOutcomeSubmit = async (payload) => {
  //   try {
  //     console.log(payload);
  //     const response = await axiosInstance.post(
  //       "/courses/outcomes/bulk-create/",
  //       payload
  //     );
  //     setOutcomes(response.data.outcomes); // Update outcomes state
  //     setSelectedCourse((prev) => ({
  //       ...prev,
  //       outcomes: response.data.outcomes,
  //     })); // Update course with new outcomes
  //     setSuccess("Course outcomes saved successfully!");
  //     setOutcomeModalOpen(false);
  //   } catch (err) {
  //     setError(err.response?.data?.detail || "Failed to save course outcomes");
  //     console.error(err);
  //   }
  // };

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
      setError(err.response?.data?.detail || "Failed to update lesson");
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
      setError(err.response?.data?.detail || "Failed to add lesson");
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
      setError(err.response?.data?.detail || "Failed to delete lesson");
    }
  };

  // Module Handlers
  const handleOpenRenameModule = (module) => {
    setModuleToRename(module);
    setRenameModalOpen(true);
  };

  const handleRenameModule = async (newTitle) => {
    try {
      setSelectedCourse((prev) => ({
        ...prev,
        modules: prev.modules.map((m) =>
          m.id === moduleToRename.id ? { ...m, title: newTitle } : m
        ),
      }));

      await axiosInstance.patch(`/modules/${moduleToRename.id}/`, {
        title: newTitle,
      });

      setSuccess("Module renamed successfully!");
      setRenameModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to rename module");
      fetchCourses();
    }
  };

  const handleReorderModule = async (moduleId, direction) => {
    try {
      const courseCopy = { ...selectedCourse };
      const idx = courseCopy.modules.findIndex((m) => m.id === moduleId);
      const newIdx = idx + (direction === "up" ? -1 : 1);
      if (newIdx < 0 || newIdx >= courseCopy.modules.length) return;

      const updatedModules = [...courseCopy.modules];
      [updatedModules[idx], updatedModules[newIdx]] = [
        updatedModules[newIdx],
        updatedModules[idx],
      ];
      updatedModules.forEach((m, i) => (m.position = i + 1));

      setSelectedCourse({ ...courseCopy, modules: updatedModules });

      await axiosInstance.post("/modules/reorder/", {
        modules: updatedModules.map((m) => ({
          id: m.id,
          position: m.position,
        })),
      });

      setSuccess("Module order updated successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reorder modules");
      fetchCourses();
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm("Delete this module and its lessons?")) return;
    try {
      await axiosInstance.delete(`/modules/${moduleId}/`);

      setSelectedCourse((prev) => ({
        ...prev,
        modules: prev.modules.filter((m) => m.id !== moduleId),
      }));

      setSuccess("Module deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete module");
    }
  };

  return (
    <div className="container py-8">
      {/* <h1 className="text-3xl font-bold mb-8">Instructor Dashboard</h1> */}

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
              You haven&apos;t created any courses yet. Get started by creating
              your first course!
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

          {/* Course Details Modal */}
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
                setAddModuleOpen={setAddModuleOpen}
                onDeleteModule={handleDeleteModule}
                openQuizModal={(quiz) => {
                  setQuizFormData(quiz);
                  setQuizModalOpen(true);
                }}
                openQuestionModal={(quizId, question) => {
                  if (!quizId) console.error("Quiz ID is undefined");
                  setSelectedQuizId(quizId);
                  setQuestionFormData(question);
                  setQuestionModalOpen(true);
                }}
                // openOutcomeModal={handleOutcome}
                // outcomes={outcomes}
                onClose={() => setDetailsOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Course Outcome Modal */}
          {/* <Dialog open={outcomeModalOpen} onOpenChange={setOutcomeModalOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogTitle>Course Outcomes</DialogTitle> */}
              {/* <CourseOutcomeForm
                open={outcomeModalOpen}
                onOpenChange={setOutcomeModalOpen}
                courseId={selectedCourse?.id}
                onSubmit={handleOutcomeSubmit}
                error={error}
                success={success}
                initialData={outcomes}
              /> */}
            {/* </DialogContent>
          </Dialog> */}

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

          {/* Rename Module Modal */}
          <ModuleRenameDialog
            courseId={selectedCourse?.id}
            open={renameModalOpen}
            onOpenChange={setRenameModalOpen}
            moduleData={moduleToRename}
            onConfirm={handleRenameModule}
          />

          {/* Add Module Modal */}
          <ModuleForm
            open={addModuleOpen}
            onOpenChange={setAddModuleOpen}
            courseId={selectedCourse?.id}
            moduleCount={selectedCourse?.modules?.length || 0}
          />

          {/* Quiz Modal */}
          <Dialog open={quizModalOpen} onOpenChange={setQuizModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {quizFormData?.id ? "Edit Quiz" : "Create Quiz"}
                </DialogTitle>
              </DialogHeader>
              <QuizForm
                courseId={selectedCourse?.id}
                quiz={quizFormData}
                onSubmit={async (data) => {
                  try {
                    if (quizFormData?.id) {
                      await axiosInstance.put(`/quizzes/${quizFormData.id}/`, {
                        ...data,
                        course: selectedCourse?.id,
                      });
                      setSuccess("Quiz updated successfully!");
                    } else {
                      await axiosInstance.post("/quizzes/", {
                        ...data,
                        course: selectedCourse?.id,
                      });
                      setSuccess("Quiz created successfully!");
                    }
                    setQuizModalOpen(false);
                    setQuizFormData(null);
                    await openCourseDetails(selectedCourse); // Refresh course data
                  } catch (err) {
                    setError(
                      err.response?.data?.detail || "Failed to save quiz"
                    );
                  }
                }}
                onCancel={() => {
                  setQuizModalOpen(false);
                  setQuizFormData(null);
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Question Modal */}
          <Dialog open={questionModalOpen} onOpenChange={setQuestionModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {questionFormData?.id ? "Edit Question" : "Create Question"}
                </DialogTitle>
              </DialogHeader>
              <QuestionForm
                quizId={selectedQuizId}
                question={questionFormData}
                onSubmit={async (data) => {
                  try {
                    const payload = {
                      ...data,
                      quiz: selectedQuizId,
                    };
                    console.log(
                      "Submitting question payload:",
                      JSON.stringify(payload, null, 2)
                    );
                    if (questionFormData?.id) {
                      await axiosInstance.put(
                        `/questions/${questionFormData.id}/`,
                        payload
                      );
                      setSuccess("Question updated successfully!");
                    } else {
                      await axiosInstance.post("/questions/", payload);
                      setSuccess("Question created successfully!");
                    }
                    setQuestionModalOpen(false);
                    setQuestionFormData(null);
                    await openCourseDetails(selectedCourse); // Refresh course data
                  } catch (err) {
                    console.error("Question Error:", {
                      status: err.response?.status,
                      data: err.response?.data,
                      payload: data,
                      message: err.message,
                    });
                    setError(
                      err.response?.data?.non_field_errors?.[0] ||
                        err.response?.data?.detail ||
                        JSON.stringify(err.response?.data) ||
                        "Failed to save question"
                    );
                  }
                }}
                onCancel={() => {
                  setQuestionModalOpen(false);
                  setQuestionFormData(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
