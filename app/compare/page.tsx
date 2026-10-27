import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import SiteHeader from "../components/landing/SiteHeader";
import SiteFooter from "../components/landing/SiteFooter";
import { JsonLd } from "../components/content/JsonLd";
import { Breadcrumbs, PageTitle, formatDate } from "../components/content/ContentBits";
import { COMPARISONS } from "../lib/content/comparisons";
import {
    absoluteUrl,
    breadcrumbSchema,
    createMetadata,
    webPageSchema,
} from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Open Graph Image Tool Comparisons",
    description:
        "Honest comparisons of ogimg.in with Bannerbear and Canva for Open Graph images: price, automation, privacy, and which tool fits the job.",
    path: "/compare",
    keywords: ["og image generator comparison", "open graph image tool comparison", "bannerbear alternative", "canva og image"],
});

export default function ComparePage() {
    const jsonLd = [
        webPageSchema({
            title: "Open Graph image tool comparisons",
            description: "Honest comparisons of ogimg.in with other image tools for Open Graph cards.",
            path: "/compare",
        }),
        {
            "@type": "CollectionPage",
            "@id": `${absoluteUrl("/compare")}#collection`,
            name: "Open Graph image tool comparisons",
            url: absoluteUrl("/compare"),
            hasPart: COMPARISONS.map((comparison) => ({
                "@type": "Article",
                headline: comparison.title,
                url: absoluteUrl(`/compare/${comparison.slug}`),
                dateModified: comparison.updated,
            })),
        },
        breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Compare", path: "/compare" },
        ]),
    ];

    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <JsonLd items={jsonLd} />
            <SiteHeader />

            <main className="shell max-w-[76rem] pb-20 pt-10 md:pt-14">
                <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Compare", href: "/compare" }]} />

                <div className="mt-8">
                    <PageTitle
                        eyebrow="Compare"
                        title="Which tool should make your Open Graph images?"
                        description="ogimg.in is a focused, free, browser-based Open Graph editor. These comparisons explain where a general design platform or an automated rendering API is the better choice, and where it is not."
                    />
                </div>

                <ul className="mt-12 grid gap-px border border-border bg-border md:grid-cols-2">
                    {COMPARISONS.map((comparison) => (
                        <li key={comparison.slug} className="bg-background">
                            <Link
                                href={`/compare/${comparison.slug}`}
                                className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-surface-raised md:p-8"
                            >
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                    {comparison.readingTime} min read · Updated {formatDate(comparison.updated)}
                                </p>
                                <h2 className="text-[22px] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[26px]">
                                    {comparison.title}
                                </h2>
                                <p className="text-[14px] leading-relaxed text-muted-foreground">
                                    {comparison.description}
                                </p>
                                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-medium text-foreground link-underline">
                                    Read the comparison
                                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <section className="mt-14 border border-border bg-surface-sunken p-6 md:p-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Not sure which you need?
                    </p>
                    <h2 className="mt-3 max-w-[28ch] text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[30px]">
                        Start with the job, not the tool
                    </h2>
                    <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-muted-foreground">
                        If a person is designing one card, a browser editor is the shortest path. If a server is
                        rendering hundreds of cards, you want an API or a framework route. The{" "}
                        <Link href="/learn/how-to-create-an-open-graph-image" className="text-foreground underline decoration-border-strong underline-offset-4">
                            how-to guide
                        </Link>{" "}
                        and the{" "}
                        <Link href="/learn/nextjs-open-graph-image" className="text-foreground underline decoration-border-strong underline-offset-4">
                            Next.js guide
                        </Link>{" "}
                        cover both paths.
                    </p>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
