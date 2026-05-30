import Image from "next/image";
import { getExperiences } from "@/lib/data/public";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Experiences in Tinos",
  description:
    "Discover authentic Cycladic experiences in Tinos, Greece. From local cuisine and cultural tours to island hiking and boat trips – create unforgettable memories.",
  openGraph: {
    title: "Experiences in Tinos",
    description:
      "Discover authentic Cycladic experiences in Tinos, Greece. Local cuisine, cultural tours, island hiking, and more.",
  },
};

export default async function ExperiencesPage() {
  const { categories, experiences } = await getExperiences();

  return (
    <div className="bg-[#fdf9f4] min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="pt-24 pb-16 lg:pt-32 lg:pb-24 max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#1c1c19] leading-tight mb-6">
              Experience the{" "}
              <span className="italic text-[#00527b]">Cyclades</span>
            </h1>
            <p className="text-lg text-[#40484f] font-light max-w-xl leading-relaxed">
              Curated moments that connect you with the authentic soul of Tinos
              — its land, people, and traditions.
            </p>
          </div>
          {/* Category badges */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-3 lg:pb-4">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-4 py-2 rounded-sm border border-[#c0c7d0] text-[#40484f] text-xs font-medium tracking-wide uppercase"
                >
                  {cat.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── Experiences by category ──────────────────────── */}
      {categories?.map((cat, i) => {
        const items =
          experiences?.filter((e) => e.category_id === cat.id) ?? [];
        if (items.length === 0) return null;

        return (
          <section
            key={cat.id}
            className={`py-16 lg:py-20 ${
              i % 2 === 0 ? "bg-[#f7f3ee]" : "bg-[#fdf9f4]"
            }`}
          >
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="font-serif text-3xl lg:text-4xl text-[#1c1c19]">
                  {cat.label}
                </h2>
                <span className="flex-1 h-px bg-[#c0c7d0]/50 hidden sm:block" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {items.map((exp) => (
                  <div
                    key={exp.id}
                    className="group bg-white rounded-sm overflow-hidden shadow-[0_4px_20px_rgba(28,28,25,0.06)] hover:shadow-[0_8px_32px_rgba(28,28,25,0.10)] transition-all duration-500"
                  >
                    {exp.image_url ? (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={exp.image_url}
                          alt={exp.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-52 bg-[#f1ede8]" />
                    )}
                    <div className="p-6">
                      <h3 className="font-serif text-xl text-[#1c1c19] mb-2">
                        {exp.title}
                      </h3>
                      {exp.description && (
                        <p className="text-[#40484f] text-sm leading-relaxed line-clamp-3">
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

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#f1ede8]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl text-[#1c1c19] mb-5">
            Ready to craft your Tinos story?
          </h2>
          <p className="text-[#40484f] max-w-xl mx-auto mb-10 leading-relaxed">
            Tell us what moves you and we'll build the perfect experience around
            your stay.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#00527b] text-white px-10 py-4 rounded text-sm font-medium tracking-widest uppercase hover:bg-[#1a6b9a] transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
