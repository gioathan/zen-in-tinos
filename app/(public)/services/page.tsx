import Image from "next/image";
import Link from "next/link";
import { getActiveServices } from "@/lib/data/public";

export const revalidate = 3600;

export const metadata = {
  title: "Our Services | Zen in Tinos",
  description: "Discover the services we offer to make your stay in Tinos unforgettable. Airport transfers, concierge, cleaning, and 24/7 support.",
};

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative h-80 bg-[#1A6B9A]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-lg md:text-xl text-gray-100">
              Everything you need for a comfortable and memorable stay in Tinos
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                >
                  {service.image_url && (
                    <div className="relative h-64">
                      <Image
                        src={service.image_url}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#1A6B9A] mb-3 group-hover:text-[#C4704A] transition">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A6B9A] mb-4">
              Why Choose Zen in Tinos?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to making your Tinos experience exceptional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F7F3EE] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1A6B9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A6B9A] mb-2">24/7 Availability</h3>
              <p className="text-gray-600">
                We're here whenever you need us, day or night
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F7F3EE] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1A6B9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A6B9A] mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Insider knowledge of the best spots and hidden gems
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F7F3EE] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1A6B9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A6B9A] mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Every property and service meets our high standards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1A6B9A] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Tinos?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Let us help you plan your perfect holiday in Tinos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/houses"
              className="inline-block bg-white text-[#1A6B9A] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#D4B896] hover:text-white transition-all"
            >
              Browse Houses
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-[#1A6B9A] transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}