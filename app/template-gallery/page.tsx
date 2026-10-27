import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";
import { TEMPLATE_LIBRARY } from "../components/templates/templateRegistry";
import TemplateGalleryPreview from "../components/TemplateGalleryPreview";
import SiteFooter from "../components/landing/SiteFooter";
import { TEMPLATE_PAGES } from "../lib/content/templates";
import { Reveal } from "../components/landing/landingPrimitives";
import { JsonLd } from "../components/content/JsonLd";
import { Breadcrumbs } from "../components/content/ContentBits";
import { breadcrumbSchema, createMetadata, webPageSchema } from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Open Graph Templates — 45 Free OG Image Designs",
    description:
        "Browse 45 free Open Graph image templates for blog posts, launches, podcasts, and changelogs. Edit any layout in your browser and export without an account.",
    path: "/template-gallery",
    keywords: [
        "open graph templates",
        "og image templates",
        "free og image templates",
        "social card templates",
        "blog og image templates",
    ],
});

export default function TemplateGalleryPage() {
    const jsonLd = [
        webPageSchema({
            title: "Open Graph templates",
            description:
                "45 free Open Graph image templates for blog posts, launches, podcasts, and changelogs, editable in the browser.",
            path: "/template-gallery",
        }),
        breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Templates", path: "/template-gallery" },
        ]),
    ];

    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <JsonLd items={jsonLd} />
            <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
                <div className="shell flex h-16 items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <CaretLeft size={14} />
                        Home
                    </Link>
                    <Link
                        href="/studio"
                        className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Free canvas
                    </Link>
                </div>
            </header>

            <main className="shell py-14 md:py-20">
                <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Templates", href: "/template-gallery" }]} />
                <Reveal className="mt-6 max-w-[52ch]">
                    <h1 className="text-[34px] font-semibold leading-[1.06] tracking-[-0.04em] text-foreground md:text-[46px]">
                        Open Graph template gallery
                    </h1>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                        Every layout below is live rendered. Open one to edit its copy, type, colour, and
                        background, then export at the size you need.
                    </p>
                </Reveal>

                <section aria-labelledby="use-cases" className="mt-10 border-y border-border py-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                        <h2
                            id="use-cases"
                            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                        >
                            By use case
                        </h2>
                        <p className="text-[12px] text-muted-foreground">
                            Guides with the layout, dimensions, and copy rules for each.
                        </p>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                        {TEMPLATE_PAGES.map((page) => (
                            <li key={page.slug}>
                                <Link
                                    href={`/templates/${page.slug}`}
                                    className="inline-flex border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                                >
                                    {page.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {TEMPLATE_LIBRARY.map((template) => (
                        <Link
                            key={template.id}
                            href={`/editor/${template.id}`}
                            className="group block border border-border bg-surface transition-colors hover:border-border-strong"
                        >
                            <div className="overflow-hidden">
                                <TemplateGalleryPreview templateId={template.id} />
                            </div>
                            <div className="border-t border-border px-4 py-3">
                                <p className="text-[14px] font-semibold text-foreground">{template.name}</p>
                                <p className="mt-0.5 text-[12px] text-muted-foreground">{template.subtitle}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}