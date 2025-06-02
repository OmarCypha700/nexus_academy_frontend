"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/app/components/ui/accordion";


export default function FAQ() {
  return (
    <section className="py-10 px-4 md:px-8 bg-white" id="faq">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What is Nexus Academy?
            </AccordionTrigger>
            <AccordionContent>
              Nexus Academy is an online learning platform offering courses for Junior High, Senior High, and tertiary students with content created by experienced instructors.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              How do I enroll in a course?
            </AccordionTrigger>
            <AccordionContent>
              Browse the available courses, click on your preferred course, and subscribe to get access to all lessons, assignments, and quizzes.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Can I access the content on mobile?
            </AccordionTrigger>
            <AccordionContent>
              Yes! Nexus Academy is fully responsive and optimized for all devices including smartphones and tablets.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Are the videos free?
            </AccordionTrigger>
            <AccordionContent>
              Some introductory content is available for free. To access full course materials and videos, a subscription is required.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
