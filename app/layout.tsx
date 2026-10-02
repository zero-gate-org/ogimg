import type { Metadata } from "next";
import "./globals.css";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  SITE_URL_OBJECT,
} from "./lib/seo";

export const metadata: Metadata = {
  metadataBase: SITE_URL_OBJECT,
  title: {
    default: "Open Graph Image Generator",
    template: "%s | ogimg.in",
  },
  description: "Create beautiful Open Graph images in your browser with editable templates, custom backgrounds, and PNG, JPEG, or WebP export.",
  applicationName: SITE_NAME,
  keywords: [
    "open graph image generator",
    "og image generator",
    "social preview image generator",
    "twitter card image generator",
    "open graph templates",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Open Graph Image Generator",
    description: "Create beautiful Open Graph images in your browser with editable templates, custom backgrounds, and fast exports.",
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
    title: "Open Graph Image Generator",
    description: "Create beautiful Open Graph images in your browser with editable templates, custom backgrounds, and fast exports.",
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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
