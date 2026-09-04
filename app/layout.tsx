import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const siteUrl = "https://alphabes.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AlphaBes — Learn Letters. Learn Sounds. Learn English.",
    template: "%s | AlphaBes",
  },
  description:
    "AlphaBes teaches children ages 3-8 letters, phonics sounds, and early reading through interactive lessons, printable worksheets, and games.",
  openGraph: {
    type: "website",
    siteName: "AlphaBes",
    url: siteUrl,
    title: "AlphaBes — Learn Letters. Learn Sounds. Learn English.",
    description:
      "Interactive alphabet and phonics lessons, printable worksheets, and games for children ages 3-8.",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaBes",
    description: "Learn Letters. Learn Sounds. Learn English.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "AlphaBes",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "AlphaBes teaches children ages 3-8 letters, phonics, and early reading skills.",
    areaServed: ["US", "CA", "GB"],
  };

  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-crayon-yellow focus:px-4 focus:py-2 focus:rounded-block"
        >
          Skip to content
        </a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
