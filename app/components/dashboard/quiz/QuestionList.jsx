"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import axiosInstance from "@/app/lib/axios";

export default function QuestionList({ quizId, openQuestionModal }) {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/questions/?quiz_id=${quizId}`);
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm("Delete this question?")) return;
    try {
      await axiosInstance.delete(`/questions/${questionId}/`);
      setQuestions(questions.filter((q) => q.id !== questionId));
      setSuccess("Question deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete question");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <Card className="max-h-96 overflow-y-auto space-y-2 p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-md font-medium">Questions</h4>
        <Button onClick={() => openQuestionModal(null)} className="gap-1">
          <Plus size={16} /> Add Question
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-2 bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      ) : questions.length === 0 ? (
        <p className="text-muted-foreground">No questions added yet</p>
      ) : (
        questions.map((question) => (
          <Card key={question.id} className="bg-muted">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-sm">
                {question.text}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openQuestionModal(question)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Type: {question.question_type}</p>
              <p className="text-sm">Points: {question.points}</p>
              {question.choices?.length > 0 && (
                <p className="text-sm">Choices: {question.choices.join(", ")}</p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Card>
  );
}
