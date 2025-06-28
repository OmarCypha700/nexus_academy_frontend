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

export default function ModuleForm({
  open,
  onOpenChange,
  onSubmit,
  courseId,
  moduleCount,
}) {
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(1); // Default to 1
  const [loading, setLoading] = useState(false);
  

  // Auto-fill position each time modal opens
  useEffect(() => {
    if (open) {
      setPosition(moduleCount + 1); // pre-fill with next position
      setTitle("");
    }
  }, [open, moduleCount]);

  const handleSubmit = async () => {
    if (!title.trim() || !courseId) return;

    const data = {
      course: courseId,
      title: title.trim(),
      position: position,
    };
    try {
      setLoading(true)
      await axiosInstance.post("/modules/", data);
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
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!title.trim() || loading}
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
