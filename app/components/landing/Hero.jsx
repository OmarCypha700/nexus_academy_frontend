"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Reveal from "@/app/components/landing/Reveal";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative w-full overflow-hidden px-4 pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Theme-aware background: soft radial glow + faint grid, no hardcoded colors */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_12%,transparent),transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Learning, reimagined
          </span>
        </Reveal>

        <Reveal delay={75}>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground">
            Learn anytime, anywhere with{" "}
            <span className="text-primary">Nexus Academy</span>
          </h1>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlimited access to expert-led lessons, assignments, and resources — built for
            Junior High, Senior High, and tertiary students.
          </p>
        </Reveal>

        <Reveal delay={225}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="w-full sm:w-auto group"
              onClick={() => router.push("/courses")}
            >
              Browse Courses
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => router.push("/signup/instructor")}
            >
              Become an Instructor
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
