import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/landing/SiteHeader";
import SiteFooter from "../components/landing/SiteFooter";
import { JsonLd } from "../components/content/JsonLd";
import { Breadcrumbs, ContentBlocks, PageTitle } from "../components/content/ContentBits";
import type { ContentBlock } from "../lib/content/types";
import {
    SITE_GITHUB,
    SITE_GITHUB_PROFILE,
    absoluteUrl,
    breadcrumbSchema,
    createMetadata,
    webPageSchema,
} from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "About ogimg.in — Free, Open Source, Browser-Only",
    absoluteTitle: true,
    description:
        "Who builds ogimg.in, why the Open Graph image editor is free and browser-only, how the guides are researched, and what the project does not do.",
    path: "/about",
    keywords: ["about ogimg.in", "open graph image generator about", "GxAditya ogimg"],
});

const SECTIONS: ContentBlock[] = [
    {
        type: "p",
        lead: true,
        text: "ogimg.in is a free Open Graph image generator that runs entirely in the browser. It exists so a person can make a correct 1200 x 630 card without an account, a subscription, or uploading an unreleased screenshot to someone else's server.",
    },
    {
        type: "h2",
        text: "Why the project exists",
    },
    {
        type: "p",
        text: "Most Open Graph images are an afterthought. A page ships with a cropped screenshot, a logo on a white background, or no image at all, and the link preview looks unfinished next to everything else in the feed. The tools that fix this tend to sit at two extremes: a general design suite with a monthly plan, or an API built for automated rendering at scale.",
    },
    {
        type: "p",
        text: "There is a gap between those: a focused editor for the person who needs one card, knows the dimensions, and wants to leave with a file. That is the whole product. The canvas opens at the right size, the safe area is visible, the preview panel shows the card inside real platform layouts, and the export panel produces the meta tags as well as the image.",
    },
    {
        type: "h2",
        text: "How it works",
    },
    {
        type: "p",
        text: "The editor is a Next.js application. Templates and the free canvas render as DOM layers, the exported image is rasterised in the browser, and the bundled fonts are self-hosted and embedded so a file renders the same on another machine. Images, copy, saved projects, and brand kits are kept in local storage. There is no upload step and no server-side image processing.",
    },
    {
        type: "p",
        text: "That architecture is also the privacy policy: the site cannot store what it never receives. Clearing site data removes the saved projects and brand kits, and there is no account to close.",
    },
    {
        type: "h2",
        text: "Who builds it",
    },
    {
        type: "p",
        text: "ogimg.in is built and maintained by GxAditya as an individual developer. It is a free, open-source project rather than a company, and there is no support desk behind it. The source is MIT licensed, so the editor can be inspected, self-hosted, or adapted.",
    },
    {
        type: "p",
        text: "Bugs, corrections, and complaints go through the [public issue tracker](https://github.com/GxAditya/ogimg/issues). Issues are read and answered as time allows; the [contact page](/contact) explains what to include and how privacy requests are handled.",
    },
    {
        type: "h2",
        text: "How the guides are written",
    },
    {
        type: "p",
        text: "The [Open Graph guides](/learn) are written for the person shipping the page, not for a search engine. Each guide names the platform behaviour it describes, links to primary sources such as the Open Graph protocol and platform developer documentation, and shows a publication and update date. Product claims about third-party tools are checked against the vendor's own pages and dated in the copy.",
    },
    {
        type: "p",
        text: "When a platform changes a dimension, a tag, or a cache rule, the relevant guide is updated and the date at the top changes. If you find something that is out of date, open an issue with the page URL and the source that contradicts it.",
    },
    {
        type: "h2",
        text: "What the project does not do",
    },
    {
        type: "table",
        head: ["Capability", "Status"],
        rows: [
            ["Browser editor and manual export", "Available"],
            ["45 editable templates and a free canvas", "Available"],
            ["Social preview simulator and meta tags", "Available"],
            ["Server-side API or headless rendering", "Not yet; on the roadmap"],
            ["Team workspaces, roles, and shared assets", "Not available"],
            ["Image or asset hosting", "Not available; export and host the file yourself"],
            ["Account, newsletter, or tracking", "None"],
        ],
        caption: "The roadmap is public in the repository. Export parity is a requirement for any API work.",
    },
    {
        type: "h2",
        text: "Editorial independence",
    },
    {
        type: "p",
        text: "The comparisons on this site are written to help a reader choose, including when the answer is another product. There are no affiliate links, sponsored placements, or paid rankings. If that changes, the disclosure will appear on the page itself, not only in a footer.",
    },
    {
        type: "links",
        title: "Start here",
        items: [
            {
                href: "/learn/what-is-an-open-graph-image",
                label: "What is an Open Graph image?",
                description: "The definition and the places the card appears.",
            },
            {
                href: "/tools/open-graph-meta-tag-generator",
                label: "Meta tag generator",
                description: "Build the tags and check the preview.",
            },
            {
                href: "/compare",
                label: "Tool comparisons",
                description: "Where a general design tool or an API is the better fit.",
            },
            {
                href: "/contact",
                label: "Contact",
                description: "Report a bug, a correction, or a privacy request.",
            },
        ],
    },
];

export default function AboutPage() {
    const path = "/about";

    const jsonLd = [
        webPageSchema({
            title: "About ogimg.in",
            description:
                "Who builds ogimg.in, how the browser-only editor works, and how the Open Graph guides are researched.",
            path,
        }),
        {
            "@type": "AboutPage",
            "@id": `${absoluteUrl(path)}#about`,
            url: absoluteUrl(path),
            name: "About ogimg.in",
            description:
                "The story, architecture, and editorial standards behind the free browser-based Open Graph image generator.",
            mainEntity: {
                "@type": "Person",
                "@id": `${absoluteUrl(path)}#person`,
                name: "GxAditya",
                url: absoluteUrl(path),
                sameAs: [SITE_GITHUB_PROFILE],
                knowsAbout: ["Open Graph images", "social meta tags", "browser-based image editing", "Next.js"],
            },
            isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        },
        breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path },
        ]),
    ];

    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <JsonLd items={jsonLd} />
            <SiteHeader />

            <main className="shell max-w-[76rem] pb-20 pt-10 md:pt-14">
                <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About", href: path }]} />

                <div className="mt-8 max-w-[70ch]">
                    <PageTitle
                        eyebrow="About"
                        title="A focused tool for one job: the link card"
                        description="ogimg.in is free, open source, and runs in your browser. This page explains who makes it, how it works, and how the guides are researched."
                    />
                </div>

                <div className="mt-12 max-w-[72ch]">
                    <ContentBlocks blocks={SECTIONS} />
                </div>

                <section className="mt-14 border border-border bg-surface-sunken p-6 md:p-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Make one now
                    </p>
                    <h2 className="mt-3 max-w-[26ch] text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[30px]">
                        The canvas is open
                    </h2>
                    <p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-muted-foreground">
                        Start from a template or a blank 1200 x 630 canvas. Export PNG, JPEG, or WebP, and copy the
                        tags from the same panel.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <a
                            href={SITE_GITHUB}
                            target="_blank"
                            rel="noreferrer"
                            className="pressable inline-flex h-11 items-center gap-2 bg-brand px-5 text-[13px] font-semibold text-brand-ink hover:bg-brand-strong"
                        >
                            View the source
                        </a>
                        <Link
                            href="/studio"
                            className="pressable inline-flex h-11 items-center border border-border bg-surface px-5 text-[13px] font-medium text-foreground hover:border-border-strong"
                        >
                            Open the canvas
                        </Link>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
