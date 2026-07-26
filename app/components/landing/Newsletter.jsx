import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Section from "@/app/components/landing/Section";
import Reveal from "@/app/components/landing/Reveal";

export default function Newsletter() {
  return (
    <Section containerClassName="max-w-2xl">
      <Reveal>
        <div className="rounded-3xl border border-border bg-card px-6 py-12 sm:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Subscribe for updates
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Get notified when new courses drop.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Input type="email" placeholder="Enter your email" className="w-full" />
            <Button className="w-full sm:w-auto" type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </Reveal>
    </Section>
  );
}
