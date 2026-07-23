"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
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

  // The backend (Question.clean() in models.py) requires correct_answer to be a letter
  // label ('A', 'B', ...) referencing a choice by position, not the choice's own text —
  // and it assigns labels against the *filtered* (non-blank) choices list, exactly like the
  // submit payload below. Deriving options from that same filtered list keeps the letters
  // shown here in sync with what the backend will actually validate against.
  const optionLabels = formData.choices
    .filter((c) => c.trim() !== "")
    .map((text, i) => ({ label: String.fromCharCode(65 + i), text }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      choices: formData.choices.filter((c) => c.trim() !== ""),
      // multiple_choice_multiple's correct_answer is already an array of labels (built by
      // the checkboxes above) — no comma-string parsing needed anymore.
      correct_answer: formData.correct_answer,
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
          <Label>Correct Answer</Label>

          {formData.question_type === "multiple_choice_single" && (
            <Select
              value={
                typeof formData.correct_answer === "string"
                  ? formData.correct_answer
                  : ""
              }
              onValueChange={(value) =>
                setFormData({ ...formData, correct_answer: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select the correct choice" />
              </SelectTrigger>
              <SelectContent>
                {optionLabels.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Add at least 2 choices first
                  </div>
                ) : (
                  optionLabels.map(({ label, text }) => (
                    <SelectItem key={label} value={label}>
                      {label}: {text}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}

          {formData.question_type === "multiple_choice_multiple" && (
            <div className="space-y-2 mt-2">
              {optionLabels.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Add at least 2 choices first
                </p>
              ) : (
                optionLabels.map(({ label, text }) => {
                  const selected = Array.isArray(formData.correct_answer)
                    ? formData.correct_answer
                    : [];
                  const checked = selected.includes(label);
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <Checkbox
                        id={`correct-${label}`}
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          const next = isChecked
                            ? [...selected, label]
                            : selected.filter((l) => l !== label);
                          setFormData({ ...formData, correct_answer: next });
                        }}
                      />
                      <Label htmlFor={`correct-${label}`} className="font-normal">
                        {label}: {text}
                      </Label>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {formData.question_type === "true_false" && (
            <Select
              value={
                typeof formData.correct_answer === "string"
                  ? formData.correct_answer
                  : ""
              }
              onValueChange={(value) =>
                setFormData({ ...formData, correct_answer: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select True or False" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="True">True</SelectItem>
                <SelectItem value="False">False</SelectItem>
              </SelectContent>
            </Select>
          )}

          {formData.question_type === "short_answer" && (
            <Input
              id="correct_answer"
              className="mt-2"
              value={
                typeof formData.correct_answer === "string"
                  ? formData.correct_answer
                  : ""
              }
              onChange={(e) =>
                setFormData({ ...formData, correct_answer: e.target.value })
              }
              placeholder="Correct answer"
            />
          )}
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
