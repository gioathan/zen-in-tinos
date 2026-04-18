import Image from "next/image";
import Link from "next/link";
import { getPublishedHouses } from "@/lib/data/public";

export const revalidate = 3600;

export const metadata = {
  title: "Our Houses | Zen in Tinos",
  description: "Browse our collection of beautiful holiday homes in Tinos, Greece. Traditional stone houses, modern villas, and seaside studios.",
};

export default async function HousesPage() {
  const houses = await getPublishedHouses();

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      {/* Header Section */}
      <section className="relative h-64 bg-[#1A6B9A]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Houses</h1>
            <p className="text-lg md:text-xl text-gray-100">
              Find your perfect holiday home in Tinos
            </p>
          </div>
        </div>
      </section>

      {/* Houses Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {houses && houses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {houses.map((house) => (
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
                    {house.is_featured && (
                      <div className="absolute top-4 right-4 bg-white text-[#1A6B9A] px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1A6B9A] mb-2 group-hover:text-[#C4704A] transition">
                      {house.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {house.location_area || "Tinos"}
                    </p>
                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {house.short_description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {house.bedrooms} bed
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {house.bathrooms} bath
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {house.capacity} guests
                      </span>
                    </div>
                    {house.price_per_night && (
                      <div className="pt-4 border-t border-gray-200">
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No houses available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1A6B9A] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Contact us and we'll help you find your perfect holiday home
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#1A6B9A] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#D4B896] hover:text-white transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}