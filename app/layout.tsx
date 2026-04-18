import type { Metadata } from "next";
import { Inter, Rammetto_One } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400", variable: "--font-rammetto" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"),
  title: {
    default: "Zen in Tinos",
    template: "%s | Zen in Tinos",
  },
  description: "Discover beautiful holiday homes in Tinos, Greece. Traditional stone houses, modern villas, and seaside studios in the heart of the Cyclades.",
  keywords: ["Tinos", "holiday homes", "vacation rental", "Greece", "Cyclades", "villa rental", "stone houses", "island stay"],
  authors: [{ name: "Zen in Tinos" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Zen in Tinos",
    title: "Zen in Tinos",
    description: "Discover beautiful holiday homes in Tinos, Greece.",
    images: [{ url: "/homepage.jpg", width: 1200, height: 630, alt: "Zen in Tinos – Holiday Homes in the Cyclades" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zen in Tinos",
    description: "Discover beautiful holiday homes in Tinos, Greece.",
    images: ["/homepage.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'el,en,de,fr,it',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${rammetto.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}