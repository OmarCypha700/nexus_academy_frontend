import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";

export default function Testimonials() {
  const reviews = [
    {
      name: "Ama K.",
      text: "Young Coders made learning coding fun and simple. I can now build my own websites as a JHS student.",
    },
    {
      name: "Kwame A.",
      text: "Thanks to Young Coders, I discovered my passion for technology. The lessons are clear and very practical.",
    },
    {
      name: "Efua M.",
      text: "I had no coding background, but Young Coders helped me start from scratch. Now I’m creating small apps with confidence.",
    },
    {
      name: "Yaw J.",
      text: "The platform is easy to use, and I love that I can learn on my phone. Young Coders is preparing me for a tech career in Ghana.",
    },
  ];

  return (
    <section className="w-full py-14 bg-gray-50 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
          What Our Learners Say
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews.map((rev, i) => (
              <CarouselItem key={i} className="pl-2">
                <div className="bg-white shadow-md rounded-2xl p-5 h-full">
                  <p className="italic text-gray-700 text-sm sm:text-base">
                    “{rev.text}”
                  </p>
                  <p className="mt-2 font-semibold text-blue-600 text-sm sm:text-base">
                    — {rev.name}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
