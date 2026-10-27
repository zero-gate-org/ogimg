import type { Metadata } from "next";

/**
 * Canonical host.
 *
 * The apex domain redirects to www at the Vercel domain level, so www is the
 * URL that returns 200. Every canonical, sitemap entry, and schema URL has to
 * agree with that or Google keeps discovering redirects instead of pages.
 *
 * The environment variable is normalised rather than trusted, because a stale
 * `https://ogimg.in` value in a deployment dashboard would silently reintroduce
 * the mismatch.
 */
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ogimg.in";

export const SITE_URL = RAW_SITE_URL.replace(/^https?:\/\/(www\.)?ogimg\.in\/?$/, "https://www.ogimg.in").replace(
    /\/+$/,
    "",
);
export const SITE_URL_OBJECT = new URL(SITE_URL);

export const SITE_NAME = "ogimg.in";
export const SITE_AUTHOR_NAME = "GxAditya";
export const SITE_AUTHOR_URL = "/about";
export const SITE_GITHUB = "https://github.com/GxAditya/ogimg";
export const SITE_GITHUB_PROFILE = "https://github.com/GxAditya";
export const SITE_CONTACT = "/contact";

export const SITE_TAGLINE = "Open Graph images that look designed";
export const SITE_DESCRIPTION =
    "Create Open Graph images in your browser with editable templates, a free canvas, platform sizes, and PNG, JPEG, or WebP export. No account, no upload, no watermark.";

/**
 * Site card, 1200x630.
 *
 * When this artwork changes, publish the new file under a new name and update
 * this constant. X, LinkedIn, Slack, and Discord cache OG images by URL for
 * months, so overwriting the same path leaves the old card visible everywhere.
 */
export const DEFAULT_OG_IMAGE = "/og-card.png";
export const DEFAULT_OG_IMAGE_ALT =
    "ogimg.in, an Open Graph image generator with editable templates and a free canvas";

/** Bumped when site-wide copy or structure changes, not on every deploy. */
export const SITE_LAST_UPDATED = "2026-10-27";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

type ArticleMetadata = {
    publishedTime: string;
    modifiedTime: string;
    section?: string;
    authors?: string[];
};

type CreateMetadataInput = {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    index?: boolean;
    type?: "website" | "article";
    image?: string;
    imageAlt?: string;
    article?: ArticleMetadata;
    /** Use when the page title already contains the brand. */
    absoluteTitle?: boolean;
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
    image = DEFAULT_OG_IMAGE,
    imageAlt = DEFAULT_OG_IMAGE_ALT,
    article,
    absoluteTitle = false,
}: CreateMetadataInput): Metadata => ({
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
        canonical: path,
    },
    authors: [{ name: SITE_AUTHOR_NAME, url: SITE_AUTHOR_URL }],
    creator: SITE_AUTHOR_NAME,
    publisher: SITE_NAME,
    openGraph: {
        title,
        description,
        url: path,
        siteName: SITE_NAME,
        type,
        locale: "en_US",
        images: [
            {
                url: image,
                width: 1200,
                height: 630,
                alt: imageAlt,
            },
        ],
        ...(article
            ? {
                  publishedTime: article.publishedTime,
                  modifiedTime: article.modifiedTime,
                  section: article.section,
                  authors: article.authors,
              }
            : {}),
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
    },
    robots: createRobots(index),
});

/* -------------------------------------------------------------------------- */
/* Structured data                                                             */
/* -------------------------------------------------------------------------- */

export const organizationSchema = () => ({
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.png"),
        width: 512,
        height: 512,
    },
    description: SITE_DESCRIPTION,
    founder: {
        "@type": "Person",
        name: SITE_AUTHOR_NAME,
        url: absoluteUrl(SITE_AUTHOR_URL),
        sameAs: [SITE_GITHUB_PROFILE],
    },
    sameAs: [SITE_GITHUB_PROFILE, SITE_GITHUB],
});

export const websiteSchema = () => ({
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
});

export const softwareApplicationSchema = () => ({
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: SITE_NAME,
    applicationCategory: "DesignApplication",
    applicationSubCategory: "Open Graph image generator",
    operatingSystem: "Web",
    url: SITE_URL,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: SITE_DESCRIPTION,
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    isAccessibleForFree: true,
    featureList: [
        "Editable Open Graph image templates",
        "Free canvas editor with layers",
        "Platform size presets",
        "Social preview simulator",
        "Copy-ready Open Graph meta tags",
        "PNG, JPEG, and WebP export",
        "Runs entirely in the browser",
    ],
    sameAs: [SITE_GITHUB_PROFILE, SITE_GITHUB],
    publisher: { "@id": `${SITE_URL}/#organization` },
});

export type FaqEntry = {
    question: string;
    answer: string;
};

export const faqSchema = (faqs: FaqEntry[], path = "/") => ({
    "@type": "FAQPage",
    "@id": `${SITE_URL}${path}#faq`,
    mainEntity: faqs.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: entry.answer,
        },
    })),
});

export type BreadcrumbEntry = {
    name: string;
    path: string;
};

export const breadcrumbSchema = (items: BreadcrumbEntry[]) => ({
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${items[items.length - 1]?.path ?? "/"}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
    })),
});

export const articleSchema = ({
    title,
    description,
    path,
    published,
    updated,
    image = DEFAULT_OG_IMAGE,
    section,
}: {
    title: string;
    description: string;
    path: string;
    published: string;
    updated: string;
    image?: string;
    section?: string;
}) => ({
    "@type": "Article",
    "@id": `${SITE_URL}${path}#article`,
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: { "@id": `${SITE_URL}${path}#webpage` },
    image: [absoluteUrl(image)],
    datePublished: published,
    dateModified: updated,
    inLanguage: "en",
    articleSection: section,
    author: {
        "@type": "Person",
        name: SITE_AUTHOR_NAME,
        url: absoluteUrl(SITE_AUTHOR_URL),
        sameAs: [SITE_GITHUB_PROFILE],
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
});

export const howToSchema = ({
    title,
    description,
    path,
    steps,
}: {
    title: string;
    description: string;
    path: string;
    steps: { name: string; text: string }[];
}) => ({
    "@type": "HowTo",
    "@id": `${SITE_URL}${path}#howto`,
    name: title,
    description,
    totalTime: "PT10M",
    supply: [
        { "@type": "HowToSupply", name: "A 1200 x 630 image" },
        { "@type": "HowToSupply", name: "Access to your page's <head>" },
    ],
    step: steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
    })),
});

export const webPageSchema = ({
    title,
    description,
    path,
    updated = SITE_LAST_UPDATED,
}: {
    title: string;
    description: string;
    path: string;
    updated?: string;
}) => ({
    "@type": "WebPage",
    "@id": `${SITE_URL}${path}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    dateModified: updated,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#software` },
});
