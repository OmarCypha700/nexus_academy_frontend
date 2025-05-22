"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import LessonList from "@/app/components/dashboard/lesson/LessonList";
import AssignmentSection from "@/app/components/dashboard/assignment/AssignmentSection";
import QuizSection from "@/app/components/dashboard/quiz/QuizSection";

export default function CourseDetails({
  course,
  onEditCourse,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onRenameModule,
  onReorderModule,
  onClose,
  setSelectedModule,
  onDeleteModule,
  setAddModuleOpen,
  // selectedModule,
}) {
  if (!course) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <Button
          variant="outline"
          onClick={() => onEditCourse(course)}
          className="gap-1"
        >
          <Pencil size={16} /> Edit Course
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-medium">Description</h3>
        <p className="text-muted-foreground mt-1">{course.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${course.price}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={course.is_published ? "success" : "secondary"}>
              {course.is_published ? "Published" : "Draft"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Tabs defaultValue="lessons">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <LessonList
            modules={course.modules}
            onAddLesson={onAddLesson}
            onAddLessonToModule={(moduleId) => {
              setSelectedModule(moduleId.toString());
              onAddLesson();
            }}
            onEditLesson={onEditLesson}
            onDeleteLesson={onDeleteLesson}
            onRenameModule={onRenameModule}
            onReorderModule={onReorderModule}
            onDeleteModule={onDeleteModule}
            setAddModuleOpen={setAddModuleOpen}
          />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentSection />
        </TabsContent>

        <TabsContent value="quizzes">
          <QuizSection />
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {/* Optional Save Changes button if needed */}
      </div>
    </div>
  );
}
