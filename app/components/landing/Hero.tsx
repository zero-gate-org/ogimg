"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
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
                  initial: { opacity: 0, y: 18 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.7, delay, ease: EASE },
              }
            : {};

    return (
        <section className="relative overflow-hidden pb-16 pt-14 md:pb-24 md:pt-20">
            <div className="shell relative">
                {/* One centered statement, one action. The product itself sits
                    underneath as a real screenshot rather than a mock canvas. */}
                <div className="mx-auto max-w-[1000px] text-center">
                    <motion.h1
                        {...enter(0)}
                        className="text-[clamp(2.4rem,10vw,6.5rem)] font-semibold leading-[0.91] tracking-[-0.055em] text-foreground"
                    >
                        <span className="block">Open Graph images</span>
                        <span className="block">that look designed.</span>
                    </motion.h1>

                    <motion.p
                        {...enter(0.1)}
                        className="mx-auto mt-6 max-w-[58ch] text-pretty text-[16px] leading-[1.55] text-muted-foreground md:text-[17px]"
                    >
                        Give every link a poster worth clicking. Start from a template or a blank canvas, then
                        export a 1200 x 630 PNG that renders correctly on X, LinkedIn, Discord, and Slack.
                    </motion.p>

                    <motion.div
                        {...enter(0.18)}
                        className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
                    >
                        <Link
                            href="/studio"
                            className="group pressable inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[14px] font-semibold text-brand-ink hover:bg-brand-strong"
                        >
                            Make a poster
                            <ArrowRight
                                size={15}
                                weight="bold"
                                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                            />
                        </Link>
                        <Link
                            href="/template-gallery"
                            className="group link-underline inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
                        >
                            Browse templates
                            <ArrowRight
                                size={14}
                                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                            />
                        </Link>
                    </motion.div>

                    <motion.p
                        {...enter(0.26)}
                        className="mt-8 text-[13px] leading-relaxed text-muted-foreground"
                    >
                        Free and open source, with no account and nothing uploaded.
                    </motion.p>
                </div>

                {/* A real capture of the template editor: Aurora Arc is open on
                    the canvas, with the template controls on the right. */}
                <motion.figure
                    {...enter(0.24)}
                    className="mx-auto mt-14 w-full max-w-[1320px] md:mt-20"
                >
                    <div className="border border-border bg-surface p-1.5 md:p-2">
                        <Image
                            src="/hero-editor-aurora.webp"
                            alt="The ogimg.in template editor with the Aurora Arc template open on the canvas, showing its wordmark, headline, and domain line."
                            width={2560}
                            height={1600}
                            preload
                            sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1400px) calc(100vw - 5rem), 1316px"
                            className="block h-auto w-full"
                        />
                    </div>
                </motion.figure>
            </div>
        </section>
    );
}
