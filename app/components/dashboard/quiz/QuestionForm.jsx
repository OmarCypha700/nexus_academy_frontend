"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export default function QuestionForm({ quizId, question, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    text: question?.text || "",
    question_type: question?.question_type || "multiple_choice_single",
    choices: question?.choices || ["", "", "", ""],
    correct_answer: question?.correct_answer || "",
    points: question?.points || 1,
    explanation: question?.explanation || "",
    position: question?.position || 0,
  });

  const handleChoiceChange = (index, value) => {
    const newChoices = [...formData.choices];
    newChoices[index] = value;
    setFormData({ ...formData, choices: newChoices });
  };

  const addChoice = () => {
    setFormData({ ...formData, choices: [...formData.choices, ""] });
  };

  const removeChoice = (index) => {
    const newChoices = formData.choices.filter((_, i) => i !== index);
    setFormData({ ...formData, choices: newChoices });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      choices: formData.choices.filter((c) => c.trim() !== ""),
      correct_answer:
        formData.question_type === "multiple_choice_multiple"
          ? formData.correct_answer
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a !== "")
          : formData.correct_answer,
    };
    onSubmit(payload);
  };

  return (
    <div className="h-[80vh] overflow-y-auto rounded-xl shadow-md border p-6 bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="text">Question Text</Label>
          <Input
            id="text"
            value={formData.text}
            onChange={(e) =>
              setFormData({ ...formData, text: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="question_type">Question Type</Label>
          <Select
            value={formData.question_type}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                question_type: value,
                choices:
                  value === "true_false"
                    ? ["True", "False"]
                    : formData.choices,
                correct_answer: "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice_single">
                Multiple Choice (Single)
              </SelectItem>
              <SelectItem value="multiple_choice_multiple">
                Multiple Choice (Multiple)
              </SelectItem>
              <SelectItem value="true_false">True/False</SelectItem>
              <SelectItem value="short_answer">Short Answer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {["multiple_choice_single", "multiple_choice_multiple"].includes(
          formData.question_type
        ) && (
          <div>
            <Label>Choices</Label>
            {formData.choices.map((choice, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={choice}
                  onChange={(e) =>
                    handleChoiceChange(index, e.target.value)
                  }
                  placeholder={`Choice ${index + 1}`}
                />
                {formData.choices.length > 2 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeChoice(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addChoice}
              className="mt-2"
            >
              Add Choice
            </Button>
          </div>
        )}

        <div>
          <Label htmlFor="correct_answer">Correct Answer</Label>
          <Input
            id="correct_answer"
            value={
              Array.isArray(formData.correct_answer)
                ? formData.correct_answer.join(", ")
                : formData.correct_answer
            }
            onChange={(e) =>
              setFormData({ ...formData, correct_answer: e.target.value })
            }
            placeholder={
              formData.question_type === "multiple_choice_multiple"
                ? "Enter correct answers (comma-separated)"
                : formData.question_type === "true_false"
                ? "True or False"
                : "Correct answer"
            }
          />
        </div>

        <div>
          <Label htmlFor="points">Points</Label>
          <Input
            id="points"
            type="number"
            value={formData.points}
            onChange={(e) =>
              setFormData({
                ...formData,
                points: parseInt(e.target.value) || 1,
              })
            }
            min="1"
            required
          />
        </div>

        <div>
          <Label htmlFor="explanation">Explanation</Label>
          <Input
            id="explanation"
            value={formData.explanation}
            onChange={(e) =>
              setFormData({ ...formData, explanation: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
