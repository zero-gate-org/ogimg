import type { Metadata } from "next";

export const SITE_NAME = "ogimg.in";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ogimg.in";
export const SITE_URL_OBJECT = new URL(SITE_URL);
/**
 * Site card, 1200x630.
 *
 * When this artwork changes, publish the new file under a new name and update
 * this constant. X, LinkedIn, Slack, and Discord cache OG images by URL for
 * months, so overwriting the same path leaves the old card visible everywhere.
 */
export const DEFAULT_OG_IMAGE = "/og-card.png";
export const DEFAULT_OG_IMAGE_ALT =
    "ogimg.in, an Open Graph image generator with templates and a free canvas";

type CreateMetadataInput = {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    index?: boolean;
    type?: "website" | "article";
};

const createRobots = (index: boolean) => ({
    index,
    follow: true,
    googleBot: {
        index,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
    },
});

export const createMetadata = ({
    title,
    description,
    path,
    keywords = [],
    index = true,
    type = "website",
}: CreateMetadataInput): Metadata => ({
    title,
    description,
    keywords,
    alternates: {
        canonical: path,
    },
    openGraph: {
        title,
        description,
        url: path,
        siteName: SITE_NAME,
        type,
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
        title,
        description,
        images: [DEFAULT_OG_IMAGE],
    },
    robots: createRobots(index),
});
