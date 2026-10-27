import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import SiteHeader from "../components/landing/SiteHeader";
import SiteFooter from "../components/landing/SiteFooter";
import { JsonLd } from "../components/content/JsonLd";
import { Breadcrumbs, PageTitle } from "../components/content/ContentBits";
import {
    absoluteUrl,
    breadcrumbSchema,
    createMetadata,
    webPageSchema,
} from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Open Graph Tools and Size References",
    description:
        "Free browser tools for Open Graph images: generate meta tags with a live social preview, then check the size, tag, and troubleshooting guides.",
    path: "/tools",
    keywords: ["open graph tools", "og image tools", "social meta tag tools", "og image size reference"],
});

const REFERENCES = [
    {
        href: "/learn/open-graph-image-size",
        title: "OG image size guide",
        description: "1200 x 630, the safe area, and the dimensions each platform actually uses.",
    },
    {
        href: "/learn/open-graph-meta-tags",
        title: "Open Graph meta tags",
        description: "Every tag that controls the card, including the ones most sites forget.",
    },
    {
        href: "/learn/og-image-not-showing",
        title: "OG image not showing",
        description: "A debugging order for missing, cropped, and stale social previews.",
    },
    {
        href: "/learn/open-graph-image-examples",
        title: "OG image examples",
        description: "Annotated cards and the layout decisions behind them.",
    },
];

export default function ToolsPage() {
    const jsonLd = [
        webPageSchema({
            title: "Open Graph tools and size references",
            description:
                "Free browser tools for Open Graph images, plus the size, tag, and troubleshooting references.",
            path: "/tools",
        }),
        {
            "@type": "CollectionPage",
            "@id": `${absoluteUrl("/tools")}#collection`,
            name: "Open Graph tools",
            url: absoluteUrl("/tools"),
            hasPart: [
                {
                    "@type": "WebApplication",
                    name: "Open Graph Meta Tag Generator",
                    url: absoluteUrl("/tools/open-graph-meta-tag-generator"),
                },
                ...REFERENCES.map((entry) => ({
                    "@type": "Article",
                    name: entry.title,
                    url: absoluteUrl(entry.href),
                })),
            ],
        },
        breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
        ]),
    ];

    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <JsonLd items={jsonLd} />
            <SiteHeader />

            <main className="shell max-w-[76rem] pb-20 pt-10 md:pt-14">
                <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }]} />

                <div className="mt-8">
                    <PageTitle
                        eyebrow="Tools"
                        title="Open Graph tools that run in the browser"
                        description="No account, no upload, no queue. Generate the tags, check the dimensions, and debug the preview without installing anything."
                    />
                </div>

                <section aria-labelledby="tool-list" className="mt-12">
                    <h2 id="tool-list" className="sr-only">
                        Tools
                    </h2>
                    <Link
                        href="/tools/open-graph-meta-tag-generator"
                        className="group grid gap-6 border border-border bg-surface-sunken p-6 transition-colors hover:border-border-strong md:grid-cols-[1fr_220px] md:p-8"
                    >
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                Generator
                            </p>
                            <h3 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[32px]">
                                Open Graph meta tag generator
                            </h3>
                            <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-muted-foreground">
                                Enter the title, description, URL, and image, then copy a complete set of Open
                                Graph and X card tags. Live previews for X, LinkedIn, Discord, and Slack.
                            </p>
                            <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground link-underline">
                                Generate the tags
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </div>
                        <dl className="grid grid-cols-2 gap-px self-start border border-border bg-border md:grid-cols-1">
                            {[
                                { label: "Cost", value: "Free" },
                                { label: "Account", value: "Not required" },
                                { label: "Runs", value: "In the browser" },
                                { label: "Output", value: "Copy-ready HTML" },
                            ].map((fact) => (
                                <div key={fact.label} className="bg-background p-3">
                                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                                        {fact.label}
                                    </dt>
                                    <dd className="mt-1 text-[12.5px] font-medium leading-snug text-foreground">
                                        {fact.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </Link>
                </section>

                <section aria-labelledby="references" className="mt-14">
                    <h2
                        id="references"
                        className="border-b border-border pb-3 text-[22px] font-semibold tracking-[-0.02em] text-foreground"
                    >
                        References
                    </h2>
                    <ul className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">
                        {REFERENCES.map((entry) => (
                            <li key={entry.href} className="bg-background">
                                <Link
                                    href={entry.href}
                                    className="group flex h-full flex-col gap-1.5 p-5 transition-colors hover:bg-surface-raised"
                                >
                                    <span className="flex items-start justify-between gap-3 text-[15px] font-medium text-foreground">
                                        {entry.title}
                                        <ArrowRight
                                            size={14}
                                            className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                                        />
                                    </span>
                                    <span className="text-[13px] leading-relaxed text-muted-foreground">
                                        {entry.description}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-14 border border-border bg-surface-sunken p-6 md:p-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Need the image too?
                    </p>
                    <h2 className="mt-3 max-w-[28ch] text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[30px]">
                        Design the card in the same browser
                    </h2>
                    <p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-muted-foreground">
                        The editor opens at 1200 x 630, shows the safe area, and exports PNG, JPEG, or WebP. No
                        account, no watermark, and nothing uploaded.
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
