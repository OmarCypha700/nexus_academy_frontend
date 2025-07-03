"use client";

import { Pencil, BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

export default function CourseCard({
  course,
  onEdit,
  onDelete,
  onViewDetails,
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(course)}
              title="Course Details"
            >
              <BookOpen size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(course)}
              title="Edit Course"
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(course.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              title="Delete Course"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="pt-2 flex justify-between">
        {course.price == 0 ? (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Free
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            ${course.price}
          </Badge>
        )}

        {course.is_published == true ? (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Published
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-gray-300 text-muted-foreground border-gray-200"
          >
            Draft
          </Badge>
        )}

         {course.total_lessons > 0 ? (
          <Badge
            variant="outline"
            className="text-muted-foreground"
          >
            {course.total_lessons} lessons
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-muted-foreground"
          >
            No lessons
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
