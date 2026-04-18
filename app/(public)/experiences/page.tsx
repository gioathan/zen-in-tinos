import Image from "next/image";
import { getExperiences } from "@/lib/data/public";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Experiences in Tinos",
  description: "Discover authentic Cycladic experiences in Tinos, Greece. From local cuisine and cultural tours to island hiking and boat trips – create unforgettable memories.",
  openGraph: {
    title: "Experiences in Tinos",
    description: "Discover authentic Cycladic experiences in Tinos, Greece. Local cuisine, cultural tours, island hiking, and more.",
  },
};

export default async function ExperiencesPage() {
  const { categories, experiences } = await getExperiences();

  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-[#1A6B9A] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Experience the Cyclades
          </h1>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories?.map((cat) => (
              <span
                key={cat.id}
                className="px-5 py-2 rounded-full border border-white/40 text-white/90 text-sm"
              >
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences grouped by category */}
      {categories?.map((cat, i) => {
        const items = experiences?.filter((e) => e.category_id === cat.id) ?? [];
        if (items.length === 0) return null;

        return (
          <section
            key={cat.id}
            className={`py-16 ${i % 2 === 0 ? "bg-[#F7F3EE]" : "bg-white"}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-[#1A6B9A] mb-10">{cat.label}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all group"
                  >
                    {exp.image_url && (
                      <div className="relative h-52">
                        <Image
                          src={exp.image_url}
                          alt={exp.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#1A6B9A] mb-2 group-hover:text-[#C4704A] transition">
                        {exp.title}
                      </h3>
                      {exp.description && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
