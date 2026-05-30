import Image from "next/image";
import Link from "next/link";
import { getIslandsWithPreview } from "@/lib/data/public";

export const revalidate = 3600;

export const metadata = {
  title: "The Villas",
  description:
    "Browse our collection of beautiful holiday homes across the Cyclades. Traditional stone houses, modern villas, and seaside studios.",
};

export default async function HousesPage() {
  const islands = await getIslandsWithPreview();

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

      {/* ── Islands ──────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        {islands.length > 0 ? (
          <div className="space-y-24 lg:space-y-32">
            {islands.map((island: any, i: number) => (
              <div key={island.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-last" : ""}`}>
                {/* Island image / preview house image */}
                <div className="relative overflow-hidden rounded-sm bg-[#e6e2dd]" style={{ height: 520 }}>
                  {island.previewHouse?.featured_image_url ? (
                    <Link href={`/${island.slug}/${island.previewHouse.slug}`}>
                      <Image
                        src={island.previewHouse.featured_image_url}
                        alt={island.previewHouse.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </Link>
                  ) : (
                    <div className="w-full h-full bg-[#e6e2dd]" />
                  )}
                  {island.previewHouse && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1c1c19]/80 to-transparent">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffdbcd] mb-1">
                        Featured property
                      </p>
                      <h3 className="font-serif text-xl text-white">
                        {island.previewHouse.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-white/70">
                        <span>{island.previewHouse.bedrooms} Beds</span>
                        <span className="opacity-50">·</span>
                        <span>{island.previewHouse.bathrooms} Baths</span>
                        {island.previewHouse.price_per_night && (
                          <>
                            <span className="opacity-50">·</span>
                            <span className="font-serif text-[#ffdbcd]">€{island.previewHouse.price_per_night}/night</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Island info */}
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#00527b] mb-4">
                    Cyclades
                  </p>
                  <h2 className="font-serif text-5xl lg:text-6xl text-[#1c1c19] mb-5 italic">
                    {island.title}
                  </h2>
                  {island.subtitle && (
                    <p className="text-lg text-[#40484f] font-light leading-relaxed mb-8 max-w-md">
                      {island.subtitle}
                    </p>
                  )}
                  <p className="text-sm text-[#40484f] mb-8">
                    {island.houseCount === 0
                      ? "Coming soon"
                      : island.houseCount === 1
                      ? "1 property available"
                      : `${island.houseCount} properties available`}
                  </p>
                  {island.houseCount > 0 && (
                    <Link
                      href={`/${island.slug}`}
                      className="self-start bg-[#00527b] text-white px-8 py-3.5 rounded text-sm font-medium hover:bg-[#1a6b9a] transition-colors"
                    >
                      Explore {island.title}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#40484f] text-lg">
              No destinations available at the moment.
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
