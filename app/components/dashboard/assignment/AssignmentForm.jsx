"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { RichTextEditor, isRichTextEmpty } from "@/app/components/ui/rich-text-editor";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";
import axiosInstance from "@/app/lib/axios";

const emptyResource = () => ({
  title: "",
  url: "",
  description: "",
  resource_type: "link",
});

export default function AssignmentForm({ courseId, assignment, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lesson: "",
    due_date: "",
    resources: [],
  });
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        lesson: assignment.lesson?.toString() || "",
        due_date: assignment.due_date ? assignment.due_date.slice(0, 16) : "",
        resources: assignment.resources || [],
      });
    }
  }, [assignment]);

  const fetchLessons = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/lessons/`);
      setLessons(response.data);
    } catch (err) {
      console.error("Failed to load lessons:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (e, index) => {
    const { name, value } = e.target;
    const newResources = [...formData.resources];
    newResources[index] = { ...newResources[index], [name]: value };
    setFormData((prev) => ({ ...prev, resources: newResources }));
  };

  const handleResourceTypeChange = (value, index) => {
    const newResources = [...formData.resources];
    newResources[index] = { ...newResources[index], resource_type: value };
    setFormData((prev) => ({ ...prev, resources: newResources }));
  };

  const handleAddResource = () => {
    setFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, emptyResource()],
    }));
  };

  const handleRemoveResource = (index) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Untouched blank rows are dropped rather than submitted as empty resources.
    const resources = formData.resources.filter(
      (r) => r.title?.trim() || r.url?.trim() || !isRichTextEmpty(r.description)
    );
    onSubmit({
      ...formData,
      due_date: formData.due_date || null,
      resources,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Assignment Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter assignment title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Assignment Question(s)</Label>
        <RichTextEditor
          value={formData.description}
          onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
          placeholder="Paste the assignment question(s) here"
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
      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date (optional)</Label>
        <Input
          id="due_date"
          name="due_date"
          type="datetime-local"
          value={formData.due_date}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Resources (optional)</Label>
        {formData.resources.map((resource, index) => (
          <div key={index} className="space-y-2 border p-4 rounded-md">
            <div className="flex justify-between items-center">
              <Label>Resource {index + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => handleRemoveResource(index)}
              >
                <Trash2 size={14} color="red" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`resource-title-${index}`}>Resource Title</Label>
              <Input
                id={`resource-title-${index}`}
                name="title"
                placeholder="Resource title"
                value={resource.title || ""}
                onChange={(e) => handleResourceChange(e, index)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`resource-url-${index}`}>Resource URL</Label>
              <Input
                id={`resource-url-${index}`}
                name="url"
                placeholder="https://..."
                value={resource.url || ""}
                onChange={(e) => handleResourceChange(e, index)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`resource-description-${index}`}>Description</Label>
              <RichTextEditor
                value={resource.description || ""}
                onChange={(html) => {
                  const newResources = [...formData.resources];
                  newResources[index] = { ...newResources[index], description: html };
                  setFormData((prev) => ({ ...prev, resources: newResources }));
                }}
                placeholder="Resource description"
              />
            </div>
            <Select
              value={resource.resource_type}
              onValueChange={(value) => handleResourceTypeChange(value, index)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button variant="outline" size="sm" type="button" onClick={handleAddResource}>
          <Plus size={16} className="mr-1" /> Add Resource
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{assignment?.id ? "Update" : "Create"} Assignment</Button>
      </div>
    </form>
  );
}
