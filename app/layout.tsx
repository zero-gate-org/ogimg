import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { JsonLd } from "./components/content/JsonLd";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL_OBJECT,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "./lib/seo";

export const metadata: Metadata = {
  metadataBase: SITE_URL_OBJECT,
  title: {
    default: "Open Graph Image Generator and Free OG Image Maker",
    template: "%s | ogimg.in",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "open graph image generator",
    "og image generator",
    "og image maker",
    "open graph image maker",
    "social preview image generator",
    "twitter card image generator",
    "open graph templates",
    "free og image generator",
  ],
  authors: [{ name: "GxAditya", url: "https://www.ogimg.in/about" }],
  creator: "GxAditya",
  publisher: SITE_NAME,
  category: "Design",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Open Graph Image Generator and Free OG Image Maker",
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Graph Image Generator and Free OG Image Maker",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-32.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body className="antialiased bg-background text-foreground">
        <JsonLd items={[organizationSchema(), websiteSchema(), softwareApplicationSchema()]} />
        {children}
      </body>
    </html>
  );
}
