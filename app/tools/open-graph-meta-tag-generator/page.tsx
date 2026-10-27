import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import SiteHeader from "../../components/landing/SiteHeader";
import SiteFooter from "../../components/landing/SiteFooter";
import MetaTagGenerator from "../../components/tools/MetaTagGenerator";
import { JsonLd } from "../../components/content/JsonLd";
import {
    Breadcrumbs,
    ContentBlocks,
    FaqList,
    PageTitle,
} from "../../components/content/ContentBits";
import type { ContentBlock } from "../../lib/content/types";
import {
    absoluteUrl,
    breadcrumbSchema,
    createMetadata,
    faqSchema,
    howToSchema,
    webPageSchema,
} from "../../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Open Graph Meta Tag Generator",
    description:
        "Generate Open Graph and X card meta tags for any page. Fill in the title, description, URL, and image, then copy the tags and check the live social preview.",
    path: "/tools/open-graph-meta-tag-generator",
    keywords: [
        "open graph meta tag generator",
        "og meta tag generator",
        "twitter card generator",
        "og image meta tags",
        "social meta tags generator",
    ],
});

const FAQS = [
    {
        question: "What tags does an Open Graph image need?",
        answer:
            "At minimum: og:title, og:description, og:url, og:image, og:image:width, og:image:height, og:image:alt, og:type, and og:site_name. Add twitter:card, twitter:title, twitter:description, and twitter:image for X. The generator above produces all of them.",
    },
    {
        question: "Should the image URL be absolute?",
        answer:
            "Yes. Crawlers fetch the image from outside your page, so a relative path such as /og.png cannot be resolved reliably. Use the full https:// URL, including the domain.",
    },
    {
        question: "What size should the image be?",
        answer:
            "1200 x 630 pixels for a 1.91:1 link card. That size works on X, LinkedIn, Discord, Slack, and Facebook. Keep the file under 1 MB and the important content inside a 64 px safe area.",
    },
    {
        question: "Do I need both Open Graph and Twitter tags?",
        answer:
            "X falls back to Open Graph tags when twitter:* tags are missing, but the fallback is inconsistent. Adding twitter:card, twitter:title, twitter:description, and twitter:image makes the card predictable.",
    },
    {
        question: "Why is my new card not showing?",
        answer:
            "The platform cached the old one. Re-scrape the URL with the X Card Validator, LinkedIn Post Inspector, or Facebook Sharing Debugger after the page is live. Caches can last for days.",
    },
    {
        question: "Does the order of the tags matter?",
        answer:
            "No. Meta tags in the document head are not order-dependent. Keep them grouped for readability, but any order works.",
    },
];

const HOW_TO_STEPS = [
    {
        name: "Enter the page details",
        text: "Fill in the page title, description, canonical URL, and the absolute URL of a 1200 x 630 image.",
    },
    {
        name: "Check the previews",
        text: "Switch between X, LinkedIn, Discord, and Slack to see how the card is truncated. Shorten the title or description until nothing important is cut.",
    },
    {
        name: "Copy the tags",
        text: "Press Copy tags and paste the block into the document head, replacing any existing Open Graph and Twitter tags.",
    },
    {
        name: "Re-scrape the live URL",
        text: "Deploy the page, then run the URL through the X Card Validator or LinkedIn Post Inspector so the old cache is replaced.",
    },
];

const CONTENT: ContentBlock[] = [
    {
        type: "h2",
        text: "What each tag does",
    },
    {
        type: "table",
        head: ["Tag", "Purpose", "Notes"],
        rows: [
            ["og:title", "Card headline", "Not the same as the HTML title tag; it can be shorter and more direct."],
            ["og:description", "Supporting sentence", "Around 200 characters before platforms truncate."],
            ["og:url", "Canonical page URL", "Use the final URL, not a redirect or a tracking link."],
            ["og:image", "The card image", "Absolute HTTPS URL. 1200 x 630, under 1 MB."],
            ["og:image:width / height", "Image dimensions", "Lets a crawler lay out the card before the file loads."],
            ["og:image:alt", "Image description", "Used by screen readers and increasingly by AI systems."],
            ["og:type", "Page kind", "`website` for a homepage, `article` for a post or guide."],
            ["og:site_name", "Brand name", "Shown by some platforms above the title."],
            ["twitter:card", "X card layout", "`summary_large_image` for a wide image, `summary` for a small square."],
        ],
        caption: "Open Graph is the base layer. X reads twitter:* first and falls back to og:*.",
    },
    {
        type: "h2",
        text: "Where the tags go",
    },
    {
        type: "p",
        text: "Put the block inside the document `<head>`, after the title and description. In a framework, use the framework's metadata API rather than pasting raw tags into a layout: Next.js has `generateMetadata` and the `metadata` export, which emit the correct tags per route. The [Next.js Open Graph guide](/learn/nextjs-open-graph-image) has a working example.",
    },
    {
        type: "h2",
        text: "How to add the tags",
    },
    {
        type: "ol",
        items: HOW_TO_STEPS.map((step) => `**${step.name}.** ${step.text}`),
    },
    {
        type: "callout",
        tone: "warning",
        title: "The image URL is where most cards break",
        text: "A relative `/og.png`, an image behind authentication, or a URL that redirects will fail silently. Open the image URL in a private browser window. If it does not load there, a crawler will not see it either.",
    },
    {
        type: "h2",
        text: "Check the tags before you ship",
    },
    {
        type: "ul",
        items: [
            "**One set of tags.** Duplicate `og:image` tags from a plugin and a hand-written block confuse crawlers; the first or last may win depending on the platform.",
            "**No `noindex` on the image.** A robots rule that blocks the page or the image file also blocks the card.",
            "**Alt text on the image.** It is read by assistive technology and used by search and AI systems that cannot see the card.",
            "**A stable URL.** Bump the filename when the artwork changes; platforms cache by image URL for weeks.",
        ],
    },
    {
        type: "h2",
        text: "Generate the image too",
    },
    {
        type: "p",
        text: "Tags describe the card; they do not design it. The [Open Graph image generator](/studio) opens at 1200 x 630 with a safe area, layers, and platform presets, and the [template gallery](/template-gallery) has 45 editable layouts. Neither requires an account, and the image never leaves your browser.",
    },
    {
        type: "links",
        title: "Keep reading",
        items: [
            {
                href: "/learn/open-graph-meta-tags",
                label: "Open Graph meta tags, explained",
                description: "Every tag, what reads it, and the mistakes that break a card.",
            },
            {
                href: "/learn/open-graph-image-size",
                label: "OG image size guide",
                description: "Dimensions, ratios, and safe areas for each platform.",
            },
            {
                href: "/learn/og-image-not-showing",
                label: "OG image not showing?",
                description: "A debugging order for missing, cropped, and stale previews.",
            },
            {
                href: "/tools",
                label: "All tools",
                description: "Generators and checkers that run in the browser.",
            },
        ],
    },
];

