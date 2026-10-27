import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import SiteHeader from "../components/landing/SiteHeader";
import SiteFooter from "../components/landing/SiteFooter";
import { JsonLd } from "../components/content/JsonLd";
import { Breadcrumbs, PageTitle, formatDate } from "../components/content/ContentBits";
import { GUIDE_CATEGORIES, GUIDES } from "../lib/content/guides";
import {
    absoluteUrl,
    breadcrumbSchema,
    createMetadata,
    webPageSchema,
} from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Open Graph Image Guides: Sizes, Tags, and Examples",
    description:
        "Practical guides to Open Graph images: what they are, the right size, the meta tags, framework setup, design rules, and fixes for broken previews.",
    path: "/learn",
    keywords: [
        "open graph image guide",
        "og image guide",
        "open graph meta tags",
        "og image size",
        "open graph image examples",
    ],
});

export default function LearnPage() {
    const featured = GUIDES[0];
    const jsonLd = [
        webPageSchema({
            title: "Open Graph image guides",
            description:
                "Practical guides to Open Graph images: sizes, tags, implementation, design, and troubleshooting.",
            path: "/learn",
        }),
        {
            "@type": "CollectionPage",
            "@id": `${absoluteUrl("/learn")}#collection`,
            name: "Open Graph image guides",
            url: absoluteUrl("/learn"),
            hasPart: GUIDES.map((guide) => ({
                "@type": "Article",
                headline: guide.title,
                url: absoluteUrl(`/learn/${guide.slug}`),
                dateModified: guide.updated,
            })),
        },
        breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/learn" },
        ]),
    ];

    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <JsonLd items={jsonLd} />
            <SiteHeader />

            <main className="shell max-w-[76rem] pb-20 pt-10 md:pt-14">
                <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/learn" }]} />

                <div className="mt-8">
                    <PageTitle
                        eyebrow="Guides"
                        title="Open Graph images, explained without the guesswork"
                        description="Start with the definition, get the dimensions right, then copy the tags or fix the preview that refuses to appear. Every guide is written for the person shipping the page."
                    />
                </div>

                <section aria-labelledby="start-here" className="mt-12">
                    <h2
                        id="start-here"
                        className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                    >
                        Start here
                    </h2>
                    <Link
                        href={`/learn/${featured.slug}`}
                        className="group mt-4 grid gap-6 border border-border bg-surface-sunken p-6 transition-colors hover:border-border-strong md:grid-cols-[1fr_220px] md:p-8"
                    >
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                {featured.category} · {featured.readingTime} min read
                            </p>
                            <h3 className="mt-3 max-w-[24ch] text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[34px]">
                                {featured.title}
                            </h3>
                            <p className="mt-3 max-w-[62ch] text-[14.5px] leading-relaxed text-muted-foreground">
                                {featured.description}
                            </p>
                            <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground link-underline">
                                Read the guide
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </div>
                        <dl className="grid grid-cols-2 gap-px self-start border border-border bg-border md:grid-cols-1">
                            {featured.keyFacts.slice(0, 4).map((fact) => (
                                <div key={fact.label} className="bg-background p-3">
                                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                                        {fact.label}
                                    </dt>
                                    <dd className="mt-1 text-[12.5px] font-medium leading-snug text-foreground">
                                        {fact.value.replace(/`/g, "")}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </Link>
                </section>

                {GUIDE_CATEGORIES.map((category) => {
                    const guides = GUIDES.filter((guide) => guide.category === category.id);
                    if (!guides.length) return null;

                    return (
                        <section key={category.id} aria-labelledby={`category-${category.id}`} className="mt-14">
                            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:items-baseline sm:justify-between">
                                <h2
                                    id={`category-${category.id}`}
                                    className="text-[22px] font-semibold tracking-[-0.02em] text-foreground"
                                >
                                    {category.label}
                                </h2>
                                <p className="text-[12.5px] text-muted-foreground">{category.description}</p>
                            </div>
                            <ul className="mt-5 grid gap-px border border-border bg-border md:grid-cols-2">
                                {guides.map((guide) => (
                                    <li key={guide.slug} className="bg-background">
                                        <Link
                                            href={`/learn/${guide.slug}`}
                                            className="group flex h-full flex-col gap-2 p-5 transition-colors hover:bg-surface-raised"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-[16px] font-medium leading-snug text-foreground">
                                                    {guide.title}
                                                </h3>
                                                <ArrowRight
                                                    size={14}
                                                    className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                                                />
                                            </div>
                                            <p className="text-[13px] leading-relaxed text-muted-foreground">
                                                {guide.description}
                                            </p>
                                            <p className="mt-auto pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                                {guide.readingTime} min · Updated {formatDate(guide.updated)}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    );
                })}

                <section className="mt-16 border border-border bg-surface-sunken p-6 md:p-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Skip the reading
                    </p>
                    <h2 className="mt-3 max-w-[26ch] text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[30px]">
                        Make the card, copy the tags
                    </h2>
                    <p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-muted-foreground">
                        The editor exports a 1200 x 630 image and generates the Open Graph tags. No account,
                        no upload, no watermark.
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
                        <Link
                            href="/tools/open-graph-meta-tag-generator"
                            className="pressable inline-flex h-11 items-center border border-border bg-surface px-5 text-[13px] font-medium text-foreground hover:border-border-strong"
                        >
                            Generate the tags
                        </Link>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
