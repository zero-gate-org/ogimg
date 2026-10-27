import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

const AI_CRAWLERS = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "meta-externalagent",
    "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/refprobe"],
            },
            {
                // Answer engines are allowed on purpose: the guides are written
                // to be quoted, and the canonical URLs are in every file.
                userAgent: AI_CRAWLERS,
                allow: "/",
                disallow: ["/refprobe"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
