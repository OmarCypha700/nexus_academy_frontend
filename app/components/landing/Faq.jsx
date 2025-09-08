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
              What is Young Coders?
            </AccordionTrigger>
            <AccordionContent>
              Young Coders is a Ghana-based online learning platform that trains kids, teenagers, and young adults in coding, IT, and technology. Our goal is to prepare the next generation with digital skills for the future.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              How do I enroll in a course?
            </AccordionTrigger>
            <AccordionContent>
              Simply browse our available courses, choose the one you like, and subscribe. Once enrolled, you’ll get full access to lessons, coding exercises, projects, and quizzes.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Can I learn on my phone or tablet?
            </AccordionTrigger>
            <AccordionContent>
              Yes! Young Coders is fully mobile-friendly. You can learn and practice coding on your smartphone, tablet, or computer anytime, anywhere.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Are the courses free?
            </AccordionTrigger>
            <AccordionContent>
              We offer some free introductory courses to help you get started. To unlock full access to advanced lessons, projects, and mentorship, you will need a subscription.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              Do I need prior coding experience?
            </AccordionTrigger>
            <AccordionContent>
              Not at all! Young Coders is designed for all levels. Beginners can start with the basics, while more advanced learners can take specialized courses in web development, app design, and more.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </section>
  );
}
