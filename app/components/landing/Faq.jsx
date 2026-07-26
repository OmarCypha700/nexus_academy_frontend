"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/app/components/ui/accordion";
import Section from "@/app/components/landing/Section";
import Reveal from "@/app/components/landing/Reveal";

export default function FAQ() {
  return (
    <Section containerClassName="max-w-3xl" id="faq">
      <Reveal as="div" className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Frequently asked questions
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Nexus Academy?</AccordionTrigger>
            <AccordionContent>
              Nexus Academy is an online learning platform offering courses for Junior High, Senior High, and tertiary students with content created by experienced instructors.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How do I enroll in a course?</AccordionTrigger>
            <AccordionContent>
              Browse the available courses, click on your preferred course, and subscribe to get access to all lessons, assignments, and quizzes.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Can I access the content on mobile?</AccordionTrigger>
            <AccordionContent>
              Yes! Nexus Academy is fully responsive and optimized for all devices including smartphones and tablets.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Are the videos free?</AccordionTrigger>
            <AccordionContent>
              Some introductory content is available for free. To access full course materials and videos, a subscription is required.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Reveal>
    </Section>
  );
}
