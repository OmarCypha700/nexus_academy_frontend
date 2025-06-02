export default function Categories() {
  const categories = [
    "JHS Courses",
    "SHS Courses",
    "Tertiary Courses",
    "Professional Skills",
  ];
  return (
    <section className="w-full py-14 bg-white px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
          Explore Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium text-sm sm:text-base py-3 sm:py-4 rounded-xl transition"
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
