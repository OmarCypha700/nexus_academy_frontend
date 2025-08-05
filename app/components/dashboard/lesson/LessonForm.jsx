"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

export default function LessonForm({
  open,
  onOpenChange,
  mode = "add",
  initialData = null,
  modules = [],
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contents: [
      {
        content_type: "text",
        title: "",
        video_id: "",
        text_content: "",
        duration: "",
        position: 0,
      },
    ],
    resources: [
      {
        title: "",
        url: "",
        description: "",
        resource_type: "link",
        position: 0,
      },
    ],
    position: "",
    module: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        contents: initialData.contents?.map((content, idx) => ({
          content_type: content.content_type || "text",
          title: content.title || "",
          video_id: content.video_id || "",
          text_content: content.text_content || "",
          duration: content.duration != null ? content.duration.toString() : "",
          position: content.position || idx,
        })) || [
          {
            content_type: "text",
            title: "",
            video_id: "",
            text_content: "",
            duration: "",
            position: 0,
          },
        ],
        resources: initialData.resources?.map((resource, idx) => ({
          title: resource.title || "",
          url: resource.url || "",
          description: resource.description || "",
          resource_type: resource.resource_type || "link",
          position: resource.position || idx,
        })) || [
          {
            title: "",
            url: "",
            description: "",
            resource_type: "link",
            position: 0,
          },
        ],
        position: initialData.position != null ? initialData.position.toString() : "0",
        module: initialData.module?.id?.toString() || initialData.module?.toString() || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        contents: [
          {
            content_type: "text",
            title: "",
            video_id: "",
            text_content: "",
            duration: "",
            position: 0,
          },
        ],
        resources: [
          {
            title: "",
            url: "",
            description: "",
            resource_type: "link",
            position: 0,
          },
        ],
        position: "",
        module: "",
      });
    }
    setErrors({});
  }, [initialData, open, mode]);

  const handleChange = (e, index = -1, section = "contents") => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (index === -1) {
        return { ...prev, [name]: value };
      } else {
        const newItems = [...prev[section]];
        newItems[index] = { ...newItems[index], [name]: value };
        return { ...prev, [section]: newItems };
      }
    });
    setErrors((prev) => ({ ...prev, [index === -1 ? name : `${section}-${index}`]: "" }));
  };

  const handleAddContent = () => {
    const maxPosition = Math.max(...formData.contents.map((c) => c.position), -1);
    setFormData((prev) => ({
      ...prev,
      contents: [
        ...prev.contents,
        {
          content_type: "text",
          title: "",
          video_id: "",
          text_content: "",
          duration: "",
          position: maxPosition + 1,
        },
      ],
    }));
  };

  const handleAddResource = () => {
    const maxPosition = Math.max(...formData.resources.map((r) => r.position), -1);
    setFormData((prev) => ({
      ...prev,
      resources: [
        ...prev.resources,
        {
          title: "",
          url: "",
          description: "",
          resource_type: "link",
          position: maxPosition + 1,
        },
      ],
    }));
  };

  const handleRemoveContent = (index) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents.filter((_, i) => i !== index).map((c, i) => ({
        ...c,
        position: i,
      })),
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`content-${index}`];
      return newErrors;
    });
  };

  const handleRemoveResource = (index) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index).map((r, i) => ({
        ...r,
        position: i,
      })),
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`resource-${index}`];
      return newErrors;
    });
  };

  const handleSelectContentType = (value, index) => {
    const newContents = [...formData.contents];
    newContents[index] = {
      ...newContents[index],
      content_type: value,
      video_id: value === "video" ? "" : null,
      text_content: value === "text" ? "" : null,
    };
    setFormData((prev) => ({ ...prev, contents: newContents }));
    setErrors((prev) => ({ ...prev, [`content-${index}`]: "" }));
  };

  const handleSelectResourceType = (value, index) => {
    const newResources = [...formData.resources];
    newResources[index] = { ...newResources[index], resource_type: value };
    setFormData((prev) => ({ ...prev, resources: newResources }));
    setErrors((prev) => ({ ...prev, [`resource-${index}`]: "" }));
  };

  const handlePositionChange = (e, index, section = "contents") => {
    const { value } = e.target;
    const newItems = [...formData[section]];
    newItems[index] = { ...newItems[index], position: parseInt(value) || 0 };
    setFormData((prev) => ({ ...prev, [section]: newItems }));
    setErrors((prev) => ({ ...prev, [`${section}-${index}`]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.module) newErrors.module = "Module is required";
    if (!formData.position) newErrors.position = "Position is required";

    formData.contents.forEach((content, index) => {
      if (!content.title?.trim()) {
        newErrors[`content-${index}`] = "Content title is required";
      }
      if (!content.duration || parseInt(content.duration) <= 0) {
        newErrors[`content-${index}`] =
          newErrors[`content-${index}`] || "Duration must be a positive number";
      }
      if (content.content_type === "text" && !content.text_content?.trim()) {
        newErrors[`content-${index}`] =
          newErrors[`content-${index}`] || "Text content is required for text type";
      }
      if (content.content_type === "video" && !content.video_id?.trim()) {
        newErrors[`content-${index}`] =
          newErrors[`content-${index}`] || "Video ID is required for video type";
      }
    });

    formData.resources.forEach((resource, index) => {
      if (!resource.title?.trim()) {
        newErrors[`resource-${index}`] = "Resource title is required";
      }
      if (!resource.url?.trim()) {
        newErrors[`resource-${index}`] =
          newErrors[`resource-${index}`] || "Resource URL is required";
      }
      if (!resource.resource_type) {
        newErrors[`resource-${index}`] =
          newErrors[`resource-${index}`] || "Resource type is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const filteredContents = formData.contents
      .filter((c) => {
        if (c.content_type === "text") return c.text_content?.trim() && c.title?.trim();
        if (c.content_type === "video") return c.video_id?.trim() && c.title?.trim();
        return false;
      })
      .map((c) => ({
        content_type: c.content_type,
        title: c.title?.trim() || null,
        video_id: c.content_type === "video" ? c.video_id?.trim() || null : null,
        text_content: c.content_type === "text" ? c.text_content?.trim() || null : null,
        duration: parseInt(c.duration) || 0,
        position: c.position,
      }));

    const filteredResources = formData.resources
      .filter((r) => r.title?.trim() && r.url?.trim() && r.resource_type)
      .map((r) => ({
        title: r.title?.trim() || null,
        url: r.url?.trim() || null,
        description: r.description?.trim() || null,
        resource_type: r.resource_type,
        position: r.position,
      }));

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      contents: filteredContents,
      resources: filteredResources,
      module: formData.module || null,
      position: parseInt(formData.position) || 0,
    };

    console.log("Submitting payload:", payload);
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
          {mode === "add" && (
            <DialogDescription>Create a new lesson with its contents, resources, and assign it to a module.</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Please fix the following errors:
                <ul className="list-disc pl-4">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )} */}

          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Lesson title"
              value={formData.title}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Lesson description"
              value={formData.description}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Contents</Label>
            {formData.contents.map((content, index) => (
              <div key={index} className="space-y-2 border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <Label>Content {index + 1}</Label>
                  {formData.contents.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContent(index)}
                    >
                      <Trash2 size={14} color="red" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`content-title-${index}`}>Content Title</Label>
                  <Input
                    id={`content-title-${index}`}
                    name="title"
                    placeholder="Content title"
                    value={content.title || ""}
                    onChange={(e) => handleChange(e, index, "contents")}
                    required
                  />
                </div>
                <Select
                  value={content.content_type}
                  onValueChange={(value) => handleSelectContentType(value, index)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
                {content.content_type === "video" && (
                  <Input
                    name="video_id"
                    placeholder="YouTube Video ID (11 characters)"
                    value={content.video_id || ""}
                    onChange={(e) => handleChange(e, index, "contents")}
                    required
                  />
                )}
                {content.content_type === "text" && (
                  <Textarea
                    name="text_content"
                    placeholder="Text content"
                    value={content.text_content || ""}
                    onChange={(e) => handleChange(e, index, "contents")}
                    required
                  />
                )}
                <div className="space-y-2">
                  <Label htmlFor={`duration-${index}`}>Duration (minutes)</Label>
                  <Input
                    id={`duration-${index}`}
                    name="duration"
                    type="number"
                    placeholder="Duration in minutes"
                    value={content.duration}
                    onChange={(e) => handleChange(e, index, "contents")}
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`content-position-${index}`}>Content Position</Label>
                  <Input
                    id={`content-position-${index}`}
                    name="position"
                    type="number"
                    placeholder="Content position"
                    value={content.position}
                    onChange={(e) => handlePositionChange(e, index, "contents")}
                    required
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddContent}>
              <Plus size={16} className="mr-1" /> Add Content
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Additional Resources</Label>
            {formData.resources.map((resource, index) => (
              <div key={index} className="space-y-2 border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <Label>Resource {index + 1}</Label>
                  {formData.resources.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveResource(index)}
                    >
                      <Trash2 size={14} color="red" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`resource-title-${index}`}>Resource Title</Label>
                  <Input
                    id={`resource-title-${index}`}
                    name="title"
                    placeholder="Resource title"
                    value={resource.title || ""}
                    onChange={(e) => handleChange(e, index, "resources")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`resource-url-${index}`}>Resource URL</Label>
                  <Input
                    id={`resource-url-${index}`}
                    name="url"
                    placeholder="Resource URL"
                    value={resource.url || ""}
                    onChange={(e) => handleChange(e, index, "resources")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`resource-description-${index}`}>Description</Label>
                  <Textarea
                    id={`resource-description-${index}`}
                    name="description"
                    placeholder="Resource description"
                    value={resource.description || ""}
                    onChange={(e) => handleChange(e, index, "resources")}
                  />
                </div>
                <Select
                  value={resource.resource_type}
                  onValueChange={(value) => handleSelectResourceType(value, index)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <Label htmlFor={`resource-position-${index}`}>Resource Position</Label>
                  <Input
                    id={`resource-position-${index}`}
                    name="position"
                    type="number"
                    placeholder="Resource position"
                    value={resource.position}
                    onChange={(e) => handlePositionChange(e, index, "resources")}
                    required
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddResource}>
              <Plus size={16} className="mr-1" /> Add Resource
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="module">Module</Label>
            <Select
              value={formData.module}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, module: value }))}
              required
            >
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
            <Label htmlFor="position">Lesson Position</Label>
            <Input
              id="position"
              name="position"
              type="number"
              placeholder="Lesson position"
              value={formData.position}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {mode === "edit" ? "Update Lesson" : "Add Lesson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}