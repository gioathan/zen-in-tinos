import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: house } = await supabase
    .from("houses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!house) {
    return {
      title: "House Not Found",
    };
  }

  return {
    title: house.meta_title || `${house.title} | Zen in Tinos`,
    description: house.meta_description || house.short_description || house.description,
  };
}

export default async function HouseDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch house with images and amenities
  const { data: house } = await supabase
    .from("houses")
    .select(`
      *,
      house_images (
        id,
        image_url,
        alt_text,
        display_order
      ),
      house_amenities (
        amenity_id,
        amenities (
          id,
          name,
          icon,
          category
        )
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!house) {
    notFound();
  }

  // Sort images by display_order
  const sortedImages = house.house_images?.sort(
    (a: any, b: any) => a.display_order - b.display_order
  ) || [];

  // All images (featured + gallery)
  const allImages = [
    { url: house.featured_image_url, alt: house.title },
    ...sortedImages.map((img: any) => ({ url: img.image_url, alt: img.alt_text || house.title }))
  ];

  // Get amenities
  const amenities = house.house_amenities?.map((ha: any) => ha.amenities).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-4 pt-5 sm:px-6 lg:px-8">
          {allImages.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
              {/* Main large image */}
              <div className="md:col-span-2 md:row-span-2 relative h-96 md:h-full rounded-lg overflow-hidden">
                <Image
                  src={allImages[0].url}
                  alt={allImages[0].alt}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Smaller images */}
              {allImages.slice(1, 5).map((image, index) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
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

      {/* House Details */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title and Location */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-[#1A6B9A] mb-2">
                  {house.title}
                </h1>
                {house.location_area && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {house.location_area}, Tinos
                  </p>
                )}
              </div>

              {/* Property Details */}
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-semibold">{house.capacity}</span> guests
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-semibold">{house.bedrooms}</span> bedrooms
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold">{house.bathrooms}</span> bathrooms
                </div>
                {house.size_sqm && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="font-semibold">{house.size_sqm}</span> m²
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A6B9A] mb-4">About this property</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {house.description}
                </p>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#1A6B9A] mb-4">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {amenities.map((amenity: any) => (
                      <div key={amenity.id} className="flex items-center gap-3 text-gray-700">
                        <svg className="w-5 h-5 text-[#1A6B9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {amenity.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {house.location_address && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#1A6B9A] mb-4">Location</h2>
                  <p className="text-gray-700 mb-4">{house.location_address}</p>
                  {house.google_maps_url && (
                    <a
                      href={house.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#1A6B9A] hover:text-[#C4704A] font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Google Maps
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-[#F7F3EE] rounded-lg p-6 shadow-lg">
                {house.price_per_night && (
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-[#1A6B9A]">
                      €{house.price_per_night}
                    </span>
                    <span className="text-gray-600"> / night</span>
                    {house.price_notes && (
                      <p className="text-sm text-gray-600 mt-2">{house.price_notes}</p>
                    )}
                  </div>
                )}

                <Link
                  href="/contact"
                  className="block w-full bg-[#1A6B9A] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#C4704A] transition-all mb-4"
                >
                  Contact Us
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-300 text-sm text-gray-600 space-y-2">
                  <p>📧 Email us for availability</p>
                  <p>💬 Quick response guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Houses */}
      <section className="py-8 bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/houses"
            className="inline-flex items-center gap-2 text-[#1A6B9A] hover:text-[#C4704A] font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            View All Properties
          </Link>
        </div>
      </section>
    </div>
  );
}