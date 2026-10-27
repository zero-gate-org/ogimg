import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { Guide } from "../../lib/content/types";
import type { Breadcrumb } from "./ContentBits";
import SiteHeader from "../landing/SiteHeader";
import SiteFooter from "../landing/SiteFooter";
import { JsonLd } from "./JsonLd";
import {
    AuthorBox,
    Breadcrumbs,
    ContentBlocks,
    CtaPanel,
    FaqList,
    KeyFacts,
    PageTitle,
    QuickAnswer,
    RelatedLinks,
    Sources,
    TableOfContents,
    formatDate,
    headingId,
} from "./ContentBits";
import {
    articleSchema,
    breadcrumbSchema,
    faqSchema,
    howToSchema,
    webPageSchema,
} from "../../lib/seo";

export type RelatedItem = { href: string; title: string; description: string };

export function guideSchema(
    guide: Guide,
    path: string,
    section: { label: string; href: string } = { label: "Guides", href: "/learn" },
) {
    return [
        webPageSchema({ title: guide.seoTitle, description: guide.description, path, updated: guide.updated }),
        articleSchema({
            title: guide.title,
            description: guide.description,
            path,
            published: guide.published,
            updated: guide.updated,
            section: guide.category,
        }),
        breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: section.label, path: section.href },
            { name: guide.title, path },
        ]),
        faqSchema(guide.faqs, path),
        ...(guide.howTo
            ? [
                  howToSchema({
                      title: guide.title,
                      description: guide.description,
                      path,
                      steps: guide.howTo,
                  }),
              ]
            : []),
    ];
}

export function GuideArticle({
    guide,
    path,
    related,
    section = { label: "Guides", href: "/learn" },
    eyebrow,
    cta,
}: {
    guide: Guide;
    path: string;
    related: RelatedItem[];
    section?: { label: string; href: string };
    eyebrow?: string;
    cta?: {
        primary?: { href: string; label: string };
        secondary?: { href: string; label: string };
    };
}) {
    const toc = guide.sections
        .filter((block): block is Extract<typeof block, { type: "h2" }> => block.type === "h2")
        .map((block) => ({ id: headingId(block.text, block.id), label: block.text }));

    const breadcrumbs: Breadcrumb[] = [
        { name: "Home", href: "/" },
        { name: section.label, href: section.href },
        { name: guide.title, href: path },
    ];

    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <JsonLd items={guideSchema(guide, path, section)} />
            <SiteHeader />

            <main className="shell max-w-[76rem] pb-20 pt-10 md:pt-14">
                <Breadcrumbs items={breadcrumbs} />

                <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
                    <article className="min-w-0">
                        <PageTitle
                            eyebrow={eyebrow ?? `${guide.category} · ${guide.readingTime} min read`}
                            title={guide.title}
                            description={guide.description}
                            meta={
                                <p className="font-mono text-[11px] text-muted-foreground">
                                    Updated{" "}
                                    <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
                                </p>
                            }
                        />

                        <div className="mt-8 space-y-6">
                            <QuickAnswer text={guide.quickAnswer} />
                            <KeyFacts facts={guide.keyFacts} />
                        </div>

                        <div className="mt-8 lg:hidden">
                            <TableOfContents items={toc} />
                        </div>

                        <div className="mt-10">
                            <ContentBlocks blocks={guide.sections} />
                        </div>

                        <FaqList faqs={guide.faqs} />
                        {guide.sources ? <Sources sources={guide.sources} /> : null}
                        <AuthorBox updated={guide.updated} readingTime={guide.readingTime} />
                        <CtaPanel {...(cta ?? {})} />
                    </article>

                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            <TableOfContents items={toc} />
                            <div className="border border-border bg-surface-sunken p-4">
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                    Make one now
                                </p>
                                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                                    Free templates, a layer canvas, and copy-ready meta tags. No account.
                                </p>
                                <Link
                                    href="/studio"
                                    className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground link-underline"
                                >
                                    Open the canvas
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>

                <RelatedLinks links={related} />
            </main>

            <SiteFooter />
        </div>
    );
}
