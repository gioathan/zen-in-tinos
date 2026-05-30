import Image from "next/image";
import Link from "next/link";
import { getIslandBySlug, getHousesByIslandId } from "@/lib/data/public";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 3600;

type Props = {
  params: Promise<{ islandSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { islandSlug } = await params;
  const island = await getIslandBySlug(islandSlug);
  if (!island) return { title: "Island Not Found" };
  return {
    title: `${island.title} Villas`,
    description: island.subtitle || `Discover our properties in ${island.title}.`,
  };
}

/* Static Tailwind col-span classes */
const colClasses = ["lg:col-span-8", "lg:col-span-4", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];
const heightPattern = [500, 600, 450, 450, 480, 480];

export default async function IslandPage({ params }: Props) {
  const { islandSlug } = await params;

  const island = await getIslandBySlug(islandSlug);
  if (!island) notFound();

  const houses = await getHousesByIslandId(island.id);

  return (
    <div className="bg-[#fdf9f4] min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="pt-24 pb-12 lg:pt-32 lg:pb-20 max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end gap-8">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#00527b] mb-4">
              <Link href="/houses" className="hover:underline">The Villas</Link>
              {" / "}
              {island.title}
            </p>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-tight text-[#1c1c19] mb-5 italic">
              {island.title}
            </h1>
            {island.subtitle && (
              <p className="text-lg lg:text-xl text-[#40484f] font-light leading-tight max-w-lg">
                {island.subtitle}
              </p>
            )}
          </div>
          <div className="hidden md:block w-px self-stretch bg-[#ffdbcd] ml-10 min-h-[80px]" />
        </div>
      </header>

      {/* ── Asymmetric Gallery Grid ───────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        {houses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
            {houses.map((house: any, i: number) => {
              const idx = i % colClasses.length;
              const imgH = heightPattern[idx];

              return (
                <Link
                  key={house.id}
                  href={`/${islandSlug}/${house.slug}`}
                  className={`group cursor-pointer ${colClasses[idx]}`}
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
                    <div className="absolute top-5 left-5 bg-[#fdf9f4]/90 backdrop-blur-sm px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest text-[#1c1c19]">
                      {house.location_area ? `${house.location_area} · ${island.title}` : island.title}
                    </div>
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
              No properties available in {island.title} at the moment.
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
