import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Zen in Tinos. We're here to help you find your perfect holiday home in Tinos, Greece. Reach us by email, phone, or WhatsApp.",
  openGraph: {
    title: "Contact Us",
    description: "Get in touch with Zen in Tinos. Find your perfect holiday home in Tinos, Greece.",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
