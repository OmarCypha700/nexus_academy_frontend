// app/components/dashboard/course/QuizForm.js
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import axiosInstance from "@/app/lib/axios";

export default function QuizForm({ courseId, quiz, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lesson: "",
    time_limit: "",
    passing_score: "70.00",
    max_attempts: "3",
    shuffle_questions: false,
  });
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(!!quiz);

  useEffect(() => {
    fetchLessons();
    if (quiz) {
      setFormData({
        title: quiz.title,
        description: quiz.description,
        lesson: quiz.lesson?.toString() || "",
        time_limit: quiz.time_limit?.toString() || "",
        passing_score: quiz.passing_score,
        max_attempts: quiz.max_attempts,
        shuffle_questions: quiz.shuffle_questions,
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [quiz]);

  const fetchLessons = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/lessons/`);
      console.log(response.data)
      setLessons(response.data);
    } catch (err) {
      console.error("Failed to load lessons:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Quiz Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter quiz title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter quiz description"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lesson">Lesson</Label>
        <Select
          value={formData.lesson}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, lesson: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select lesson" />
          </SelectTrigger>
          <SelectContent>
            {lessons.map((lesson) => (
              <SelectItem key={lesson.id} value={lesson.id.toString()}>
                {lesson.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="time_limit">Time Limit (minutes)</Label>
          <Input
            id="time_limit"
            name="time_limit"
            type="number"
            value={formData.time_limit}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passing_score">Passing Score (%)</Label>
          <Input
            id="passing_score"
            name="passing_score"
            type="number"
            value={formData.passing_score}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_attempts">Max Attempts</Label>
          <Input
            id="max_attempts"
            name="max_attempts"
            type="number"
            value={formData.max_attempts}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shuffle_questions">Shuffle Questions</Label>
          <input
            id="shuffle_questions"
            name="shuffle_questions"
            type="checkbox"
            checked={formData.shuffle_questions}
            onChange={handleChange}
            className="h-4 w-4"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{quiz?.id ? "Update" : "Create"} Quiz</Button>
      </div>
    </form>
  );
}