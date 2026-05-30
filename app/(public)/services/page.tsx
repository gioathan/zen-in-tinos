import Image from "next/image";
import Link from "next/link";
import { getActiveServices } from "@/lib/data/public";

export const revalidate = 3600;

export const metadata = {
  title: "Our Services",
  description:
    "Discover the services we offer to make your stay in Tinos unforgettable. Airport transfers, concierge, cleaning, and 24/7 support.",
};

const bentoCol = [
  "md:col-span-8",
  "md:col-span-4",
  "md:col-span-5",
  "md:col-span-7",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

const bentoAspect = [
  "md:aspect-[16/9]",
  "md:aspect-[4/5]",
  "md:aspect-square",
  "md:aspect-[16/9]",
  "md:aspect-[4/3]",
  "md:aspect-[4/3]",
  "md:aspect-[4/3]",
];

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <div className="bg-[#fdf9f4] min-h-screen">
      {/* ── Hero ──────────────────────────────── */}
      <header className="pt-24 pb-16 lg:pt-32 lg:pb-24 max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#1c1c19] leading-tight mb-6">
              Our Curated{" "}
              <span className="italic text-[#00527b]">Services</span>
            </h1>
            <p className="text-lg text-[#40484f] font-light max-w-xl leading-relaxed">
              From the moment you arrive until your departure, we ensure every
              detail of your stay is perfect.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-sm tracking-widest uppercase text-[#707880] pb-4">
            <span>Crafted Luxury</span>
            <span className="w-12 h-px bg-[#c0c7d0]" />
            <span>Island Soul</span>
          </div>
        </div>
      </header>

      {/* ── Bento Grid ────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <div
                key={service.id}
                className={`group relative overflow-hidden rounded-sm bg-[#f1ede8] transition-all duration-500 hover:shadow-lg ${bentoCol[Math.min(i, bentoCol.length - 1)]}`}
              >
                {service.image_url && (
                  <div className={`relative overflow-hidden h-48 md:h-auto ${bentoAspect[Math.min(i, bentoAspect.length - 1)]}`}>
                    <Image
                      src={service.image_url}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                    />
                  </div>
                )}
                <div className={`p-5 sm:p-8 ${i === 0 ? "lg:p-12" : "lg:p-10"}`}>
                  <div
                    className={`flex flex-col ${
                      i === 3
                        ? "sm:flex-row sm:items-center justify-between gap-4 sm:gap-6"
                        : "gap-0"
                    }`}
                  >
                    <div className={i === 3 ? "max-w-md" : ""}>
                      <h3
                        className={`font-serif text-[#1c1c19] mb-3 ${
                          i === 0 ? "text-3xl" : "text-2xl"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p className="text-[#40484f] font-light leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    {i === 3 && (
                      <Link
                        href="/contact"
                        className="flex items-center gap-2 text-[#00527b] font-medium text-sm whitespace-nowrap group/btn"
                      >
                        Enquire Now
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#40484f] text-lg">
              No services available at the moment.
            </p>
          </div>
        )}
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="bg-[#f7f3ee] rounded-sm p-8 sm:p-12 lg:p-20 text-center border border-[#e6e2dd]/50 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-serif text-3xl lg:text-4xl text-[#1c1c19] mb-5">
              Ready to elevate your stay?
            </h2>
            <p className="text-[#40484f] font-light mb-10 max-w-2xl mx-auto leading-relaxed">
              Our concierge is at your disposal to customise every aspect of
              your Tinian escape. Let us handle the details while you embrace
              the silence.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#00527b] text-white px-10 py-4 rounded text-sm font-medium tracking-widest uppercase hover:bg-[#1a6b9a] transition-colors"
            >
              Contact Concierge
            </Link>
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none select-none">
            <svg className="w-48 h-48 text-[#00527b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
