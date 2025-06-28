"use client";

import { Pencil, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/app/components/ui/accordion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

export default function LessonList({
  modules,
  onAddLesson,
  onAddLessonToModule,
  onEditLesson,
  onDeleteLesson,
  onRenameModule,
  onReorderModule,
  setAddModuleOpen,
  onDeleteModule = { onDeleteModule },
}) {
  const hasLessons = modules?.some((mod) => mod.lessons?.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Lessons</h3>
        <div className="flex gap-2">
          {modules.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              You must add at least one module before creating lessons.
            </p>
          )}
          {/* <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onAddLesson}
            disabled={modules.length === 0}
          >
            <Plus size={16} /> Add Lesson
          </Button> */}

          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setAddModuleOpen(true)}
          >
            <Plus size={16} /> New Module
          </Button>
        </div>
      </div>

      {hasLessons ? (
        <div className="space-y-6">
          {modules.map((module, index) => (
            <div key={module.id} className="space-y-2">
              {/* === Module Header === */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-md">{module.title}</h4>
                  <Badge variant="secondary">
                    {module.lessons.length} lessons
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    title="Add lesson to this module"
                    onClick={() => onAddLessonToModule(module.id)}
                  >
                    <Plus size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    title="Rename module"
                    onClick={() => onRenameModule(module)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    title="Delete module"
                    onClick={() => onDeleteModule(module.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    title="Move up"
                    onClick={() => onReorderModule(module.id, "up")}
                  >
                    <ArrowUp size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === modules.length - 1}
                    title="Move down"
                    onClick={() => onReorderModule(module.id, "down")}
                  >
                    <ArrowDown size={14} />
                  </Button>
                </div>
              </div>

              {/* === Lessons Accordion === */}
              <Accordion type="multiple">
                {module.lessons.map((lesson) => (
                  <AccordionItem key={lesson.id} value={`lesson-${lesson.id}`}>
                    <AccordionTrigger className="hover:bg-accent px-3 rounded-md">
                      {lesson.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-3">
                      <p className="text-sm text-muted-foreground mb-2">
                        {lesson.description || "No description provided."}
                      </p>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditLesson(lesson)}
                        >
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteLesson(lesson.id)}
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No lessons added yet</p>
            {modules.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              You must add at least one module before creating lessons.
            </p>
          )}
            <Button 
            onClick={onAddLesson}
            disabled={modules.length === 0}
            >
              <Plus size={16} className="mr-1" /> Create First Lesson
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
