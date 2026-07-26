import Link from "next/link";
import { GraduationCap, School, BookOpen, Briefcase, ArrowUpRight } from "lucide-react";
import Section from "@/app/components/landing/Section";
import Reveal from "@/app/components/landing/Reveal";

const categories = [
  { name: "JHS Courses", query: "JHS", icon: BookOpen },
  { name: "SHS Courses", query: "SHS", icon: School },
  { name: "Tertiary Courses", query: "Tertiary", icon: GraduationCap },
  { name: "Professional Skills", query: "Professional", icon: Briefcase },
];

export default function Categories() {
  return (
    <Section className="bg-muted/30">
      <Reveal as="div" className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Explore categories
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Reveal key={cat.name} delay={i * 75}>
              <Link
                href={`/courses?q=${encodeURIComponent(cat.query)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-6 text-center transition-colors hover:border-primary/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm sm:text-base font-medium text-foreground">
                  {cat.name}
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
