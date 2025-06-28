"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";

export default function QuizPreview({ quiz }) {
  if (!quiz) return <div>No quiz selected</div>;

  return (
    <Card className="h-[75vh] max-h-[80vh] rounded-xl shadow-md overflow-y-auto p-4">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {quiz.description || "No description provided"} • {quiz.total_questions} questions •
          Time Limit: {quiz.time_limit ? `${quiz.time_limit} minutes` : "None"} •
          Passing Score: {quiz.passing_score}% • Max Attempts: {quiz.max_attempts}
        </p>
      </CardHeader>

      <CardContent>
        {quiz.questions.length === 0 ? (
          <p className="text-muted-foreground">No questions added yet</p>
        ) : (
          quiz.questions.map((question, index) => (
            <div key={question.id} className="mb-6">
              <p className="font-medium">
                {index + 1}. {question.text} ({question.points} points)
              </p>

              {question.question_type === "multiple_choice_single" && (
                <RadioGroup disabled>
                  {question.choices.map((choice, idx) => (
                    <div key={idx} className="flex items-center gap-2 mt-2">
                      <RadioGroupItem value={choice} id={`q${question.id}-${idx}`} />
                      <Label htmlFor={`q${question.id}-${idx}`}>{choice}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.question_type === "multiple_choice_multiple" && (
                <div className="space-y-2 mt-2">
                  {question.choices.map((choice, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Checkbox id={`q${question.id}-${idx}`} disabled />
                      <Label htmlFor={`q${question.id}-${idx}`}>{choice}</Label>
                    </div>
                  ))}
                </div>
              )}

              {question.question_type === "true_false" && (
                <RadioGroup disabled>
                  {question.choices.map((choice, idx) => (
                    <div key={idx} className="flex items-center gap-2 mt-2">
                      <RadioGroupItem value={choice} id={`q${question.id}-${idx}`} />
                      <Label htmlFor={`q${question.id}-${idx}`}>{choice}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.question_type === "short_answer" && (
                <Input placeholder="Enter your answer" disabled className="mt-2" />
              )}

              <p className="text-sm text-muted-foreground mt-2">
                Correct Answer: {question.correct_answer}
                {question.explanation && (
                  <span> • Explanation: {question.explanation}</span>
                )}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
