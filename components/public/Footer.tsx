"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    async function fetchSettings() {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    }
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#1A6B9A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Tinos Homes</h3>
            <p className="text-gray-100 text-sm">
              {settings.about_text || "Discover beautiful holiday homes in Tinos, Greece."}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-100 hover:text-[#D4B896] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/houses" className="text-gray-100 hover:text-[#D4B896] transition">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-100 hover:text-[#D4B896] transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-100 hover:text-[#D4B896] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-100">
                <Mail size={16} />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-[#D4B896] transition">
                  {settings.contact_email || "info@tinoshomes.com"}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-100">
                <Phone size={16} />
                <a href={`tel:${settings.contact_phone}`} className="hover:text-[#D4B896] transition">
                  {settings.contact_phone || "+30 123 456 7890"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4B896] transition"
                >
                  <Instagram size={24} />
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4B896] transition"
                >
                  <Facebook size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-gray-100">
          <p>{settings.footer_text || "© 2026 Tinos Holiday Homes. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}