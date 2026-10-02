import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { TEMPLATE_LIBRARY } from "../templates/templateRegistry";
import TemplateGalleryPreview from "../TemplateGalleryPreview";
import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./landingPrimitives";

/**
 * Template gallery preview. Real rendered templates rather than screenshots, so
 * what a user sees here is what they get in the editor.
 */
export default function TemplateShowcase() {
    return (
        <section className="scroll-mt-20 border-b border-border py-20 md:py-28">
            <div className="shell">
                <SectionHeading
                    title="Nine templates that already work"
                    body="Each one opens in the editor with its own controls for copy, type, colour, and background."
                />

                <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {TEMPLATE_LIBRARY.map((template) => (
                        <RevealItem key={template.id}>
                            <Link
                                href={`/editor/${template.id}`}
                                className="group block border border-border bg-surface transition-colors hover:border-border-strong"
                            >
                                <div className="overflow-hidden">
                                    <TemplateGalleryPreview templateId={template.id} />
                                </div>
                                <div className="flex items-baseline justify-between gap-3 border-t border-border px-4 py-3">
                                    <div className="min-w-0">
                                        <p className="text-[14px] font-semibold text-foreground">
                                            {template.name}
                                        </p>
                                        <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                                            {template.subtitle}
                                        </p>
                                    </div>
                                    <ArrowRight
                                        size={15}
                                        className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                                    />
                                </div>
                            </Link>
                        </RevealItem>
                    ))}
                </RevealGroup>

                <Reveal className="mt-8">
                    <Link
                        href="/template-gallery"
                        className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong"
                    >
                        Browse all templates
                        <ArrowRight size={14} />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}