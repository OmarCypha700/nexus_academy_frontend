// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/app/components/ui/dialog";
// import { Input } from "@/app/components/ui/input";
// import { Button } from "@/app/components/ui/button";
// import { Label } from "@/app/components/ui/label";

// export default function ModuleRenameDialog({
//   open,
//   onOpenChange,
//   moduleData,          // { id, title }
//   onSubmit,            // (newTitle) => void
// }) {
//   const [title, setTitle] = useState("");

//   useEffect(() => {
//     setTitle(moduleData?.title || "");
//   }, [moduleData]);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Rename Module</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-3 mt-2">
//           <Label htmlFor="moduleTitle">Module Title</Label>
//           <Input
//             id="moduleTitle"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter new title"
//           />
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button
//             disabled={!title.trim()}
//             onClick={() => {
//               onSubmit(title.trim());
//               onOpenChange(false);
//             }}
//           >
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import axiosInstance from "@/app/lib/axios";
import { toast } from "react-hot-toast";

export default function ModuleRenameDialog({
  open,
  onOpenChange,
  moduleData,          // { id, title }
  onSubmitSuccess,
  courseId,
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(moduleData?.title || "");
  }, [moduleData]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const data = {
      course: courseId,
      title: title.trim(),
      position: moduleData.position,
    };

    try {
      setLoading(true);
      await axiosInstance.put(`/modules/${moduleData.id}/`, data);
      toast.success("Module renamed successfully!");
      onOpenChange(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to rename module");
    } finally {
      setLoading(false);
    }
  };

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
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
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
