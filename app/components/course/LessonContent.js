// app/components/course/LessonContent.js
import { useState, useEffect, useMemo } from "react";
import { PlayCircle, FileQuestion, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import DOMPurify from "dompurify";

// Video lesson component
const VideoLesson = ({ lesson }) => {
  const youtubeId = useMemo(() => {
    if (!lesson.video_id) return "";
    if (/^[a-zA-Z0-9_-]{11}$/.test(lesson.video_id)) return lesson.video_id;
    
    const regex = /(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|youtu\.be\/|youtube\.com\/shorts\/|m\.youtube\.com\/)([a-zA-Z0-9_-]{11})(?:&|$|\?|\/)/;
    const match = lesson.video_id.match(regex);
    return match ? match[1] : "";
  }, [lesson.video_id]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{lesson.title}</CardTitle>
          {lesson.duration && (
            <CardDescription>Duration: {lesson.duration} min</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              aria-label={`Video: ${lesson.title}`}
            ></iframe>
          </div>
          
          {lesson.description && (
            <div className="mt-4 prose prose-sm max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(lesson.description),
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Quiz question component - specifically for multiple choice
const QuizQuestion = ({ question, answer, onChange, disabled }) => {
  return (
    <div className="border p-4 rounded-md mb-4">
      <p className="font-medium mb-3">{question.question_text}</p>
      <div className="space-y-2">
        {['A', 'B', 'C', 'D'].map((option) => {
          const optionText = question[`option_${option.toLowerCase()}`];
          if (!optionText) return null;
          
          return (
            <label key={option} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={answer === option}
                onChange={() => onChange(question.id, option)}
                disabled={disabled}
                aria-label={`Option ${option}: ${optionText}`}
                className="mr-2"
              />
              <span>{optionText}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// Quiz results component
const QuizResults = ({ results, onRetake }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Quiz Results: {results.score}/{results.total}</h3>
        <Button variant="outline" onClick={onRetake} size="sm">
          Retake Quiz
        </Button>
      </div>
      
      {results.results.map((result) => (
        <div 
          key={result.question_id} 
          className={`border p-4 rounded-md ${result.is_correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
        >
          <p className="font-medium mb-2">{result.question_text}</p>
          <p className={`${result.is_correct ? "text-green-600" : "text-red-600"} mb-1`}>
            Your answer: {result.user_answer}
          </p>
          {!result.is_correct && (
            <p className="text-gray-700">Correct answer: {result.correct_answer}</p>
          )}
          {result.explanation && (
            <p className="text-sm mt-2 text-gray-600">{result.explanation}</p>
          )}
        </div>
      ))}
    </div>
  );
};

// Main LessonContent component
export function LessonContent({ currentLesson, currentQuiz, onCompleteLesson, onCompleteQuiz }) {
  const [loading, setLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  // Reset state when lesson or quiz changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  }, [currentLesson, currentQuiz]);

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitQuiz = async () => {
    // Validate that all questions are answered
    if (currentQuiz?.questions) {
      const unansweredQuestions = currentQuiz.questions.filter(q => !quizAnswers[q.id]);
      
      if (unansweredQuestions.length > 0) {
        toast({
          title: "Incomplete Quiz",
          description: `Please answer all ${unansweredQuestions.length} remaining questions before submitting.`,
          duration: 3000,
        });
        return;
      }
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/quizzes/${currentQuiz.id}/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: quizAnswers }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      setQuizResults(result);
      setQuizSubmitted(true);
      
      // Show appropriate message based on score
      const scorePercentage = (result.score / result.total) * 100;
      if (scorePercentage >= 70) {
        // Mark quiz as completed if passed
        onCompleteQuiz && onCompleteQuiz(currentQuiz.id);
      }
      
      toast({
        title: "Quiz Submitted",
        description: `Your score: ${result.score}/${result.total} (${scorePercentage.toFixed(0)}%)`,
        variant: scorePercentage >= 70 ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: `Could not submit quiz: ${error.message}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  };

  const handleMarkLessonComplete = () => {
    onCompleteLesson && onCompleteLesson(currentLesson.id);
    toast({
      title: "Lesson Completed",
      description: "Your progress has been updated.",
      duration: 3000,
    });
  };

  // Loading state
  if (!currentLesson && !currentQuiz) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 flex justify-center items-center h-64">
          <div className="text-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading content...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render Quiz if selected
  if (currentQuiz) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center mb-2">
            <FileQuestion className="h-5 w-5 mr-2 text-amber-500" />
            <CardTitle>{currentQuiz.title}</CardTitle>
          </div>
          <CardDescription>{currentQuiz.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {quizSubmitted && quizResults ? (
            <QuizResults 
              results={quizResults} 
              onRetake={handleRetakeQuiz}
            />
          ) : (
            <div className="space-y-4">
              {currentQuiz.questions?.map((question) => (
                <QuizQuestion
                  key={question.id}
                  question={question}
                  answer={quizAnswers[question.id]}
                  onChange={handleQuizAnswer}
                  disabled={quizSubmitted}
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!quizSubmitted ? (
            <Button 
              onClick={submitQuiz} 
              disabled={loading || quizSubmitted}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Answers"
              )}
            </Button>
          ) : (
            <div></div> // Empty div for spacing with flex-between
          )}
        </CardFooter>
      </Card>
    );
  }

  // Render Video Lesson Content
  return (
    <div className="space-y-4">
      <VideoLesson lesson={currentLesson} />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleMarkLessonComplete}
          className="w-full sm:w-auto"
        >
          Mark as Completed
        </Button>
      </div>
    </div>
  );
}