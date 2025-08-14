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

  return (
    <section className="w-full py-14 bg-gray-50 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
          What Students Say
        </h2>
        <Carousel
          // orientation="vertical"
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
