import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import FeatureScene from "../iso/features/FeatureScene";
import type { SceneId } from "../iso/features/generated/scenes.generated";
import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./landingPrimitives";

/**
 * Every cell is a real machine from the isometric kit: the layer stack is a
 * vacuum sheet stacker, snapping is an XY cross-slide homing to zero, type is a
 * letterpress composing stick, sizes is a trim station, and local work is a
 * sealed archive drawer. The copy stays out of the way of the drawing.
 */
type Capability = {
    id: SceneId;
    index: string;
    title: string;
    body: string;
    span: string;
    row?: boolean;
    pad: string;
    titleClass: string;
    bodyClass: string;
    copyClass: string;
};

const CAPABILITIES: Capability[] = [
    {
        id: "layers",
        index: "01",
        title: "Layer stack",
        body: "Text, shapes, and images in a reorderable list. Hide, lock, duplicate, or delete without touching the canvas.",
        span: "md:col-span-2 xl:row-span-2",
        pad: "p-6 md:p-8",
        titleClass: "text-[19px] leading-tight tracking-[-0.02em] md:text-[22px]",
        bodyClass: "mt-2 max-w-[42ch] text-[13.5px] leading-relaxed md:text-[14px]",
        copyClass: "",
    },
    {
        id: "snap",
        index: "02",
        title: "Snap guides",
        body: "Drag any element and it settles onto canvas centers and the edges of other layers.",
        span: "",
        pad: "p-5",
        titleClass: "text-[15px] leading-tight tracking-[-0.01em]",
        bodyClass: "mt-2 max-w-[32ch] text-[13px] leading-relaxed",
        copyClass: "",
    },
    {
        id: "type",
        index: "03",
        title: "Type controls",
        body: "Seventeen self-hosted fonts, plus weight, size, line height, letter spacing, alignment, and capitals.",
        span: "",
        pad: "p-5",
        titleClass: "text-[15px] leading-tight tracking-[-0.01em]",
        bodyClass: "mt-2 max-w-[32ch] text-[13px] leading-relaxed",
        copyClass: "",
    },
    {
        id: "sizes",
        index: "04",
        title: "Platform sizes",
        body: "Open Graph, LinkedIn, YouTube, Product Hunt, posts, and stories. Change the size and every layer rescales.",
        span: "md:col-span-2 xl:col-span-2",
        row: true,
        pad: "p-5 md:p-6",
        titleClass: "text-[15px] leading-tight tracking-[-0.01em]",
        bodyClass: "mt-2 max-w-[34ch] text-[13px] leading-relaxed",
        copyClass: "md:w-[44%] md:shrink-0 md:pr-0",
    },
    {
        id: "local",
        index: "05",
        title: "Nothing leaves the tab",
        body: "Rendering, fonts, and exports all run locally. No account, no upload, no watermark.",
        span: "md:col-span-2 xl:col-span-4",
        row: true,
        pad: "p-5 md:p-8",
        titleClass: "text-[16px] leading-tight tracking-[-0.015em] md:text-[17px]",
        bodyClass: "mt-2 max-w-[40ch] text-[13px] leading-relaxed md:text-[14px]",
        copyClass: "md:w-[46%] md:shrink-0 md:pr-0 xl:w-[30%]",
    },
];

export default function EditorShowcase() {
    return (
        <section id="canvas" className="scroll-mt-20 border-b border-border py-20 md:py-28">
            <div className="shell">
                <SectionHeading
                    eyebrow="The editor"
                    title="Granular control, start to finish"
                    body="Templates decide the layout. The free canvas hands you every layer, every number, and every pixel."
                />

                <RevealGroup className="mt-12 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-[20rem_20rem_16rem]">
                    {CAPABILITIES.map((capability) => (
                        <RevealItem
                            key={capability.id}
                            className={`group relative flex min-w-0 flex-col overflow-hidden bg-surface transition-colors duration-500 hover:bg-[#0e0e0e] ${capability.row ? "md:flex-row" : ""} ${capability.span}`}
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute right-5 top-5 z-20 font-mono text-[10px] tabular-nums tracking-[0.18em] text-muted-foreground/45 md:right-6 md:top-6"
                            >
                                {capability.index}
                            </span>

                            <div className={`relative z-10 flex flex-col ${capability.pad} ${capability.copyClass}`}>
                                <h3 className={`pr-8 font-semibold text-foreground ${capability.titleClass}`}>
                                    {capability.title}
                                </h3>
                                <p className={`text-muted-foreground ${capability.bodyClass}`}>{capability.body}</p>
                            </div>

                            <FeatureScene
                                id={capability.id}
                                className={capability.row ? "bento-art-row" : "bento-art"}
                            />
                        </RevealItem>
                    ))}
                </RevealGroup>

                <Reveal className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                        href="/studio"
                        className="group pressable inline-flex h-11 items-center gap-2 bg-brand px-5 text-[14px] font-semibold text-brand-ink hover:bg-brand-strong"
                    >
                        Open the canvas
                        <ArrowRight
                            size={15}
                            weight="bold"
                            className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                        />
                    </Link>
                    <p className="text-[13px] text-muted-foreground">
                        Your work is kept in this browser, so you can close the tab and come back.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
