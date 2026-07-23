"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileDown, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Badge } from "@/app/components/ui/badge";
import {
  previewAikenImport,
  commitAikenImport,
  exportQuizAiken,
  exportCourseAiken,
  downloadAikenTemplate,
  extractErrorMessage,
} from "@/app/lib/aiken";
import AikenImportPreviewTable from "./AikenImportPreviewTable";

/**
 * Import/Export/Template UI for quiz questions, in Extended-Aiken format.
 *
 * mode="quiz": all three tabs, scoped to one quiz (import always targets a single quiz).
 * mode="course": Export + Template only (a whole-course bundle of every quiz's questions).
 */
export default function AikenImportExportDialog({
  quiz,
  courseId,
  mode = "quiz",
  open,
  onOpenChange,
  onImported,
}) {
  const [tab, setTab] = useState(mode === "quiz" ? "import" : "export");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(null); // { total, valid_count, error_count, rows }
  const [isCommitting, setIsCommitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTemplating, setIsTemplating] = useState(false);
  const fileInputRef = useRef(null);

  const resetImportState = () => {
    setFileName(null);
    setPreview(null);
    setUploadProgress(0);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setPreview(null);
    setIsParsing(true);
    setUploadProgress(0);
    try {
      const data = await previewAikenImport(quiz.id, file, (evt) => {
        if (evt.total) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
      });
      setPreview(data);
    } catch (err) {
      toast.error(await extractErrorMessage(err, "Failed to parse the file."));
      resetImportState();
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleConfirmImport = async () => {
    if (!preview) return;
    const validRows = preview.rows.filter((r) => r.status === "valid");
    if (validRows.length === 0) return;
    setIsCommitting(true);
    try {
      const data = await commitAikenImport(
        quiz.id,
        validRows.map((r) => ({
          text: r.text,
          question_type: r.question_type,
          choices: r.choices,
          correct_answer: r.correct_answer,
          points: r.points,
          explanation: r.explanation,
        }))
      );
      toast.success(data.detail || "Questions imported.");
      resetImportState();
      onImported?.();
    } catch (err) {
      toast.error(await extractErrorMessage(err, "Import failed."));
    } finally {
      setIsCommitting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (mode === "course") {
        await exportCourseAiken(courseId);
      } else {
        await exportQuizAiken(quiz.id);
      }
      toast.success("Download started.");
    } catch (err) {
      toast.error(await extractErrorMessage(err, "Export failed."));
    } finally {
      setIsExporting(false);
    }
  };

  const handleTemplate = async () => {
    setIsTemplating(true);
    try {
      await downloadAikenTemplate();
      toast.success("Template downloaded.");
    } catch (err) {
      toast.error(await extractErrorMessage(err, "Could not download the template."));
    } finally {
      setIsTemplating(false);
    }
  };

  const validCount = preview?.valid_count ?? 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetImportState();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "course" ? "Course Questions" : `Questions — ${quiz?.title ?? ""}`}
          </DialogTitle>
          <DialogDescription>
            Import, export, or download a template in Aiken format.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            {mode === "quiz" && <TabsTrigger value="import">Import</TabsTrigger>}
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>

          {mode === "quiz" && (
            <TabsContent value="import" className="space-y-4">
              {!preview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-primary bg-muted"
                      : "border-muted-foreground/30 bg-muted/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  <UploadCloud className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Drag &amp; drop your .txt file, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aiken format — see the Template tab for the expected layout
                  </p>
                  {isParsing && (
                    <div className="mt-4 space-y-1">
                      <Progress value={uploadProgress} />
                      <p className="text-xs text-muted-foreground">Parsing {fileName}…</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className="bg-green-600 hover:bg-green-600 text-white border-transparent">
                        {preview.valid_count} valid
                      </Badge>
                      {preview.error_count > 0 && (
                        <Badge variant="destructive">{preview.error_count} with errors</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={resetImportState}>
                      Choose a different file
                    </Button>
                  </div>

                  {validCount === 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        No valid questions found in this file — fix the errors below and try
                        again.
                      </AlertDescription>
                    </Alert>
                  )}

                  <AikenImportPreviewTable rows={preview.rows} />

                  <p className="text-xs text-muted-foreground">
                    Nothing is saved until you confirm below.
                  </p>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleConfirmImport}
                      disabled={validCount === 0 || isCommitting}
                    >
                      {isCommitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm Import ({validCount} question{validCount === 1 ? "" : "s"})
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          )}

          <TabsContent value="export" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {mode === "course"
                ? "Download every quiz's questions in this course as one Aiken file."
                : "Download this quiz's questions as an Aiken file."}
            </p>
            <Button onClick={handleExport} disabled={isExporting} className="gap-2">
              <FileDown className="h-4 w-4" />
              {mode === "course" ? "Download All Questions" : "Download Aiken File"}
            </Button>
          </TabsContent>

          <TabsContent value="template" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A starter file with one worked example of every supported question type, plus
              an explanation of the format — a good starting point for new instructors.
            </p>
            <Button
              onClick={handleTemplate}
              disabled={isTemplating}
              variant="outline"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Download Template
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
