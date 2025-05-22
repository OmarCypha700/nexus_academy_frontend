import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import axiosInstance from "@/app/lib/axios";

export default function ModuleForm({ open, onOpenChange, onSubmit, course, moduleCount }) {
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(1); // Default to 1

  // Auto-fill position each time modal opens
  useEffect(() => {
    if (open) {
      setPosition(moduleCount + 1); // pre-fill with next position
      setTitle("");
    }
  }, [open, moduleCount]);

  const handleSubmit = async () => {
    if (!title.trim() || !course) return;

    const data = {
      title: title.trim(),
      position: Number(position),
      course,
    };

    try {
      const response = await axiosInstance.post("/modules/", data);
      onSubmit(response.data);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create module:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Module</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <Label htmlFor="moduleTitle">Module Title</Label>
          <Input
            id="moduleTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Introduction"
          />

          <Label htmlFor="modulePosition">Module Position</Label>
          <Input
            id="modulePosition"
            type="number"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            // placeholder="e.g. 1"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