export default function MetaTagGeneratorPage() {
    const path = "/tools/open-graph-meta-tag-generator";

    const jsonLd = [
        webPageSchema({
            title: "Open Graph meta tag generator",
            description:
                "Generate Open Graph and X card meta tags with a live social preview, then copy the block into any page.",
            path,
        }),
        {
            "@type": "WebApplication",
            "@id": `${absoluteUrl(path)}#app`,
            name: "Open Graph Meta Tag Generator",
            url: absoluteUrl(path),
            applicationCategory: "DeveloperApplication",
            applicationSubCategory: "Meta tag generator",
            operatingSystem: "Web",
            browserRequirements: "Requires JavaScript",
            description:
                "A free browser tool that generates Open Graph and X card meta tags and previews the result on X, LinkedIn, Discord, and Slack.",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
                "Open Graph tag generation",
                "X card tag generation",
                "Live X, LinkedIn, Discord, and Slack previews",
                "Copy-ready HTML",
                "No account and no upload",
            ],
            isPartOf: { "@id": `${absoluteUrl("/")}#website` },
            publisher: { "@id": `${absoluteUrl("/")}#organization` },
        },
        howToSchema({
            title: "How to add Open Graph meta tags to a page",
            description: "Generate the tags, paste them into the document head, and re-scrape the URL.",
            path,
            steps: HOW_TO_STEPS,
        }),
        faqSchema(FAQS, path),
        breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Open Graph meta tag generator", path },
        ]),
    ];

    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <JsonLd items={jsonLd} />
            <SiteHeader />

            <main className="shell max-w-[76rem] pb-20 pt-10 md:pt-14">
                <Breadcrumbs
                    items={[
                        { name: "Home", href: "/" },
                        { name: "Tools", href: "/tools" },
                        { name: "Open Graph meta tag generator", href: path },
                    ]}
                />

                <div className="mt-8 max-w-[70ch]">
                    <PageTitle
                        eyebrow="Free tool · No account"
                        title="Open Graph meta tag generator"
                        description="Fill in the page details and copy a complete set of Open Graph and X card tags. The preview updates as you type, so you can see what X, LinkedIn, Discord, and Slack will truncate before the page ships."
                    />
                </div>

                <div className="mt-10">
                    <MetaTagGenerator />
                </div>

                <div className="mt-16 max-w-[72ch]">
                    <ContentBlocks blocks={CONTENT} />
                </div>

                <div className="max-w-[72ch]">
                    <FaqList faqs={FAQS} />
                </div>

                <section className="mt-14 border border-border bg-surface-sunken p-6 md:p-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Tags are half the job
                    </p>
                    <h2 className="mt-3 max-w-[26ch] text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[30px]">
                        The image has to earn the click
                    </h2>
                    <p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-muted-foreground">
                        A correct card with a weak headline still gets ignored. Start from a layout that already
                        handles hierarchy, then change the words.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href="/studio"
                            className="pressable inline-flex h-11 items-center gap-2 bg-brand px-5 text-[13px] font-semibold text-brand-ink hover:bg-brand-strong"
                        >
                            Open the canvas
                            <ArrowRight size={14} weight="bold" />
                        </Link>
                        <Link
                            href="/template-gallery"
                            className="pressable inline-flex h-11 items-center border border-border bg-surface px-5 text-[13px] font-medium text-foreground hover:border-border-strong"
                        >
                            Browse templates
                        </Link>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
