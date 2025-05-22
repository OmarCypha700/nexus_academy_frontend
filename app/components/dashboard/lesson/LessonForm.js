"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";

export default function LessonForm({
  open,
  onOpenChange,
  mode = "add", // "add" | "edit"
  initialData = null,
  modules = [],
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_id: "",
    duration: "",
    position: "",
    module: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        video_id: initialData.video_id || "",
        duration: initialData.duration || "",
        position: initialData.position || "",
        module: initialData.module?.toString() || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        video_id: "",
        duration: "",
        position: "",
        module: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectModule = (value) => {
    setFormData((prev) => ({ ...prev, module: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
          {mode === "add" && (
            <DialogDescription>Create a new lesson and assign it to a module.</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Lesson title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Lesson description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module">Module</Label>
            <Select value={formData.module} onValueChange={handleSelectModule}>
              <SelectTrigger>
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((mod) => (
                  <SelectItem key={mod.id} value={mod.id.toString()}>
                    {mod.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_id">Video ID (YouTube)</Label>
            <Input
              id="video_id"
              name="video_id"
              placeholder="YouTube Video ID"
              value={formData.video_id}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="Duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                type="number"
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {mode === "edit" ? "Update Lesson" : "Add Lesson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
