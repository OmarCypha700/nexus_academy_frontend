"use client";

import { Plus } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export default function QuizSection() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quizzes</h3>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus size={16} /> Add Quiz
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">No quizzes added yet</p>
          <Button>
            <Plus size={16} className="mr-1" /> Create First Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
