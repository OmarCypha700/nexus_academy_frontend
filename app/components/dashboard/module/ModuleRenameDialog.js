"use client";

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

export default function ModuleRenameDialog({
  open,
  onOpenChange,
  moduleData,          // { id, title }
  onSubmit,            // (newTitle) => void
}) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(moduleData?.title || "");
  }, [moduleData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Module</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <Label htmlFor="moduleTitle">Module Title</Label>
          <Input
            id="moduleTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new title"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!title.trim()}
            onClick={() => {
              onSubmit(title.trim());
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
