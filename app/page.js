import Hero from "@/app/components/landing/Hero";
import Features from "@/app/components/landing/Features";
import Categories from "@/app/components/landing/Categories";
import Testimonials from "@/app/components/landing/Testimonials";
import Faq from "@/app/components/landing/Faq";
import Newsletter from "@/app/components/landing/Newsletter";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      {/* <Categories /> */}
      <Testimonials />
      <Faq />
      <Newsletter />
    </main>
  );
}