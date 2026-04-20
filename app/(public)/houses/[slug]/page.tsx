import Image from "next/image";
import Link from "next/link";
import { getHouseBySlug } from "@/lib/data/public";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const house = await getHouseBySlug(slug);

  if (!house) return { title: "House Not Found" };

  return {
    title: house.meta_title || house.title,
    description:
      house.meta_description || house.short_description || house.description,
    openGraph: {
      title: house.meta_title || house.title,
      description:
        house.meta_description || house.short_description || house.description,
      images: house.featured_image_url
        ? [{ url: house.featured_image_url, width: 1200, height: 630, alt: house.title }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: house.meta_title || house.title,
      description:
        house.meta_description || house.short_description || house.description,
      images: house.featured_image_url ? [house.featured_image_url] : [],
    },
  };
}

export default async function HouseDetailPage({ params }: Props) {
  const { slug } = await params;
  const house = await getHouseBySlug(slug);

  if (!house) notFound();

  const sortedImages =
    house.house_images?.sort(
      (a: any, b: any) => a.display_order - b.display_order
    ) || [];

  const allImages = [
    { url: house.featured_image_url, alt: house.title },
    ...sortedImages.map((img: any) => ({
      url: img.image_url,
      alt: img.alt_text || house.title,
    })),
  ];

  const amenities =
    house.house_amenities?.map((ha: any) => ha.amenities).filter(Boolean) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: house.title,
    description: house.short_description || house.description,
    image: house.featured_image_url,
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/houses/${house.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: house.location_area ? `${house.location_area}, Tinos` : "Tinos",
      addressRegion: "South Aegean",
      addressCountry: "GR",
    },
    ...(house.price_per_night && {
      priceRange: `€${house.price_per_night} per night`,
    }),
    numberOfRooms: house.bedrooms,
    amenityFeature: amenities.map((a: any) => ({
      "@type": "LocationFeatureSpecification",
      name: a.name,
      value: true,
    })),
  };

  return (
    <div className="bg-[#fdf9f4] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Image Gallery ─────────────────────────────────── */}
      <section className="pt-20 lg:pt-20">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-6">
          {allImages.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-sm overflow-hidden">
              {/* Main image — h-full works because the gallery items (h-52) define the row heights */}
              <div className="md:col-span-2 md:row-span-2 relative h-72 md:h-full">
                <Image
                  src={allImages[0].url}
                  alt={allImages[0].alt}
                  fill
                  priority
                  className="object-cover hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {allImages.slice(1, 5).map((image, index) => (
                <div key={index} className="relative h-52">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover hover:scale-[1.02] transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 25vw, 400px"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative h-64 sm:h-96 lg:h-[520px] rounded-sm overflow-hidden mb-8">
              <Image
                src={house.featured_image_url}
                alt={house.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}
        </div>
      </section>

      {/* ── House Details ─────────────────────────────────── */}
      <section className="py-10 lg:py-14">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title */}
              <div className="mb-6 pb-6 border-b border-[#e6e2dd]">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1c19] mb-3">
                  {house.title}
                </h1>
                {house.location_area && (
                  <p className="text-[#40484f] flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {house.location_area}, Tinos
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mb-10 pb-8 border-b border-[#e6e2dd]">
                {[
                  { label: "Guests", value: house.capacity },
                  { label: "Bedrooms", value: house.bedrooms },
                  { label: "Bathrooms", value: house.bathrooms },
                  ...(house.size_sqm ? [{ label: "m²", value: house.size_sqm }] : []),
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="block font-serif text-3xl text-[#00527b]">
                      {stat.value}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#40484f]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description */}
              {house.description && (
                <div className="mb-10">
                  <h2 className="font-serif text-2xl text-[#1c1c19] mb-4">
                    About this property
                  </h2>
                  <p className="text-[#40484f] leading-relaxed whitespace-pre-line">
                    {house.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mb-10 pb-10 border-b border-[#e6e2dd]">
                  <h2 className="font-serif text-2xl text-[#1c1c19] mb-6">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {amenities.map((amenity: any) => (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-3 text-[#40484f] text-sm"
                      >
                        <svg
                          className="w-4 h-4 text-[#00527b] flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {amenity.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {house.location_address && (
                <div className="mb-10">
                  <h2 className="font-serif text-2xl text-[#1c1c19] mb-4">
                    Location
                  </h2>
                  <p className="text-[#40484f] mb-4 text-sm">
                    {house.location_address}
                  </p>
                  {house.google_maps_url && (
                    <a
                      href={house.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#00527b] hover:text-[#1a6b9a] font-medium text-sm"
                    >
                      View on Google Maps
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {/* Back link */}
              <Link
                href="/houses"
                className="inline-flex items-center gap-2 text-[#40484f] hover:text-[#00527b] text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Properties
              </Link>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white rounded-sm p-6 lg:p-8 shadow-[0_8px_40px_rgba(28,28,25,0.08)] border border-[#e6e2dd]">
                {house.price_per_night && (
                  <div className="mb-6 pb-6 border-b border-[#e6e2dd]">
                    <span className="font-serif text-4xl text-[#00527b]">
                      €{house.price_per_night}
                    </span>
                    <span className="text-[#40484f] text-sm"> / night</span>
                    {house.price_notes && (
                      <p className="text-xs text-[#40484f] mt-2 leading-relaxed">
                        {house.price_notes}
                      </p>
                    )}
                  </div>
                )}

                <Link
                  href="/contact"
                  className="block w-full bg-[#00527b] text-white text-center py-3.5 rounded text-sm font-semibold hover:bg-[#1a6b9a] transition-colors mb-4"
                >
                  Contact Us
                </Link>

                <div className="mt-6 pt-5 border-t border-[#e6e2dd] text-xs text-[#40484f] space-y-2">
                  <p className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email us for availability
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quick response guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
