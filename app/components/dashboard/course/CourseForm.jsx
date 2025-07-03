"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { DialogFooter } from "@/app/components/ui/dialog";

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

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || "");
      setIntroVideoId(initialData.intro_video_id || "");
      setIsPublished(initialData.is_published || false);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      price,
      intro_video_id: introVideoId,
      is_published: isPublished,
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
