"use client";

import { useEffect, useRef, useState } from "react";
import {
    ArrowCounterClockwise,
    ArrowUpRight,
    Cursor,
    CursorClick,
    ImageSquare,
    Square,
    TextT,
} from "@phosphor-icons/react";

const DEFAULT_HEADLINE = "The art of a first impression.";

const TOOLS = [
    { label: "Move", icon: Cursor, active: false },
    { label: "Type", icon: TextT, active: true },
    { label: "Shape", icon: Square, active: false },
    { label: "Image", icon: ImageSquare, active: false },
] as const;

/**
 * A design canvas you can actually work in. The poster headline is a real
 * textarea, so a visitor can click it and retype the artboard before they ever
 * open the product. Everything here uses the same monochrome language as the
 * editor: one artboard, one selection, one tool rail, one collaborator.
 */
export default function HeroCanvas() {
    const [headline, setHeadline] = useState(DEFAULT_HEADLINE);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const edited = headline !== DEFAULT_HEADLINE;

    // Like an auto-fit type control: longer copy steps down a size so the
    // selection and the artboard stay in proportion instead of overflowing.
    const headlineSize =
        headline.length > 58 ? "5.8cqw" : headline.length > 46 ? "6.5cqw" : headline.length > 34 ? "7.3cqw" : "8.4cqw";

    // field-sizing is still uneven across browsers, so the textarea is measured
    // and resized directly. It also re-fits once the poster face finishes loading.
    useEffect(() => {
        const field = textareaRef.current;
        if (!field) return;

        const fit = () => {
            field.style.height = "auto";
            field.style.height = `${field.scrollHeight}px`;
        };

        let cancelled = false;
        fit();
        window.addEventListener("resize", fit);
        document.fonts?.ready.then(() => {
            if (!cancelled) fit();
        });

        return () => {
            cancelled = true;
            window.removeEventListener("resize", fit);
        };
    }, [headline, headlineSize]);

    return (
        <div className="relative mx-auto w-full max-w-[840px]">
            <div className="relative z-10 grid grid-cols-1 gap-4 xl:grid-cols-[40px_minmax(0,1fr)] xl:items-center xl:gap-5">
                {/* Tool rail. Decorative: the artboard itself is the working part. */}
                <div
                    aria-hidden="true"
                    className="order-1 hidden flex-col gap-1 rounded-full border border-black/10 bg-white p-1.5 xl:order-none xl:flex"
                >
                    {TOOLS.map((tool) => {
                        const Icon = tool.icon;

                        return (
                            <span
                                key={tool.label}
                                title={tool.label}
                                className={`grid h-8 w-8 place-items-center rounded-full transition-colors duration-200 ${
                                    tool.active
                                        ? "bg-paper-ink text-white"
                                        : "text-paper-muted hover:bg-black/5 hover:text-paper-ink"
                                }`}
                            >
                                <Icon size={15} weight={tool.active ? "bold" : "regular"} />
                            </span>
                        );
                    })}
                </div>

                <div className="min-w-0">
                    <div className="mb-3 flex items-baseline justify-between gap-4 text-[12px]">
                        <p className="font-medium text-paper-muted">Blog post</p>
                        <p className="text-paper-muted/80">1200 × 630</p>
                    </div>

                    <div className="og-canvas relative aspect-[1200/630] w-full overflow-hidden bg-[#0b0b0b] text-white">
                        <div className="flex h-full flex-col justify-between px-[5.5cqw] py-[4.6cqw]">
                            <div className="flex items-center justify-between gap-[4cqw]">
                                <p className="font-pixel text-[clamp(8px,1.9cqw,13px)] tracking-[-0.01em]">
                                    ogimg.in
                                </p>
                                <p className="text-[clamp(8px,1.55cqw,11px)] text-white/50">Field notes — 04</p>
                            </div>

                            <div className="flex flex-1 items-center">
                                <div className="og-selection relative w-[90%]">
                                    {/* Selection chrome around the live text. */}
                                    <div aria-hidden="true" className="og-selection-chrome pointer-events-none absolute -inset-[1.6cqw] border border-white/90">
                                        <span className="absolute -left-px -top-px h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 bg-white" />
                                        <span className="absolute -right-px -top-px h-[7px] w-[7px] -translate-y-1/2 translate-x-1/2 bg-white" />
                                        <span className="absolute -bottom-px -left-px h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 bg-white" />
                                        <span className="absolute -bottom-px -right-px h-[7px] w-[7px] translate-x-1/2 translate-y-1/2 bg-white" />
                                    </div>

                                    <div aria-hidden="true" className="pointer-events-none absolute -top-[30px] left-0 flex items-center gap-2">
                                        <span className="rounded-[2px] bg-white px-1.5 py-[3px] text-[10px] font-semibold leading-none text-[#0b0b0b]">
                                            Headline
                                        </span>
                                        <span className="text-[10px] text-white/45">Playfair Display</span>
                                    </div>

                                    <textarea
                                        ref={textareaRef}
                                        aria-label="Edit the sample poster headline"
                                        value={headline}
                                        onChange={(event) => setHeadline(event.target.value)}
                                        rows={2}
                                        maxLength={64}
                                        spellCheck={false}
                                        className="og-canvas-headline"
                                        style={{ fontSize: headlineSize }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-end justify-between gap-[4cqw]">
                                <p className="max-w-[44ch] text-[clamp(9px,1.75cqw,12px)] leading-[1.4] text-white/55">
                                    A canvas for the image that shows up when someone shares your work.
                                </p>
                                <p className="shrink-0 text-[clamp(9px,1.65cqw,11px)] text-white/80">
                                    Read the note
                                    <ArrowUpRight className="ml-1 inline-block" size={10} weight="bold" />
                                </p>
                            </div>
                        </div>

                        <div
                            aria-hidden="true"
                            className="og-cursor pointer-events-none absolute right-[2%] top-[42%] z-20 flex flex-row-reverse items-start"
                        >
                            <svg width="19" height="21" viewBox="0 0 19 21" fill="none" aria-hidden="true">
                                <path
                                    d="M1.2 1.2L1.2 16.1L5.4 12.1L8.1 19.2L11.3 17.8L8.7 10.9L14.7 10.6L1.2 1.2Z"
                                    fill="white"
                                    stroke="#0b0b0b"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="mr-2 rounded-[3px] bg-white px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[#0b0b0b]">
                                you
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <p className="inline-flex items-center gap-1.5 text-[12.5px] text-paper-muted">
                            <CursorClick size={14} weight="bold" aria-hidden="true" />
                            The canvas is live — click the headline and type.
                        </p>

                        {edited ? (
                            <button
                                type="button"
                                onClick={() => setHeadline(DEFAULT_HEADLINE)}
                                className="pressable inline-flex items-center gap-1.5 text-[12.5px] font-medium text-paper-ink underline decoration-paper-ink/30 underline-offset-4 transition-colors hover:decoration-paper-ink focus-visible:outline-paper-ink"
                            >
                                <ArrowCounterClockwise size={13} weight="bold" aria-hidden="true" />
                                Reset
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
