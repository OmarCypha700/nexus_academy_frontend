// // app/components/dashboard/quiz/QuizList.js

"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/axios";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { FileQuestion, Plus } from "lucide-react";
import QuizPreview from "./QuizPreview";
import QuestionList from "@/app/components/dashboard/quiz/QuestionList";

export default function QuizList({
  courseId,
  openQuizModal,
  openQuestionModal,
}) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isQuestionListOpen, setIsQuestionListOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/quizzes/?course_id=${courseId}`);
      setQuizzes(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load quizzes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await axiosInstance.delete(`/quizzes/${queryId}/`);
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete quiz");
    }
  };

  const handlePreviewQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setIsPreviewOpen(true);
  };

  const handleShowQuestions = (quiz) => {
    setSelectedQuiz(quiz);
    setIsQuestionListOpen(true);
  };

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Quizzes</h3>
        <Button onClick={() => openQuizModal(null)} className="gap-1">
          <Plus size={16} /> New Quiz
        </Button>
      </div>
      {quizzes.length === 0 ? (
        <p className="text-muted-foreground">No quizzes available.</p>
      ) : (
        <ul className="space-y-2">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Dialog open={isPreviewOpen && selectedQuiz?.id === quiz.id} onOpenChange={setIsPreviewOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          onClick={() => handlePreviewQuiz(quiz)}
                        >
                          {quiz.title}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Preview Quiz: {quiz.title}</DialogTitle>
                        </DialogHeader>
                        <QuizPreview quiz={quiz} />
                      </DialogContent>
                    </Dialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to preview quiz</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openQuizModal(quiz)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                >
                  Delete
                </Button>
                <Dialog open={isQuestionListOpen && selectedQuiz?.id === quiz.id} onOpenChange={setIsQuestionListOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowQuestions(quiz)}
                    >
                      <FileQuestion size={16} /> Questions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Questions for {quiz.title}</DialogTitle>
                    </DialogHeader>
                    <QuestionList
                      quizId={quiz.id}
                      openQuestionModal={(question) => openQuestionModal(quiz.id, question)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}