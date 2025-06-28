"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Eye, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import QuizForm from "./QuizForm";
import QuestionForm from "./QuestionForm";
import QuizPreview from "./QuizPreview";
import QuestionList from "./QuestionList";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "@/app/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/app/components/ui/alert-dialog";

export default function QuizSection({ lessonId, courseId, onQuizUpdate }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isQuestionListOpen, setIsQuestionListOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [deleteQuizId, setDeleteQuizId] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, [lessonId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/quizzes/?lesson_id=${lessonId}`);
      setQuizzes(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load quizzes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = async (quizData) => {
    try {
      let response;
      if (selectedQuiz) {
        response = await axiosInstance.put(`/quizzes/${selectedQuiz.id}/`, {
          ...quizData,
          lesson: lessonId,
          created_by: quizData.created_by,
        });
        setQuizzes(quizzes.map((q) => (q.id === selectedQuiz.id ? response.data : q)));
        setSuccess("Quiz updated successfully!");
      } else {
        response = await axiosInstance.post(`/quizzes/`, {
          ...quizData,
          lesson: lessonId,
        });
        setQuizzes([...quizzes, response.data]);
        setSuccess("Quiz created successfully!");
      }
      setIsQuizFormOpen(false);
      setSelectedQuiz(null);
      onQuizUpdate();
    } catch (err) {
      setError(`Failed to ${selectedQuiz ? "update" : "create"} quiz`);
      console.error(err);
    }
  };

  const handleDeleteQuiz = async () => {
    try {
      await axiosInstance.delete(`/quizzes/${deleteQuizId}/`);
      setQuizzes(quizzes.filter((q) => q.id !== deleteQuizId));
      setSuccess("Quiz deleted successfully!");
      setDeleteQuizId(null);
      onQuizUpdate();
    } catch (err) {
      setError("Failed to delete quiz");
      console.error(err);
    }
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizFormOpen(true);
  };

  const handlePreviewQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setIsPreviewOpen(true);
  };

  const handleShowQuestions = (quiz) => {
    setSelectedQuiz(quiz);
    setIsQuestionListOpen(true);
  };

  const handleAddQuestion = (quiz) => {
    setSelectedQuiz(quiz);
    setSelectedQuestion(null);
    setIsQuestionFormOpen(true);
  };

  const handleEditQuestion = (quiz, question) => {
    setSelectedQuiz(quiz);
    setSelectedQuestion(question);
    setIsQuestionFormOpen(true);
  };

  const handleQuestionSubmit = async (questionData) => {
    try {
      let response;
      if (selectedQuestion) {
        response = await axiosInstance.put(`/questions/${selectedQuestion.id}/`, {
          ...questionData,
          quiz: selectedQuiz.id,
        });
        setQuizzes(
          quizzes.map((q) =>
            q.id === selectedQuiz.id
              ? {
                  ...q,
                  questions: q.questions.map((ques) =>
                    ques.id === selectedQuestion.id ? response.data : ques
                  ),
                }
              : q
          )
        );
        setSuccess("Question updated successfully!");
      } else {
        response = await axiosInstance.post(`/questions/`, {
          ...questionData,
          quiz: selectedQuiz.id,
          position: selectedQuiz.questions.length + 1,
        });
        setQuizzes(
          quizzes.map((q) =>
            q.id === selectedQuiz.id
              ? { ...q, questions: [...q.questions, response.data] }
              : q
          )
        );
        setSuccess("Question added successfully!");
      }
      setIsQuestionFormOpen(false);
      setSelectedQuestion(null);
      onQuizUpdate();
    } catch (err) {
      setError(`Failed to ${selectedQuestion ? "update" : "add"} question: ${err.response?.data?.non_field_errors?.[0] || err.message}`);
      console.error("Question Error:", {
        status: err.response?.status,
        data: err.response?.data,
        payload: questionData,
        message: err.message,
      });
    }
  };

  const handleDeleteQuestion = async (quizId, questionId) => {
    if (!confirm("Delete this question?")) return;
    try {
      await axiosInstance.delete(`/questions/${questionId}/`);
      setQuizzes(
        quizzes.map((q) =>
          q.id === quizId
            ? { ...q, questions: q.questions.filter((ques) => ques.id !== questionId) }
            : q
        )
      );
      setSuccess("Question deleted successfully!");
      onQuizUpdate();
    } catch (err) {
      setError("Failed to delete question");
      console.error(err);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const quiz = quizzes.find((q) => q.id === selectedQuiz.id);
    const reorderedQuestions = Array.from(quiz.questions);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);

    setQuizzes(
      quizzes.map((q) =>
        q.id === selectedQuiz.id ? { ...q, questions: reorderedQuestions } : q
      )
    );

    try {
      await Promise.all(
        reorderedQuestions.map((q, index) =>
          axiosInstance.patch(`/questions/${q.id}/`, { position: index + 1 })
        )
      );
      setSuccess("Questions reordered successfully!");
    } catch (err) {
      setError("Failed to reorder questions");
      fetchQuizzes();
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading quizzes...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quizzes</h3>
        <Dialog open={isQuizFormOpen} onOpenChange={setIsQuizFormOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus size={16} /> Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedQuiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
            </DialogHeader>
            <QuizForm
              courseId={courseId}
              quiz={selectedQuiz}
              onSubmit={handleQuizSubmit}
              onCancel={() => {
                setIsQuizFormOpen(false);
                setSelectedQuiz(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No quizzes added yet</p>
            <Dialog open={isQuizFormOpen} onOpenChange={setIsQuizFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-1" /> Create First Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Quiz</DialogTitle>
                </DialogHeader>
                <QuizForm
                  courseId={courseId}
                  onSubmit={handleQuizSubmit}
                  onCancel={() => setIsQuizFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <Dialog open={isPreviewOpen && selectedQuiz?.id === quiz.id} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <CardTitle
                      className="text-lg cursor-pointer hover:underline"
                      onClick={() => handlePreviewQuiz(quiz)}
                    >
                      {quiz.title}
                    </CardTitle>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Preview Quiz: {quiz.title}</DialogTitle>
                    </DialogHeader>
                    <QuizPreview quiz={quiz} />
                  </DialogContent>
                </Dialog>
                <p className="text-sm text-muted-foreground">
                  {quiz.total_questions} questions • {quiz.time_limit || "No"} time limit • Passing Score: {quiz.passing_score}%
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditQuiz(quiz)}
                  title="Edit Quiz"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreviewQuiz(quiz)}
                  title="Preview Quiz"
                >
                  <Eye size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteQuizId(quiz.id)}
                  title="Delete Quiz"
                >
                  <Trash2 size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowQuestions(quiz)}
                >
                  Questions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Questions</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddQuestion(quiz)}
                  >
                    Add Question
                  </Button>
                </div>
                {quiz.questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No questions added yet</p>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={`quiz-${quiz.id}`}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {quiz.questions.map((question, index) => (
                            <Draggable
                              key={question.id}
                              draggableId={String(question.id)}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical size={16} className="text-gray-400" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm">{question.text}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {question.question_type.replace(/_/g, " ")} • {question.points} points
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditQuestion(quiz, question)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteQuestion(quiz.id, question.id)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={isQuestionFormOpen} onOpenChange={setIsQuestionFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedQuestion ? "Edit Question" : "Add Question"}</DialogTitle>
          </DialogHeader>
          <QuestionForm
            initialData={selectedQuestion}
            onSubmit={handleQuestionSubmit}
            onCancel={() => {
              setIsQuestionFormOpen(false);
              setSelectedQuestion(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isQuestionListOpen} onOpenChange={setIsQuestionListOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Questions for {selectedQuiz?.title}</DialogTitle>
          </DialogHeader>
          <QuestionList
            quizId={selectedQuiz?.id}
            openQuestionModal={(question) => {
              setSelectedQuestion(question);
              setIsQuestionFormOpen(true);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview Quiz: {selectedQuiz?.title}</DialogTitle>
          </DialogHeader>
          <QuizPreview quiz={selectedQuiz} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteQuizId} onOpenChange={() => setDeleteQuizId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quiz? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuiz}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}