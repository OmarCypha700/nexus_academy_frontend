import { Video, Users, CreditCard } from "lucide-react";
import Section from "@/app/components/landing/Section";
import Reveal from "@/app/components/landing/Reveal";

const features = [
  { icon: Video, title: "Video-Based Learning", desc: "HD video lessons from top educators, available on demand." },
  { icon: Users, title: "Expert Instructors", desc: "Learn from vetted professionals and experienced teachers." },
  { icon: CreditCard, title: "Affordable Plans", desc: "Flexible pricing built around student budgets." },
];

export default function Features() {
  return (
    <Section>
      <Reveal as="div" className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Why choose Nexus Academy?
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.title} delay={i * 100}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{f.desc}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
