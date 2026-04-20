"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X /*, Globe*/ } from "lucide-react";

const navLinks = [
  { href: "/houses", label: "Houses" },
  { href: "/services", label: "Services" },
  { href: "/experiences", label: "Experiences" },
  { href: "/contact", label: "Contact" },
];

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [showLangMenu, setShowLangMenu] = useState(false); // re-enable with Google Translate
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Google Translate — disabled for now
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-lang-menu]")) setShowLangMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
    setShowLangMenu(false);
  };
  */

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-[#e6e2dd]/60"
          : "bg-white/80 backdrop-blur-xl"
      }`}
    >
      {/* <div id="google_translate_element" style={{ display: "none" }} /> */}

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center h-10 w-40 flex-shrink-0">
          <Image
            src="/dark-logo.png"
            alt="Zen in Tinos"
            width={160}
            height={62}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? "text-[#00527b] border-b border-[#00527b]/40 pb-0.5"
                  : "text-[#40484f] hover:text-[#00527b]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Language selector — disabled for now
          <div className="relative" data-lang-menu>
            <button
              onClick={() => setShowLangMenu((v) => !v)}
              className="text-[#40484f] hover:text-[#00527b] transition-colors p-1"
              aria-label="Change language"
            >
              <Globe size={18} />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl py-1.5 z-50 border border-[#e6e2dd]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#f7f3ee] transition-colors flex items-center gap-3 text-sm text-[#1c1c19]"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          */}

          <Link
            href="/contact"
            className="bg-[#00527b] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#1a6b9a] transition-colors active:scale-95"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#1c1c19] p-1"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#fdf9f4] border-t border-[#e6e2dd]">
          <div className="px-6 py-5">
            <div className="space-y-0">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center py-3.5 text-base font-medium border-b border-[#e6e2dd] transition-colors ${
                    isActive(link.href)
                      ? "text-[#00527b]"
                      : "text-[#1c1c19] hover:text-[#00527b]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language selector mobile — disabled for now
            <div className="pt-5 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#707880] mb-3">
                Language
              </p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 bg-[#f1ede8] px-3 py-2.5 rounded text-sm text-[#1c1c19] hover:bg-[#e6e2dd] transition-colors"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
            */}

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block mt-4 bg-[#00527b] text-white text-center py-3 rounded text-sm font-semibold hover:bg-[#1a6b9a] transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
