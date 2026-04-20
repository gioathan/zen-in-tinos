"use client";

import Link from "next/link";
import { Instagram, Facebook, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  return (
    <footer className="bg-stone-100">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Col 1: Brand */}
          <div>
            <span className="font-serif text-lg text-stone-900 mb-4 block">Zen in Tinos</span>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
              {settings.about_text ||
                "Curating moments of silence and architectural beauty in the heart of the Cyclades."}
            </p>
            <div className="flex gap-4 mt-6">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-[#00527b] transition-colors"
                >
                  <Instagram size={18} />
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-[#00527b] transition-colors"
                >
                  <Facebook size={18} />
                </a>
              )}
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-stone-400 hover:text-[#00527b] transition-colors"
                >
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="text-stone-900 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block">
                Explore
              </span>
              <div className="flex flex-col gap-3">
                {[
                  { href: "/houses", label: "The Villas" },
                  { href: "/services", label: "Our Services" },
                  { href: "/experiences", label: "Experiences" },
                  { href: "/contact", label: "Contact" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-stone-500 hover:text-[#00527b] text-sm hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <span className="text-stone-900 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block">
                Contact
              </span>
              <div className="flex flex-col gap-3 text-sm text-stone-500">
                <span>Tinos, Cyclades, Greece</span>
                {settings.contact_email && (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="hover:text-[#00527b] transition-colors break-all"
                  >
                    {settings.contact_email}
                  </a>
                )}
                {settings.contact_phone && (
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="hover:text-[#00527b] transition-colors"
                  >
                    {settings.contact_phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 3: Contact info */}
          <div>
            <span className="text-stone-900 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block">
              Find Us
            </span>
            <p className="text-stone-500 text-sm leading-relaxed">
              Tinos Island, Cyclades, Greece
            </p>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-14 pt-8">
          <p className="text-stone-400 text-xs">
            {settings.footer_text || "© 2026 Zen in Tinos. Sculpted Silence in the Cyclades."}
          </p>
        </div>
      </div>
    </footer>
  );
}
