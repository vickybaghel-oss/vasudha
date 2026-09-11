import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [
      {
        url: "/images/image-03.webp",
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/image-03.webp"],
  },
};

import { JsonLd } from "@/components/seo/json-ld";
import { PageLoader } from "@/components/layout/page-loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var r = document.documentElement;
                var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                var pf = window.matchMedia('(pointer: fine)').matches;
                r.dataset.motion = rm ? 'reduced' : 'full';
                r.dataset.pointer = pf ? 'fine' : 'coarse';
                r.classList.add('motion-ready');
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        <PageLoader />
        <JsonLd />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
