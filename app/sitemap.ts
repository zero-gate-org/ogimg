import type { MetadataRoute } from "next";
import { LEGAL_PAGES } from "./lib/legal";
import { SITE_URL } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        {
            url: SITE_URL,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/template-gallery`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/changelog`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        ...LEGAL_PAGES.map((page) => ({
            url: `${SITE_URL}${page.href}`,
            lastModified: now,
            changeFrequency: "yearly" as const,
            priority: 0.3,
        })),
    ];
}
