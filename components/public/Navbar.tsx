"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ];

  const handleLanguageChange = (langCode: string) => {
    const googleTranslate = (window as any).google?.translate?.TranslateElement;
    if (googleTranslate) {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      }
    }
    setShowLangMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-gradient-to-b from-black/50 to-transparent md:bg-gradient-to-b md:from-black/50 md:to-transparent bg-[#1A6B9A]"
      }`}
    >
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with crossfade */}
          <Link href="/" className="flex items-center relative h-10 w-40">
            <Image
              src="/dark-logo.png"
              alt="Zen in Tinos"
              width={160}
              height={62}
              priority
              className={`h-10 w-auto absolute transition-opacity duration-150 ${
                isScrolled ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src="/dark-logo.png"
              alt="Zen in Tinos"
              width={160}
              height={62}
              className={`h-10 w-auto absolute transition-opacity duration-150 ${
                isScrolled ? "opacity-100" : "opacity-0"
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  isScrolled
                    ? "text-[#1A6B9A] hover:text-[#C4704A]"
                    : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-[#D4B896]"
                }`}
              >
                <Globe size={20} />
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="w-full px-4 py-2 text-left hover:bg-[#F7F3EE] transition flex items-center gap-3"
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-gray-700">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/"
              className={`font-medium transition-colors duration-300 ${
                isScrolled 
                  ? "text-[#78D7E0] hover:text-[#D9D2C8]" 
                  : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-[#D9D2C8]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/houses"
              className={`font-medium transition-colors duration-300 ${
                isScrolled 
                    ? "text-[#1A6B9A] hover:text-[#C4704A]"
                    : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-[#D4B896]"
              }`}
            >
              Houses
            </Link>
            <Link
              href="/services"
              className={`font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-[#78D7E0] hover:text-[#D9D2C8]"
                  : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-[#D9D2C8]"
              }`}
            >
              Services
            </Link>
            <Link
              href="/experiences"
              className={`font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-[#1A6B9A] hover:text-[#C4704A]"
                  : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-[#D4B896]"
              }`}
            >
              Experiences
            </Link>
            <Link
              href="/contact"
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                isScrolled
                  ? "bg-[#1A6B9A] text-white hover:bg-[#C4704A] hover:text-white"
                  : "bg-white text-[#1A6B9A] hover:bg-[#D4B896] hover:text-white shadow-lg"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X
                className={isScrolled ? "text-black" : "text-white drop-shadow-lg"}
                size={28}
              />
            ) : (
              <Menu
                className={isScrolled ? "text-black" : "text-white drop-shadow-lg"}
                size={28}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1A6B9A] border-t border-[#4AAFC9]">
          <div className="px-4 py-6 space-y-4">
            {/* Language Selector Mobile */}
            <div className="pb-4 border-b border-[#4AAFC9]">
              <p className="text-white text-sm mb-2">Language:</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition"
                  >
                    <span>{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/"
              className="block text-white hover:text-[#D4B896] text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/houses"
              className="block text-white hover:text-[#D4B896] text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Houses
            </Link>
            <Link
              href="/services"
              className="block text-white hover:text-[#D4B896] text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/experiences"
              className="block text-white hover:text-[#D4B896] text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Experiences
            </Link>
            <Link
              href="/contact"
              className="block text-white hover:text-[#D4B896] text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}