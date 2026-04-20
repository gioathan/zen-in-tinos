import Image from "next/image";
import Link from "next/link";
import { getFeaturedHouses, getFeaturedServices } from "@/lib/data/public";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Holiday Homes in Tinos, Greece",
  description:
    "Handpicked holiday homes in Tinos, Greece. Authentic Cycladic stays with stunning views, modern amenities, and personalised concierge service.",
  openGraph: {
    title: "Holiday Homes in Tinos, Greece",
    description:
      "Handpicked holiday homes in Tinos, Greece. Authentic Cycladic stays with stunning views and personalised service.",
    images: [
      {
        url: "/homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Zen in Tinos – Holiday Homes in the Cyclades",
      },
    ],
  },
};

export default async function HomePage() {
  const [houses, services] = await Promise.all([
    getFeaturedHouses(),
    getFeaturedServices(),
  ]);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Zen in Tinos",
    url: process.env.NEXT_PUBLIC_DOMAIN,
    description:
      "Handpicked holiday homes in Tinos, Greece. Traditional stone houses, modern villas, and seaside studios.",
    image: `${process.env.NEXT_PUBLIC_DOMAIN}/homepage.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tinos",
      addressRegion: "South Aegean",
      addressCountry: "GR",
    },
    areaServed: "Tinos, Cyclades, Greece",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="relative h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/homepage.jpg"
            alt="Tinos Greece"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#1c1c19]/25" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl text-white leading-tight mb-6 lg:mb-8">
              Where the <span className="italic">Cyclades</span> Become Your
              Home
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/85 font-light mb-10 lg:mb-12 tracking-wide max-w-xl">
              Handpicked homes, authentic stays, and effortless island living.
            </p>
            <div className="flex flex-wrap items-center gap-5 lg:gap-6">
              <Link
                href="/houses"
                className="bg-[#00527b] text-white px-8 py-4 rounded text-base font-semibold shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Explore Homes
              </Link>
              <div className="hidden sm:block w-px h-10 bg-[#ffdbcd]" />
              <span className="text-white/80 font-medium tracking-[0.25em] text-xs uppercase">
                Tinos Island
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Featured Properties ───────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#fdf9f4]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 lg:mb-20 gap-6">
            <div>
              <h2 className="font-serif text-4xl lg:text-5xl text-[#1c1c19] mb-4">
                The Sculpted Collection
              </h2>
              <p className="text-[#40484f] max-w-md leading-relaxed">
                Each residence is selected for its architectural integrity and
                soul, offering a dialogue between ancient stone and modern
                comfort.
              </p>
            </div>
            <Link
              href="/houses"
              className="flex items-center gap-2 text-[#00527b] font-semibold text-sm hover:gap-3 transition-all"
            >
              View All Properties
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {houses?.slice(0, 2).map((house, i) => (
              <Link
                key={house.id}
                href={`/houses/${house.slug}`}
                className={`group cursor-pointer ${i === 1 ? "md:mt-16 lg:mt-24" : ""}`}
              >
                <div className="relative overflow-hidden rounded-sm mb-6 lg:mb-8 aspect-[4/3] bg-[#e6e2dd]">
                  <Image
                    src={house.featured_image_url}
                    alt={house.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {house.is_featured && (
                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-sm text-[10px] font-bold tracking-widest text-[#00527b] uppercase">
                      Featured
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-serif text-2xl lg:text-3xl text-[#1c1c19] mb-2">
                      {house.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-[#40484f] text-sm font-medium uppercase tracking-tight">
                      <span>{house.bedrooms} Beds</span>
                      <span className="text-[#c0c7d0]">·</span>
                      <span>{house.bathrooms} Baths</span>
                      <span className="text-[#c0c7d0]">·</span>
                      <span>{house.capacity} Guests</span>
                    </div>
                  </div>
                  {house.price_per_night && (
                    <div className="text-right flex-shrink-0">
                      <span className="block font-serif text-2xl text-[#00527b]">
                        €{house.price_per_night}
                      </span>
                      <span className="text-[10px] text-[#40484f] tracking-widest uppercase">
                        per night
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Preview ─────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#f7f3ee]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center text-center mb-16 lg:mb-24">
            <span className="text-[#00527b] font-bold tracking-[0.3em] uppercase text-xs mb-4">
              Elevated Living
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl text-[#1c1c19] max-w-2xl leading-tight">
              Effortless hospitality designed around your peace.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services?.slice(0, 3).map((service, i) => (
              <div
                key={service.id}
                className={`bg-white p-8 lg:p-12 rounded-sm shadow-[0_20px_40px_rgba(28,28,25,0.05)] hover:-translate-y-1 transition-all duration-300 ${
                  i === 1 ? "sm:mt-8" : ""
                }`}
              >
                {service.image_url ? (
                  <div className="relative w-12 h-12 mb-8 rounded overflow-hidden">
                    <Image
                      src={service.image_url}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 mb-8 rounded-sm bg-[#f1ede8] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#00527b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                )}
                <h4 className="text-lg font-semibold text-[#1c1c19] mb-3">
                  {service.title}
                </h4>
                <p className="text-[#40484f] leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[#00527b] font-semibold text-sm hover:gap-3 transition-all"
            >
              All Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-28 lg:py-36 bg-[#00527b]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white mb-10 leading-tight">
            Ready to Book Your Stay?
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#00527b] px-10 py-4 rounded text-lg font-bold hover:bg-[#f7f3ee] transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
