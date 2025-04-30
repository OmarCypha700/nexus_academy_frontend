import { useState, useEffect, useMemo } from "react";
import { FileText, Download, BookOpen, FileQuestion, PlayCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";
import DOMPurify from "dompurify";

// Component for displaying lesson content types
const ContentTypeIcon = ({ type }) => {
  const iconMap = {
    video: <PlayCircle className="h-12 w-12 mx-auto text-blue-500 mb-4" />,
    text: <BookOpen className="h-12 w-12 mx-auto text-gray-500 mb-4" />,
    quiz: <FileQuestion className="h-12 w-12 mx-auto text-amber-500 mb-4" />,
    assignment: <FileText className="h-12 w-12 mx-auto text-green-500 mb-4" />,
    download: <Download className="h-12 w-12 mx-auto text-purple-500 mb-4" />,
    interactive: <PlayCircle className="h-12 w-12 mx-auto text-indigo-500 mb-4" />,
  };

  return iconMap[type] || <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />;
};

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
            <CardDescription>Duration: {lesson.duration}</CardDescription>
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
        </CardContent>
      </Card>
      
      {lesson.description && (
        <Card className="prose max-w-none">
          <CardContent className="p-4">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(lesson.description),
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Text lesson component
const TextLesson = ({ lesson }) => {
  return (
    <Card className="prose max-w-none mb-6">
      <CardHeader>
        <CardTitle>{lesson.title}</CardTitle>
        {lesson.estimated_read_time && (
          <CardDescription>Reading time: ~{lesson.estimated_read_time} min</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              lesson.content_html || `<p>${lesson.description || ""}</p>`
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

// Quiz question component
const QuizQuestion = ({ question, answer, onChange, disabled }) => {
  return (
    <div className="border p-3 rounded">
      <p className="font-medium mb-2">{question.question_text}</p>
      {question.type === "mcq" ? (
        <div className="space-y-2">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionText = question[`option_${option.toLowerCase()}`];
            if (!optionText) return null;
            
            return (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answer === option}
                  onChange={() => onChange(question.id, option)}
                  disabled={disabled}
                  aria-label={`Option ${option}: ${optionText}`}
                />
                <span className="ml-2">{optionText}</span>
              </label>
            );
          })}
        </div>
      ) : question.type === "fill_in" ? (
        <Input
          placeholder="Enter your answer"
          value={answer || ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          disabled={disabled}
          aria-label={`Answer for: ${question.question_text}`}
        />
      ) : null}
    </div>
  );
};

// Quiz results component
const QuizResults = ({ results }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Quiz Results: {results.score}/{results.total}</h3>
      {results.results.map((result) => (
        <div 
          key={result.question_id} 
          className={`border p-3 rounded ${result.is_correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
        >
          <p className="font-medium">{result.question_text}</p>
          <p className={result.is_correct ? "text-green-600" : "text-red-600"}>
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

// Download content component
const DownloadableContent = ({ title, description, contentType, contentUrl, onDownload }) => {
  const [loading, setLoading] = useState(false);
  
  const handleDownload = async () => {
    setLoading(true);
    try {
      await onDownload(contentType, contentUrl);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <ContentTypeIcon type={contentType} />
            <h3 className="font-medium mb-2">{contentType.charAt(0).toUpperCase() + contentType.slice(1)} Resource</h3>
            <p className="text-sm text-gray-500 mb-4">
              Download this resource to enhance your learning.
            </p>
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={loading || !contentUrl}
              aria-label={`Download ${contentType}`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Resource
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main LessonContent component
export function LessonContent({ currentLesson, selectedQuizId, selectedAssignmentId }) {
  const [loading, setLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  // Reset state when lesson or selected quiz changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
    
    if (selectedQuizId && currentLesson?.quizzes) {
      const quiz = currentLesson.quizzes.find(q => q.id === selectedQuizId);
      setCurrentQuiz(quiz);
    } else {
      setCurrentQuiz(null);
    }
  }, [currentLesson, selectedQuizId]);

  const handleInteractiveContent = async (contentType, contentUrl) => {
    setLoading(true);
    try {
      if (!contentUrl) {
        toast({
          title: "Content Unavailable",
          description: `This ${contentType} is not currently available.`,
          duration: 3000,
        });
        return;
      }
      
      window.open(contentUrl, "_blank", "noopener,noreferrer");
      toast({
        title: "Opening Content",
        description: `Opening ${contentType} in a new tab.`,
        duration: 3000,
      });
    } catch (error) {
      console.error(`Error handling ${contentType}:`, error);
      toast({
        title: "Error Accessing Content",
        description: `Could not open the ${contentType}: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitQuiz = async () => {
    // Validate all questions are answered
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
      const response = await fetch(`http://localhost:8000/api/quizzes/${selectedQuizId}/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: quizAnswers }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${response.status}`);
      }

      const result = await response.json();
      setQuizResults(result);
      setQuizSubmitted(true);
      
      // Show appropriate message based on score
      const scorePercentage = (result.score / result.total) * 100;
      const messages = {
        title: "Quiz Submitted",
        description: `Your score: ${result.score}/${result.total} (${scorePercentage.toFixed(0)}%)`,
        variant: scorePercentage >= 70 ? "default" : "destructive",
      };
      
      toast(messages);
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

  // Loading state
  if (!currentLesson) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 flex justify-center items-center h-64">
          <div className="text-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading lesson content...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render Quiz if selected
  if (selectedQuizId) {
    if (!currentQuiz) {
      return (
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Quiz not found</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{currentQuiz.title}</CardTitle>
          <CardDescription>{currentQuiz.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {quizSubmitted && quizResults ? (
            <QuizResults results={quizResults} />
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
        <CardFooter>
          {!quizSubmitted && (
            <Button 
              onClick={submitQuiz} 
              disabled={loading || quizSubmitted}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </Button>
          )}
          {quizSubmitted && (
            <Button
              variant="outline"
              onClick={() => {
                setQuizSubmitted(false);
                setQuizResults(null);
              }}
              className="w-full md:w-auto"
            >
              Retake Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Render Assignment if selected
  if (selectedAssignmentId) {
    const assignment = currentLesson.assignments?.find((a) => a.id === selectedAssignmentId);
    
    if (!assignment) {
      return (
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Assignment not found</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{assignment.title}</CardTitle>
          <CardDescription>{assignment.description}</CardDescription>
          {assignment.due_date && (
            <p className="text-sm text-gray-500">
              Due: {new Date(assignment.due_date).toLocaleDateString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <ContentTypeIcon type="assignment" />
              <h3 className="font-medium mb-2">Assignment Materials</h3>
              <p className="text-sm text-gray-500 mb-4">
                Download and complete the assignment as instructed.
              </p>
              <Button
                variant="outline"
                onClick={() => handleInteractiveContent("assignment", assignment.file)}
                disabled={loading}
                aria-label="Download assignment"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Assignment
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render Lesson Content based on type
  switch (currentLesson.type) {
    case "video":
      return <VideoLesson lesson={currentLesson} />;
      
    case "text":
      return <TextLesson lesson={currentLesson} />;
      
    case "assignment":
      return (
        <DownloadableContent
          title="Assignment"
          description={currentLesson.description}
          contentType="assignment"
          contentUrl={currentLesson.content_url}
          onDownload={handleInteractiveContent}
        />
      );
      
    case "quiz":
      return (
        <DownloadableContent
          title="Knowledge Check"
          description={currentLesson.description}
          contentType="quiz"
          contentUrl={currentLesson.content_url}
          onDownload={handleInteractiveContent}
        />
      );
      
    case "download":
      return (
        <DownloadableContent
          title="Downloadable Content"
          description={currentLesson.description}
          contentType="resource"
          contentUrl={currentLesson.content_url}
          onDownload={handleInteractiveContent}
        />
      );
      
    case "interactive":
      return (
        <DownloadableContent
          title="Interactive Exercise"
          description={currentLesson.description}
          contentType="interactive exercise"
          contentUrl={currentLesson.content_url}
          onDownload={handleInteractiveContent}
        />
      );
      
    default:
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{currentLesson.title || "Lesson Content"}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              {currentLesson.description || "No content available for this lesson type."}
            </p>
          </CardContent>
        </Card>
      );
  }
}