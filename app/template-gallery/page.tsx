import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";
import { TEMPLATE_LIBRARY } from "../components/templates/templateRegistry";
import TemplateGalleryPreview from "../components/TemplateGalleryPreview";
import { Reveal } from "../components/landing/landingPrimitives";
import { createMetadata } from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Template Gallery",
    description:
        "Browse ready-to-edit Open Graph image templates for product launches, blog posts, changelogs, podcasts, and more. Each one opens with full copy, type, colour, and background controls.",
    path: "/template-gallery",
    keywords: [
        "open graph templates",
        "og image templates",
        "social card templates",
        "blog og image templates",
    ],
});

export default function TemplateGalleryPage() {
    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
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
                <Reveal className="max-w-[52ch]">
                    <h1 className="text-[34px] font-semibold leading-[1.06] tracking-[-0.04em] text-foreground md:text-[46px]">
                        Template gallery
                    </h1>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                        Every layout below is live rendered. Open one to edit its copy, type, colour, and
                        background, then export at the size you need.
                    </p>
                </Reveal>

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
        </div>
    );
}