"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { HERO_DOCUMENT, DocumentPreview } from "./LiveCard";
import { useAfterPaint } from "./useAfterPaint";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
    const reduce = useReducedMotion();

    // Motion is layered on after the first paint so the server markup and the
    // first client render agree, which keeps the hero readable without JavaScript.
    const afterPaint = useAfterPaint();
    const animate = afterPaint && !reduce;

    const enter = (delay: number) =>
        animate
            ? {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.7, delay, ease: EASE },
              }
            : {};

    return (
        <section className="relative overflow-hidden border-b border-border">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.5]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 78% 12%, rgba(201,242,77,0.12) 0%, transparent 38%), radial-gradient(circle at 8% 88%, rgba(29,78,216,0.14) 0%, transparent 42%)",
                }}
            />

            <div className="shell relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-16 lg:py-28">
                <div className="min-w-0 max-w-[36rem]">
                    <motion.p
                        {...enter(0)}
                        className="mb-5 inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                        Free, open source, no upload
                    </motion.p>

                    <motion.h1
                        {...enter(0.06)}
                        className="text-[38px] font-semibold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-[52px] lg:text-[60px]"
                    >
                        Open Graph images your links deserve
                    </motion.h1>

                    <motion.p
                        {...enter(0.12)}
                        className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]"
                    >
                        Start from a template or compose one from scratch. Every layer stays editable until you
                        export.
                    </motion.p>

                    <motion.div {...enter(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href="/studio"
                            className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-[14px] font-semibold text-brand-ink transition-colors hover:bg-brand-strong active:translate-y-px"
                        >
                            Open the canvas
                            <ArrowRight size={16} weight="bold" />
                        </Link>
                        <Link
                            href="/template-gallery"
                            className="inline-flex h-11 items-center border border-border bg-surface px-5 text-[14px] font-medium text-foreground transition-colors hover:border-border-strong active:translate-y-px"
                        >
                            Browse templates
                        </Link>
                    </motion.div>
                </div>

                <motion.figure
                    {...enter(0.24)}
                    className="relative min-w-0"
                    aria-label="Preview of a generated Open Graph image"
                >
                    <div className="border border-border bg-surface p-2 shadow-[0_28px_70px_-40px_rgba(0,0,0,0.9)] md:p-3">
                        <DocumentPreview document={HERO_DOCUMENT} maxWidth={560} />
                    </div>
                    <figcaption className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                        <span>og-image-1200x630.png</span>
                        <span>2x</span>
                    </figcaption>
                </motion.figure>
            </div>
        </section>
    );
}