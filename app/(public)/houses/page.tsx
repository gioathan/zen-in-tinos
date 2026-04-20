import Image from "next/image";
import Link from "next/link";
import { getPublishedHouses } from "@/lib/data/public";

export const revalidate = 3600;

export const metadata = {
  title: "The Villas",
  description:
    "Browse our collection of beautiful holiday homes in Tinos, Greece. Traditional stone houses, modern villas, and seaside studios.",
};

/* Static Tailwind col-span classes (must be complete strings for purging) */
const colClasses = [
  "lg:col-span-8",
  "lg:col-span-4",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-6",
  "lg:col-span-6",
];
const colValues = [8, 4, 5, 7, 6, 6];
const heightPattern = [500, 600, 450, 450, 480, 480];
const offsetPattern = ["", "lg:mt-24", "", "lg:-mt-20", "", ""];

export default async function HousesPage() {
  const houses = await getPublishedHouses();

  return (
    <div className="bg-[#fdf9f4] min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="pt-36 pb-12 lg:pt-44 lg:pb-20 max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end gap-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-tight text-[#1c1c19] mb-5">
              The <span className="italic">Villas</span>
            </h1>
            <p className="text-lg lg:text-xl text-[#40484f] font-light leading-tight max-w-lg">
              A collection of architectural gems designed for rest and
              connection.
            </p>
          </div>
          <div className="hidden md:block w-px self-stretch bg-[#ffdbcd] ml-10 min-h-[80px]" />
        </div>
      </header>

      {/* ── Asymmetric Gallery Grid ───────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        {houses && houses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
            {houses.map((house, i) => {
              const idx = i % colClasses.length;
              const col = colValues[idx];
              const imgH = heightPattern[idx];
              const offset = offsetPattern[idx];

              return (
                <Link
                  key={house.id}
                  href={`/houses/${house.slug}`}
                  className={`group cursor-pointer ${colClasses[idx]} ${offset}`}
                >
                  <div
                    className="relative overflow-hidden rounded-sm mb-5 bg-[#e6e2dd]"
                    style={{ height: `${imgH}px` }}
                  >
                    <Image
                      src={house.featured_image_url}
                      alt={house.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 60vw"
                    />
                    {house.location_area && (
                      <div className="absolute top-5 left-5 bg-[#fdf9f4]/90 backdrop-blur-sm px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest text-[#1c1c19]">
                        {house.location_area}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-xl lg:text-2xl text-[#1c1c19]">
                      {house.title}
                    </h3>
                    {house.short_description && (
                      <p className="text-sm text-[#40484f] line-clamp-2">
                        {house.short_description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1 gap-3">
                      <div className="flex gap-3 text-sm text-[#40484f]">
                        <span>{house.bedrooms} Beds</span>
                        <span className="text-[#c0c7d0]">·</span>
                        <span>{house.bathrooms} Baths</span>
                      </div>
                      {house.price_per_night && (
                        <div className="text-right flex-shrink-0">
                          <span className="font-serif text-xl text-[#00527b]">
                            €{house.price_per_night}
                          </span>
                          <span className="text-xs text-[#40484f]"> /night</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#40484f] text-lg">
              No properties available at the moment.
            </p>
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-[#f7f3ee]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#1c1c19] mb-2">
              Can't find what you're looking for?
            </h2>
            <p className="text-[#40484f] text-sm">
              Tell us your preferences and we'll find the perfect match.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-[#00527b] text-white px-8 py-3.5 rounded text-sm font-medium whitespace-nowrap hover:bg-[#1a6b9a] transition-colors flex-shrink-0"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
