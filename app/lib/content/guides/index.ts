import type { Guide } from "../types";
import { whatIsAnOpenGraphImage } from "./what-is-an-open-graph-image";
import { openGraphImageSize } from "./open-graph-image-size";
import { openGraphMetaTags } from "./open-graph-meta-tags";
import { howToCreateAnOpenGraphImage } from "./how-to-create-an-open-graph-image";
import { openGraphImageBestPractices } from "./open-graph-image-best-practices";
import { openGraphImageExamples } from "./open-graph-image-examples";
import { ogImageNotShowing } from "./og-image-not-showing";
import { nextjsOpenGraphImage } from "./nextjs-open-graph-image";
import { wordpressOpenGraphImage } from "./wordpress-open-graph-image";
import { twitterCardImageSize } from "./twitter-card-image-size";

export const GUIDES: Guide[] = [
    whatIsAnOpenGraphImage,
    openGraphImageSize,
    openGraphMetaTags,
    howToCreateAnOpenGraphImage,
    openGraphImageBestPractices,
    openGraphImageExamples,
    ogImageNotShowing,
    nextjsOpenGraphImage,
    wordpressOpenGraphImage,
    twitterCardImageSize,
];

export const GUIDE_CATEGORIES = [
    { id: "Fundamentals", label: "Fundamentals", description: "What an OG image is, why it matters, and how to make one." },
    { id: "Sizes", label: "Sizes", description: "The dimensions, ratios, and safe areas for every platform." },
    { id: "Implementation", label: "Implementation", description: "Tags, frameworks, CMS plugins, and generated cards." },
    { id: "Design", label: "Design", description: "Type, contrast, composition, and a repeatable card system." },
    { id: "Troubleshooting", label: "Troubleshooting", description: "Fix a missing, cropped, or stale preview." },
] as const;

export function getGuide(slug: string) {
    return GUIDES.find((guide) => guide.slug === slug);
}

export function getRelatedGuides(guide: Guide) {
    return guide.related
        .map((slug) => getGuide(slug))
        .filter((entry): entry is Guide => Boolean(entry))
        .map((entry) => ({
            href: `/learn/${entry.slug}`,
            title: entry.title,
            description: entry.description,
        }));
}

export function getGuideCards() {
    return GUIDES.map((guide) => ({
        href: `/learn/${guide.slug}`,
        title: guide.title,
        description: guide.description,
        category: guide.category,
        readingTime: guide.readingTime,
        updated: guide.updated,
    }));
}
