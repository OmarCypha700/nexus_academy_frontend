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
  ];

  return (
    <section className="w-full py-14 bg-gray-50 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">What Students Say</h2>
        <div className="space-y-6">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white shadow-md rounded-2xl p-5">
              <p className="italic text-gray-700 text-sm sm:text-base">“{rev.text}”</p>
              <p className="mt-2 font-semibold text-blue-600 text-sm sm:text-base">— {rev.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}