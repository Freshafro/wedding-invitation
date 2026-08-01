import type { Metadata } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const shareTitle = "Georges & Christella | Mariage & RSVP";
const shareDescription = "Site de mariage et RSVP de Georges Anthony Boum et Christella Emerusenge.";
const shareImagePath = "/4R4A4423.jpg";

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: shareTitle,
  description: shareDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    siteName: "Georges & Christella Wedding",
    title: shareTitle,
    description: shareDescription,
    images: [
      {
        url: shareImagePath,
        width: 1466,
        height: 2200,
        alt: "Georges and Christella portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [shareImagePath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${bodoniModa.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
