// app/learn/layout.jsx
"use client";

import { Suspense } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";
// import { Toaster } from "@/app/components/ui/Sonner"

export default function LearnLayout({ children }) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
              <div className="md:col-span-1">
                <Skeleton className="h-[500px] w-full" />
              </div>
              <div className="md:col-span-3 space-y-6">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            </div>
          </div>
        </div>
      }>
        {children}
      </Suspense>
    </main>
  );
}