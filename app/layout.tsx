import type { Metadata } from "next";
import { Inter, Rammetto_One } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rammetto = Rammetto_One({ subsets: ["latin"], weight: "400", variable: "--font-rammetto" });

export const metadata: Metadata = {
  title: "Zen in Tinos",
  description: "Discover beautiful holiday homes in Tinos, Greece",
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