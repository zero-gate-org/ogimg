"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { TemplateDefinition } from "../templates/templateRegistry";
import TemplateGalleryPreview from "../TemplateGalleryPreview";

const EASE = [0.16, 1, 0.3, 1] as const;

// The deck holds still for a beat at both ends so the first and last panel are
// not already on their way out when the section pins or releases.
const PROGRESS_START = 0.04;
const PROGRESS_END = 0.96;

type SlideState = "active" | "before" | "farBefore" | "after";

/**
 * The outgoing panel moves up only a little while the incoming panel sweeps a
 * full viewport from below. That difference in travel is the parallax: the old
 * panel recedes and blurs, the new panel wipes over it.
 */
const SCENE_VARIANTS = {
    active: { y: "0%", opacity: 1 },
    before: { y: "-8%", opacity: 0.35 },
    farBefore: { y: "-8%", opacity: 0 },
    after: { y: "100%", opacity: 1 },
};

/** The preview travels farther and settles later than the name beside it. */
const PREVIEW_VARIANTS = {
    active: { y: 0, scale: 1, filter: "blur(0px)" },
    before: { y: -44, scale: 0.985, filter: "blur(12px)" },
    farBefore: { y: -44, scale: 0.985, filter: "blur(0px)" },
    after: { y: 96, scale: 0.95, filter: "blur(16px)" },
};

const COPY_VARIANTS = {
    active: { y: 0, opacity: 1, filter: "blur(0px)" },
    before: { y: -20, opacity: 0.45, filter: "blur(9px)" },
    farBefore: { y: -20, opacity: 0, filter: "blur(0px)" },
    after: { y: 40, opacity: 1, filter: "blur(10px)" },
};

/**
 * A pinned, scroll-triggered template showcase.
 *
 * Each template is a full-viewport scene: the live 1200x630 artboard sits on
 * the left, the template name and a single "Use this template" action sit on
 * the right. On a scroll step the next scene wipes up from below while the one
 * leaving recedes and loses focus. The preview and the copy move at different
 * rates, so the swipe has depth rather than reading as a flat slide. At rest
 * exactly one scene is on screen. Nothing intercepts the wheel: keyboard
 * paging, trackpads, touch scrolling, and scroll bars all keep working.
 */
export default function TemplateScrollDeck({ templates }: { templates: TemplateDefinition[] }) {
    const deckRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const reduce = useReducedMotion() ?? false;

    const stepCount = Math.max(templates.length - 1, 1);

    const { scrollYProgress } = useScroll({
        target: deckRef,
        offset: ["start start", "end end"],
    });

    const stepProgress = useTransform(
        scrollYProgress,
        [PROGRESS_START, PROGRESS_END],
        [0, 1],
    );

    useMotionValueEvent(stepProgress, "change", (latest) => {
        const next = Math.max(
            0,
            Math.min(templates.length - 1, Math.round(latest * stepCount)),
        );
        setActiveIndex((current) => (current === next ? current : next));
    });

    // Catch a restored scroll position or a reload deep inside the deck before
    // the first wheel event, so the panel matches the scrollbar.
    useEffect(() => {
        const sync = () => {
            const next = Math.max(
                0,
                Math.min(templates.length - 1, Math.round(stepProgress.get() * stepCount)),
            );
            setActiveIndex((current) => (current === next ? current : next));
        };

        const frame = requestAnimationFrame(sync);
        window.addEventListener("resize", sync);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", sync);
        };
    }, [stepCount, stepProgress, templates.length]);

    return (
        <div
            ref={deckRef}
            role="region"
            aria-label="Latest template previews"
            className="relative [--template-step:64svh] sm:[--template-step:70svh] lg:[--template-step:76svh]"
            style={{ height: `calc(100svh + ${stepCount} * var(--template-step))` }}
        >
            <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden bg-background">
                {templates.map((template, index) => {
                    const state: SlideState =
                        index === activeIndex
                            ? "active"
                            : index > activeIndex
                              ? "after"
                              : index === activeIndex - 1
                                ? "before"
                                : "farBefore";

                    return (
                        <TemplateSlide
                            key={template.id}
                            template={template}
                            index={index}
                            total={templates.length}
                            state={state}
                            reduce={reduce}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function TemplateSlide({
    template,
    index,
    total,
    state,
    reduce,
}: {
    template: TemplateDefinition;
    index: number;
    total: number;
    state: SlideState;
    reduce: boolean;
}) {
    const active = state === "active";

    const sceneTransition = reduce
        ? { duration: 0 }
        : { duration: active ? 0.9 : 0.58, ease: EASE };
    const previewTransition = reduce
        ? { duration: 0 }
        : { duration: active ? 1.05 : 0.62, ease: EASE };
    const copyTransition = reduce
        ? { duration: 0 }
        : { duration: active ? 0.94 : 0.5, ease: EASE };

    return (
        <motion.div
            role="group"
            aria-roledescription="slide"
            aria-label={`${template.name}, ${index + 1} of ${total}`}
            aria-hidden={active ? undefined : true}
            inert={active ? undefined : true}
            className="absolute inset-0 overflow-hidden bg-background"
            style={{ zIndex: active ? 30 : state === "after" ? 20 : 10 }}
            initial={false}
            animate={state}
            variants={SCENE_VARIANTS}
            transition={sceneTransition}
        >
            {/* Each scene carries its own colour light, sampled from the
                template, so the black stage changes temperature as you swipe. */}
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    background: `radial-gradient(ellipse 64% 82% at 24% 50%, ${template.previewGradient[0]}30 0%, transparent 68%), radial-gradient(ellipse 42% 58% at 94% 18%, ${template.previewGradient[1]}26 0%, transparent 72%)`,
                }}
            />

            <div className="relative flex h-full flex-col justify-center lg:grid lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:items-center">
                {/* Left: the real 1200x630 render, edge to edge on the left. */}
                <motion.div
                    className="w-full"
                    initial={false}
                    animate={state}
                    variants={PREVIEW_VARIANTS}
                    transition={previewTransition}
                >
                    <div className="w-[min(100%,calc((100svh-240px)*1.9047))] max-lg:mx-auto lg:w-[min(100%,calc((100svh-180px)*1.9047))]">
                        <div
                            className="shadow-[0_32px_120px_-36px_rgba(0,0,0,0.95)]"
                            aria-hidden="true"
                        >
                            <TemplateGalleryPreview templateId={template.id} maxWidth={3200} />
                        </div>
                    </div>
                </motion.div>

                {/* Right: only the name and one action. */}
                <motion.div
                    className="mt-7 px-6 sm:px-10 lg:mt-0 lg:pl-[3.5vw] lg:pr-[3.5vw]"
                    initial={false}
                    animate={state}
                    variants={COPY_VARIANTS}
                    transition={copyTransition}
                >
                    <h3 className="text-balance text-[clamp(2.75rem,7.2vw,3.4rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white sm:text-[clamp(3.1rem,5.8vw,4rem)] lg:text-[clamp(3.4rem,4.8vw,5.2rem)]">
                        {template.name}
                    </h3>

                    <Link
                        href={`/editor/${template.id}`}
                        className="group pressable mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[14px] font-semibold text-brand-ink hover:bg-brand-strong focus-visible:outline-offset-4 lg:mt-9"
                    >
                        Use this template
                        <ArrowUpRight
                            size={15}
                            weight="bold"
                            className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}
