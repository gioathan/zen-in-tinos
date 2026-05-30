"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function ContactContent() {
  const [settings, setSettings] = useState<any>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: "submit" }
      );

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken: token }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send message");

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to send message. Please try again.");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass =
    "w-full px-4 py-3 bg-[#f7f3ee] border border-[#e6e2dd] rounded-sm text-sm text-[#1c1c19] placeholder-[#707880] focus:outline-none focus:border-[#00527b] focus:bg-white transition-colors";

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />

      <div className="bg-[#fdf9f4] min-h-screen">
        {/* ── Hero ──────────────────────────────── */}
        <header className="pt-24 pb-16 lg:pt-32 lg:pb-24 max-w-screen-2xl mx-auto px-6 lg:px-12">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#1c1c19] leading-tight mb-5">
            Get in <span className="italic text-[#00527b]">Touch</span>
          </h1>
          <p className="text-lg text-[#40484f] font-light max-w-xl leading-relaxed">
            We'd love to help you plan your perfect stay in Tinos. Reach out
            and we'll respond within the day.
          </p>
        </header>

        {/* ── Contact body ──────────────────────── */}
        <section className="pb-24 lg:pb-32 max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Left: Info */}
            <div>
              <div className="space-y-8 mb-10">
                {settings.contact_email && (
                  <div className="flex items-start gap-5">
                    <div className="w-11 h-11 bg-[#f1ede8] rounded-sm flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#00527b]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#707880] mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="text-[#1c1c19] hover:text-[#00527b] transition-colors text-sm"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {settings.contact_phone && (
                  <div className="flex items-start gap-5">
                    <div className="w-11 h-11 bg-[#f1ede8] rounded-sm flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#00527b]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#707880] mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${settings.contact_phone}`}
                        className="text-[#1c1c19] hover:text-[#00527b] transition-colors text-sm"
                      >
                        {settings.contact_phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings.whatsapp_number && (
                  <div className="flex items-start gap-5">
                    <div className="w-11 h-11 bg-[#f1ede8] rounded-sm flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#00527b]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#707880] mb-1">
                        WhatsApp
                      </p>
                      <a
                        href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1c1c19] hover:text-[#00527b] transition-colors text-sm"
                      >
                        {settings.whatsapp_number}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 bg-[#f1ede8] rounded-sm flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#00527b]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#707880] mb-1">
                      Location
                    </p>
                    <p className="text-[#1c1c19] text-sm">Tinos, Cyclades, Greece</p>
                  </div>
                </div>
              </div>

              {/* Business hours card */}
              <div className="bg-[#f7f3ee] rounded-sm p-6 border border-[#e6e2dd]/50">
                <h3 className="font-semibold text-[#1c1c19] text-sm mb-4 uppercase tracking-[0.15em] text-[10px]">
                  Hours
                </h3>
                <div className="space-y-3 text-sm text-[#40484f]">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium text-[#1c1c19]">9:00 – 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday – Sunday</span>
                    <span className="font-medium text-[#1c1c19]">10:00 – 18:00</span>
                  </div>
                  <p className="text-xs text-[#707880] pt-2 border-t border-[#e6e2dd]">
                    Emergency support available 24/7
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-sm p-8 lg:p-10 shadow-[0_8px_40px_rgba(28,28,25,0.06)] border border-[#e6e2dd]">
              <h2 className="font-serif text-2xl lg:text-3xl text-[#1c1c19] mb-8">
                Send us a message
              </h2>

              {status === "success" && (
                <div className="mb-6 p-4 bg-[#f7f3ee] border border-[#c0c7d0] rounded-sm">
                  <p className="text-[#1c1c19] text-sm font-medium">
                    ✓ Message sent! We'll get back to you soon.
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
                  <p className="text-red-800 text-sm font-medium">
                    ✗ {errorMessage}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#40484f] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#40484f] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#40484f] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="+30 123 456 7890"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#40484f] mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-[#00527b] text-white py-4 rounded-sm text-sm font-semibold hover:bg-[#1a6b9a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#707880] text-center">
                  Protected by reCAPTCHA.{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    className="underline"
                    target="_blank"
                    rel="noopener"
                  >
                    Privacy
                  </a>{" "}
                  &{" "}
                  <a
                    href="https://policies.google.com/terms"
                    className="underline"
                    target="_blank"
                    rel="noopener"
                  >
                    Terms
                  </a>{" "}
                  apply.
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
