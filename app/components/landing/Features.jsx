import { Book, Video, Users, CreditCard } from "lucide-react";

const features = [
  { icon: <Video className="w-6 h-6" />, title: "Video-Based Learning", desc: "HD video lessons from top educators." },
  // { icon: <Book className="w-6 h-6" />, title: "Downloadable Notes", desc: "Access detailed notes anywhere." },
  { icon: <Users className="w-6 h-6" />, title: "Expert Instructors", desc: "Top professionals and teachers." },
  { icon: <CreditCard className="w-6 h-6" />, title: "Affordable Plans", desc: "Flexible pricing for students." },
];

export default function Features() {
  return (
    <section className="w-full py-14 bg-gray-100 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-10">Why Choose Nexus Academy?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-5 sm:p-6">
              <div className="text-black mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}