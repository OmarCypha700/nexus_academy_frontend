"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { useState, useEffect } from "react";

export default function CourseOutcomeDialog({
  open,
  onOpenChange,
  courseId,
  onSubmit,
  error,
  success,
  initialData = [],
}) {
  const [outcomes, setOutcomes] = useState([{ text: "", position: 1 }]);

  useEffect(() => {
    if (initialData?.length) {
      setOutcomes(initialData);
    } else {
      setOutcomes([{ text: "", position: 1 }]);
    }
  }, [initialData, open]);

  const handleChange = (index, field, value) => {
    setOutcomes((prev) =>
      prev.map((o, i) =>
        i === index
          ? { ...o, [field]: field === "position" ? Number(value) : value }
          : o
      )
    );
  };

  const addOutcome = () => {
    setOutcomes((prev) => [
      ...prev,
      { text: "", position: prev.length + 1 },
    ]);
  };

  const removeOutcome = (index) => {
    setOutcomes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      course: courseId,
      outcomes,
    };
    console.log(payload)
    onSubmit(payload);
    // onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Course Outcomes</DialogTitle>
        </DialogHeader>

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

          {outcomes.map((outcome, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 space-y-2 relative bg-muted/30"
            >
              <div className="flex flex-col gap-2">
                <Label>Outcome Text</Label>
                <Input
                  placeholder="Enter outcome text"
                  value={outcome.text}
                  onChange={(e) =>
                    handleChange(index, "text", e.target.value)
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Position</Label>
                <Input
                  type="number"
                  placeholder="Enter position"
                  value={outcome.position}
                  onChange={(e) =>
                    handleChange(index, "position", e.target.value)
                  }
                  min={1}
                  required
                />
              </div>

              {outcomes.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeOutcome(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addOutcome}
            className="w-full"
          >
            Add Another Outcome
          </Button>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Outcomes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
