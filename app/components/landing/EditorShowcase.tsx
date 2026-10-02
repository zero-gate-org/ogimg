"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./landingPrimitives";

/**
 * Bento grid describing the editor surface. Cell count matches content count,
 * and three of the six cells carry real visual treatment (tinted panels, a
 * typographic specimen, a layer stack) rather than icon-plus-text.
 */
const CAPABILITIES = [
    {
        id: "layers",
        title: "Layer stack",
        body: "Text, shapes, and images in a reorderable list. Hide, lock, duplicate, or delete without touching the canvas.",
        span: "lg:col-span-2",
        visual: (
            <ul className="mt-5 divide-y divide-border border border-border bg-surface-sunken font-mono text-[11px]">
                {[
                    { label: "Headline", meta: "78px" },
                    { label: "Accent bar", meta: "shape" },
                    { label: "Product preview", meta: "image" },
                    { label: "ogimg.in", meta: "logo" },
                ].map((row, index) => (
                    <li
                        key={row.label}
                        className={`flex items-center justify-between px-3 py-2 ${index === 0 ? "text-brand" : "text-muted-foreground"}`}
                    >
                        <span>{row.label}</span>
                        <span>{row.meta}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: "snap",
        title: "Snap guides",
        body: "Drag any element and it snaps to canvas centres and to the edges of other layers.",
        span: "",
        visual: (
            <div className="relative mt-5 h-[72px] border border-border bg-surface-sunken" aria-hidden="true">
                <span className="absolute inset-y-0 left-1/2 w-px bg-brand/70" />
                <span className="absolute inset-x-0 top-1/2 h-px bg-brand/70" />
                <span className="absolute left-1/2 top-1/2 h-9 w-16 -translate-x-1/2 -translate-y-1/2 border border-brand" />
            </div>
        ),
    },
    {
        id: "type",
        title: "Type controls",
        body: "Sixteen self-hosted families, weight, size, line height, tracking, alignment, and case.",
        span: "",
        visual: (
            <div className="mt-5">
                <p className="text-[30px] font-semibold leading-none tracking-[-0.03em] text-foreground">Ag</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Geist Sans, Manrope, Sora, Lora
                </p>
            </div>
        ),
    },
    {
        id: "sizes",
        title: "Platform sizes",
        body: "Open Graph, LinkedIn, YouTube, Product Hunt, square posts, and stories. Change the size and layers rescale.",
        span: "lg:col-span-2",
        visual: (
            <div className="mt-5 flex flex-wrap gap-1.5">
                {[
                    "1200 x 630",
                    "1200 x 627",
                    "1280 x 720",
                    "1080 x 1080",
                    "1080 x 1920",
                ].map((size) => (
                    <span
                        key={size}
                        className="border border-border bg-surface-sunken px-2 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                        {size}
                    </span>
                ))}
            </div>
        ),
    },
    {
        id: "local",
        title: "Nothing leaves the tab",
        body: "Rendering, fonts, and exports all run locally. No account, no upload, no watermark.",
        span: "lg:col-span-2",
        visual: (
            <div className="mt-5 flex items-center gap-2 font-mono text-[11px] text-brand">
                <CheckCircle size={14} weight="fill" />
                Verified in the network tab
            </div>
        ),
    },
] as const;

export default function EditorShowcase() {
    return (
        <section id="canvas" className="scroll-mt-20 border-b border-border py-20 md:py-28">
            <div className="shell">
                <SectionHeading
                    eyebrow="The editor"
                    title="Granular control, start to finish"
                    body="Templates decide the layout. The free canvas hands you every layer, every number, and every pixel."
                />

                <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {CAPABILITIES.map((capability) => (
                        <RevealItem
                            key={capability.id}
                            className={`border border-border bg-surface p-5 ${capability.span}`}
                        >
                            <h3 className="text-[15px] font-semibold text-foreground">{capability.title}</h3>
                            <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-muted-foreground">
                                {capability.body}
                            </p>
                            {capability.visual}
                        </RevealItem>
                    ))}
                </RevealGroup>

                <Reveal className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                        href="/studio"
                        className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-[14px] font-semibold text-brand-ink transition-colors hover:bg-brand-strong active:translate-y-px"
                    >
                        Open the canvas
                        <ArrowRight size={16} weight="bold" />
                    </Link>
                    <p className="text-[13px] text-muted-foreground">
                        Your work is kept in this browser, so you can close the tab and come back.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}