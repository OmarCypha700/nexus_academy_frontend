"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { DialogFooter } from "@/app/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";
import axiosInstance from "@/app/lib/axios";

export default function CourseForm({
  editMode = false,
  initialData = null,
  onSubmit,
  onCancel,
  error,
  success,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [introVideoId, setIntroVideoId] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [newOutcome, setNewOutcome] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || "");
      setIntroVideoId(initialData.intro_video_id || "");
      setIsPublished(initialData.is_published || false);
      setOutcomes(initialData.outcomes || []);
      setRequirements(initialData.requirements || []);
    }
  }, [initialData]);

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setOutcomes([...outcomes, { text: newOutcome, position: outcomes.length }]);
      setNewOutcome("");
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, { text: newRequirement, position: requirements.length }]);
      setNewRequirement("");
    }
  };

  const handleDeleteOutcome = (index) => {
    setOutcomes(outcomes.filter((_, i) => i !== index).map((item, i) => ({ ...item, position: i })));
  };

  const handleDeleteRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index).map((item, i) => ({ ...item, position: i })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      price,
      intro_video_id: introVideoId,
      is_published: isPublished,
      outcomes,
      requirements,
    };
    try {
      if (editMode && initialData?.id) {
        // Update existing outcomes
        await Promise.all(outcomes.map(async (outcome, index) => {
          if (outcome.id) {
            // Update existing outcome
            await axiosInstance.put(`/courses/${initialData.id}/outcomes/${outcome.id}/`, {
              text: outcome.text,
              position: index,
            });
          } else {
            // Create new outcome
            await axiosInstance.post(`/courses/${initialData.id}/outcomes/`, {
              text: outcome.text,
              position: index,
            });
          }
        }));

        // Delete removed outcomes
        const initialOutcomeIds = (initialData.outcomes || []).map(o => o.id);
        const currentOutcomeIds = outcomes.filter(o => o.id).map(o => o.id);
        const outcomesToDelete = initialOutcomeIds.filter(id => !currentOutcomeIds.includes(id));
        await Promise.all(outcomesToDelete.map(async (id) => {
          await axiosInstance.delete(`/courses/${initialData.id}/outcomes/${id}/`);
        }));

        // Update existing requirements
        await Promise.all(requirements.map(async (req, index) => {
          if (req.id) {
            // Update existing requirement
            await axiosInstance.put(`/courses/${initialData.id}/requirements/${req.id}/`, {
              text: req.text,
              position: index,
            });
          } else {
            // Create new requirement
            await axiosInstance.post(`/courses/${initialData.id}/requirements/`, {
              text: req.text,
              position: index,
            });
          }
        }));

        // Delete removed requirements
        const initialRequirementIds = (initialData.requirements || []).map(r => r.id);
        const currentRequirementIds = requirements.filter(r => r.id).map(r => r.id);
        const requirementsToDelete = initialRequirementIds.filter(id => !currentRequirementIds.includes(id));
        await Promise.all(requirementsToDelete.map(async (id) => {
          await axiosInstance.delete(`/courses/${initialData.id}/requirements/${id}/`);
        }));
      } else {
        // For new courses, use bulk create
        if (outcomes.length > 0) {
          await axiosInstance.post('/courses/outcomes/bulk-create/', {
            course: initialData?.id,
            outcomes,
          });
        }
        if (requirements.length > 0) {
          await axiosInstance.post('/courses/requirements/bulk-create/', {
            course_id: initialData?.id,
            requirements,
          });
        }
      }
      onSubmit(formData);
    } catch (err) {
      console.error("Error submitting outcomes/requirements:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto space-y-4 p-2">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          placeholder="Enter course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-32"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="introVideoId">Intro Video ID (optional)</Label>
        <Input
          id="introVideoId"
          placeholder="Enter YouTube video ID"
          value={introVideoId}
          onChange={(e) => setIntroVideoId(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Course Outcomes</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a learning outcome"
            value={newOutcome}
            onChange={(e) => setNewOutcome(e.target.value)}
          />
          <Button type="button" onClick={handleAddOutcome}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
        <ul className="mt-2 space-y-2">
          {outcomes.map((outcome, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{outcome.text}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteOutcome(index)}
              >
                <Trash2 className="h-4 w-4" color="red" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <Label>Course Requirements</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a requirement"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
          />
          <Button type="button" onClick={handleAddRequirement}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
        <ul className="mt-2 space-y-2">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{req.text}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteRequirement(index)}
              >
                <Trash2 className="h-4 w-4" color="red" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {editMode && (
        <div className="space-y-2 flex items-center gap-2">
          <input
            id="is_published"
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="is_published">Publish Course</Label>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editMode ? "Update Course" : "Create Course"}
        </Button>
      </DialogFooter>
    </form>
  );
}