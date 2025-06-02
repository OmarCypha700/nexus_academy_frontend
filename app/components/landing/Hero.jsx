"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="w-full text-center py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Learn Anytime, Anywhere with{" "}
          <span className="text-yellow-300">Nexus Academy</span>
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-200">
          Unlimited access to video lessons and notes for JHS, SHS, and
          Tertiary.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => router.push("/courses")}
          >
            Browse Courses
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full text-black sm:w-auto"
          >
            Become an Instructor
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => router.push("/login")}
          >
            Login / SignUp
          </Button>
        </div>
      </div>
    </section>
  );
}
