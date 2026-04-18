import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Holiday Homes in Tinos, Greece",
  description: "Handpicked holiday homes in Tinos, Greece. Authentic Cycladic stays with stunning views, modern amenities, and personalised concierge service.",
  openGraph: {
    title: "Holiday Homes in Tinos, Greece",
    description: "Handpicked holiday homes in Tinos, Greece. Authentic Cycladic stays with stunning views and personalised service.",
    images: [{ url: "/homepage.jpg", width: 1200, height: 630, alt: "Zen in Tinos – Holiday Homes in the Cyclades" }],
  },
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: houses } = await supabase
    .from("houses")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(3);

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(3);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Zen in Tinos",
    url: process.env.NEXT_PUBLIC_DOMAIN,
    description: "Handpicked holiday homes in Tinos, Greece. Traditional stone houses, modern villas, and seaside studios.",
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
      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="/homepage.jpg"
          alt="Tinos Greece"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Where the Cyclades Become Your Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Handpicked homes, authentic stays, and effortless island living.
            </p>
            <Link
              href="/houses"
              className="inline-block bg-white text-[#1A6B9A] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#D4B896] hover:text-white transition-all"
            >
              Explore Homes
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Houses Section */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1A6B9A] mb-4">Featured Properties</h2>
            <p className="text-lg text-gray-600">
              Handpicked homes for your perfect getaway
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {houses?.map((house) => (
              <Link
                key={house.id}
                href={`/houses/${house.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="relative h-64">
                  <Image
                    src={house.featured_image_url}
                    alt={house.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1A6B9A] mb-2 group-hover:text-[#C4704A] transition">
                    {house.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {house.location_area}
                  </p>
                  <p className="text-gray-700 line-clamp-2 mb-4">
                    {house.short_description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{house.bedrooms} bed · {house.bathrooms} bath</span>
                    <span>{house.capacity} guests</span>
                  </div>
                  {house.price_per_night && (
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-2xl font-bold text-[#1A6B9A]">
                        €{house.price_per_night}
                      </span>
                      <span className="text-gray-600"> / night</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/houses"
              className="inline-block bg-[#1A6B9A] text-white px-8 py-3 rounded-full hover:bg-[#C4704A] hover:text-white transition-all"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1A6B9A] mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">
              Everything you need for a comfortable stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services?.map((service) => (
              <div
                key={service.id}
                className="text-center p-8 rounded-lg bg-[#F7F3EE] hover:bg-[#1A6B9A] transition-all group"
              >
                {service.image_url && (
                  <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={service.image_url}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#1A6B9A] mb-3 group-hover:text-white transition">
                  {service.title}
                </h3>
                <p className="text-gray-700 group-hover:text-white transition">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1A6B9A] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Your Stay?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Contact us today to find your perfect holiday home in Tinos
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#1A6B9A] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#D4B896] hover:text-white transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}