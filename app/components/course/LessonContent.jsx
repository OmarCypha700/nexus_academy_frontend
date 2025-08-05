import { useState, useEffect, useMemo } from "react";
import { PlayCircle, FileQuestion, Loader2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import axiosInstance from "@/app/lib/axios";

const VideoLesson = ({ content }) => {
  const youtubeId = useMemo(() => {
    if (!content?.video_id) return "";
    if (/^[a-zA-Z0-9_-]{11}$/.test(content.video_id)) return content.video_id;
    const regex = /(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|youtu\.be\/|youtube\.com\/shorts\/|m\.youtube\.com\/)([a-zA-Z0-9_-]{11})(?:&|$|\?|\/)/;
    const match = content.video_id.match(regex);
    return match ? match[1] : "";
  }, [content?.video_id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title || "Untitled Content"}</CardTitle>
        {content.duration && (
          <CardDescription>Duration: {content.duration} min</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {content.content_type === "video" && youtubeId ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={content.title || "Video Content"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              aria-label={`Video: ${content.title || "Video Content"}`}
            ></iframe>
          </div>
        ) : content.content_type === "text" && content.text_content ? (
          <div className="mt-4 prose prose-sm max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content.text_content),
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500">No content available for this section.</p>
        )}
      </CardContent>
    </Card>
  );
};

const AssignmentContent = ({ assignment }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{assignment.title || "Untitled Assignment"}</CardTitle>
        <CardDescription>
          Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(assignment.description || "No description available"),
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          onClick={() => console.log(`Download assignment file: ${assignment.id}`)}
        >
          Download Assignment
        </Button>
      </CardFooter>
    </Card>
  );
};

const QuizQuestion = ({ question, answer, onChange, disabled }) => {
  const normalizedChoices = useMemo(() => {
    let choices = question.choices || [];
    if (typeof question.choices === "string") {
      choices = question.choices.split(",").map((choice) => choice.trim()).filter(Boolean);
    }
    const seen = new Set();
    const hasDuplicates = choices.some((choice) => {
      if (seen.has(choice)) return true;
      seen.add(choice);
      return false;
    });
    if (hasDuplicates) {
      toast({
        title: "Warning",
        description: "This question contains duplicate choices, which may affect quiz accuracy.",
        variant: "destructive",
        duration: 5000,
      });
    }
    return choices;
  }, [question.choices]);

  const currentAnswer = useMemo(() => {
    if (question.question_type === "multiple_choice_multiple") {
      return Array.isArray(answer) ? answer : [];
    }
    return answer || (question.question_type === "short_answer" ? "" : null);
  }, [answer, question.question_type]);

  const handleMultipleChoiceMultipleChange = (optionLabel) => {
    const newAnswer = currentAnswer.includes(optionLabel)
      ? currentAnswer.filter((a) => a !== optionLabel)
      : [...currentAnswer, optionLabel];
    onChange(question.id, newAnswer);
  };

  if (question.question_type === "short_answer") {
    return (
      <div className="border p-4 rounded-md mb-4">
        <p className="font-medium mb-3">{question.text}</p>
        <Input
          type="text"
          value={currentAnswer}
          onChange={(e) => onChange(question.id, e.target.value)}
          disabled={disabled}
          placeholder="Type your answer here"
          className="w-full"
          aria-label={`Answer for question: ${question.text}`}
        />
      </div>
    );
  }

  if (normalizedChoices.length === 0) {
    return (
      <div className="border p-4 rounded-md mb-4 bg-red-50">
        <p className="font-medium mb-3 text-red-600">Error: No choices available for this question.</p>
        <p>{question.text}</p>
      </div>
    );
  }

  const isMultiple = question.question_type === "multiple_choice_multiple";
  return (
    <div className="border p-4 rounded-md mb-4">
      <p className="font-medium mb-3">{question.text}</p>
      <div className="space-y-2">
        {normalizedChoices.map((option, index) => {
          const optionLabel = String.fromCharCode(65 + index);
          return (
            <label
              key={`${question.id}-${optionLabel}`}
              className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              <input
                type={isMultiple ? "checkbox" : "radio"}
                name={isMultiple ? `question-${question.id}-${optionLabel}` : `question-${question.id}`}
                value={optionLabel}
                checked={isMultiple ? currentAnswer.includes(optionLabel) : currentAnswer === optionLabel}
                onChange={() =>
                  isMultiple
                    ? handleMultipleChoiceMultipleChange(optionLabel)
                    : onChange(question.id, optionLabel)
                }
                disabled={disabled}
                aria-label={`Option ${optionLabel}: ${option}`}
                className="mr-2"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const QuizResults = ({ results, onRetake }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Quiz Results: {results.score}/100</h3>
        <Button variant="outline" onClick={onRetake} size="sm" disabled={!results.can_retake}>
          Retake Quiz
        </Button>
      </div>
      {results.detailed_results &&
        Object.values(results.detailed_results).map((result) => (
          <div
            key={result.question}
            className={`border p-4 rounded-md ${result.is_correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <p className="font-medium mb-2">{result.question}</p>
            <p className={`${result.is_correct ? "text-green-600" : "text-red-600"} mb-1`}>
              Your answer: {Array.isArray(result.your_answer) ? result.your_answer.join(", ") : result.your_answer}
            </p>
            {!result.is_correct && (
              <p className="text-gray-700">
                Correct answer: {Array.isArray(result.correct_answer) ? result.correct_answer.join(", ") : result.correct_answer}
              </p>
            )}
            {result.explanation && (
              <p className="text-sm mt-2 text-gray-600">{result.explanation}</p>
            )}
          </div>
        ))}
    </div>
  );
};

export function LessonContent({ lesson, selectedQuiz, selectedAssignment, onQuizComplete }) {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!selectedQuiz) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/quizzes/${selectedQuiz.id}/take/`);
        setQuizData(response.data.quiz);
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizResults(null);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        toast({
          title: "Error",
          description: "Failed to load quiz data.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [selectedQuiz]);

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitQuiz = async () => {
    if (!quizData?.questions) {
      toast({
        title: "Error",
        description: "No questions available to submit.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    const unanswered = quizData.questions.filter((q) => {
      const ans = quizAnswers[q.id];
      return !ans || (Array.isArray(ans) && ans.length === 0);
    });

    if (unanswered.length > 0) {
      toast({
        title: "Incomplete Quiz",
        description: `Please answer all ${unanswered.length} remaining questions.`,
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/quizzes/${selectedQuiz.id}/submit/`, {
        answers: quizAnswers,
        time_taken: 0,
      });
      const result = response.data;
      setQuizResults({
        score: result.score,
        total_points: result.total_points,
        can_retake: result.attempts_remaining > 0,
        detailed_results: result.detailed_results,
      });
      setQuizSubmitted(true);

      if (result.passed && onQuizComplete) {
        onQuizComplete(selectedQuiz.id);
      }

      toast({
        title: "Quiz Submitted",
        description: `Score: ${result.score}% (${result.correct_answers}/${result.total_questions})`,
        variant: result.passed ? "default" : "destructive",
      });
    } catch (err) {
      console.error("Submission failed:", err);
      toast({
        title: "Submission Failed",
        description: `Error: ${err.response?.data?.detail || err.message}`,
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

  // Debugging props
  console.log("LessonContent Props:", { lesson, selectedQuiz, selectedAssignment });

  if (loading) {
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

  if (selectedQuiz) {
    if (quizData) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center mb-2">
              <FileQuestion className="h-5 w-5 mr-2 text-amber-500" />
              <CardTitle>{quizData.title || "Untitled Quiz"}</CardTitle>
            </div>
            <CardDescription>{quizData.description || "No description available"}</CardDescription>
            <div className="text-xs text-gray-500">
              Passing Score: {quizData.passing_score || "N/A"}% | Attempts Remaining: {quizData.attempts_remaining ?? "Unknown"}
              {quizData.time_limit && ` | Time Limit: ${quizData.time_limit} min`}
            </div>
          </CardHeader>
          <CardContent>
            {quizSubmitted && quizResults ? (
              <QuizResults results={quizResults} onRetake={handleRetakeQuiz} />
            ) : (
              <div className="space-y-4">
                {quizData.questions?.map((q) => (
                  <QuizQuestion
                    key={q.id}
                    question={q}
                    answer={quizAnswers[q.id]}
                    onChange={handleQuizAnswer}
                    disabled={quizSubmitted}
                  />
                )) || <p>No questions available.</p>}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {!quizSubmitted ? (
              <Button
                onClick={submitQuiz}
                disabled={loading || quizData?.can_attempt === false}
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
              <div></div>
            )}
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card className="mb-6">
        <CardContent className="p-6 flex justify-center items-center h-64">
          <div className="text-center text-gray-500">
            <p>Quiz data not available. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedAssignment) {
    return <AssignmentContent assignment={selectedAssignment} />;
  }

  if (lesson) {
    return (
      <div className="space-y-4">
        <div className="flex">
          <p>{lesson.description || "No description available"}</p>
        </div>
        {lesson.contents?.length > 0 ? (
          lesson.contents.map((content, idx) => (
            <VideoLesson key={idx} content={content} />
          ))
        ) : (
          <p className="text-gray-500">No lesson content available.</p>
        )}
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6 flex justify-center items-center h-64">
        <div className="text-center text-gray-500">
          <p>No content available.</p>
        </div>
      </CardContent>
    </Card>
  );
}