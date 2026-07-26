import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import Section from "@/app/components/landing/Section";
import Reveal from "@/app/components/landing/Reveal";

const reviews = [
  {
    name: "Sarah O.",
    text: "Nexus Academy helped me pass my SHS exams. The videos are easy to follow and well explained.",
  },
  {
    name: "Kwame A.",
    text: "I use Nexus Academy to supplement my university studies. Great platform!",
  },
  {
    name: "Appiah K.",
    text: "Nexus Academy helped me pass my SHS exams. The videos are easy to follow and well explained.",
  },
  {
    name: "Yeboah J.",
    text: "I use Nexus Academy to supplement my university studies. Great platform!",
  },
];

function initialsFor(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export default function Testimonials() {
  return (
    <Section className="bg-muted/30" containerClassName="max-w-3xl">
      <Reveal as="div" className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          What students say
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews.map((rev, i) => (
              <CarouselItem key={i} className="pl-2">
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <p className="text-foreground text-sm sm:text-base">“{rev.text}”</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {initialsFor(rev.name)}
                    </div>
                    <p className="font-medium text-sm text-foreground">{rev.name}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Reveal>
    </Section>
  );
}
