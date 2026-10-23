import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { TEMPLATE_LIBRARY, getTemplateById } from "../templates/templateRegistry";
import { Reveal } from "./landingPrimitives";
import TemplateScrollDeck from "./TemplateScrollDeck";

/**
 * The newest additions to the library, led by the Aurora batch: glowing arcs,
 * colour fields, and lit plates. They render through the same components the
 * editor uses, so the showcase is the real output rather than a screenshot.
 */
const SHOWCASE_TEMPLATE_IDS = [
    "arc",
    "cyan-rim",
    "solar-mesh",
    "prism-frame",
    "facet-field",
    "arch-glow",
    "dusk",
    "horizon-bloom",
] as const;

const SHOWCASE_TEMPLATES = SHOWCASE_TEMPLATE_IDS.map((id) => getTemplateById(id));

export default function TemplateShowcase() {
    return (
        <section id="templates" className="scroll-mt-20 bg-background">
            <div className="shell pb-12 pt-24 md:pb-16 md:pt-32">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                    <Reveal className="max-w-[820px]">
                        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                            Latest additions
                        </p>
                        <h2 className="text-[clamp(2.25rem,5.2vw,4.5rem)] font-semibold leading-[0.91] tracking-[-0.055em] text-foreground">
                            <span className="block">Borrow a layout.</span>
                            <span className="block">Make it yours.</span>
                        </h2>
                    </Reveal>

                    <Reveal delay={0.08} className="shrink-0 lg:max-w-[410px] lg:pb-2">
                        <p className="text-pretty text-[16px] leading-[1.55] text-muted-foreground md:text-[17px]">
                            The newest layouts, rendered live: aurora washes, lit arches, and colour fields.
                            Scroll to bring each one into focus, then change the words, swap the type, or move
                            every layer.
                        </p>
                        <Link
                            href="/template-gallery"
                            className="group pressable mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[14px] font-semibold text-brand-ink hover:bg-brand-strong focus-visible:outline-offset-4"
                        >
                            Browse all {TEMPLATE_LIBRARY.length} templates
                            <ArrowUpRight
                                size={15}
                                weight="bold"
                                className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </Link>
                    </Reveal>
                </div>
            </div>

            <TemplateScrollDeck templates={SHOWCASE_TEMPLATES} />
        </section>
    );
}
