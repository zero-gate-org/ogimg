import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Reveal } from "./landingPrimitives";

/**
 * Three step flow on a hairline timeline. Labels are the actions themselves,
 * not "Step 1"; the index is a mono digit that brightens on hover.
 */
const STEPS = [
    {
        verb: "Pick a base",
        body: "Open a template when the layout is already right, or start on an empty canvas when it is not.",
    },
    {
        verb: "Tune the details",
        body: "Set copy, fonts, colours, and layer positions. Save the result as a project or a brand kit.",
    },
    {
        verb: "Export and paste",
        body: "Download PNG, JPEG, or WebP, then copy the head tags from the preview panel into your page.",
    },
];

export default function Workflow() {
    return (
        <section className="scroll-mt-20 border-b border-border py-20 md:py-28">
            <div className="shell">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <Reveal className="max-w-[46ch]">
                        <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[40px]">
                            Three steps, no handoff
                        </h2>
                    </Reveal>
                    <Reveal>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            Templates → layers → export
                        </p>
                    </Reveal>
                </div>

                <ol className="mt-12 grid gap-px border border-border bg-border md:grid-cols-3">
                    {STEPS.map((step, index) => (
                        <li
                            key={step.verb}
                            className="group bg-surface p-6 transition-colors duration-200 hover:bg-surface-raised"
                        >
                            <p className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                {String(index + 1).padStart(2, "0")}
                            </p>
                            <h3 className="mt-3 text-[15px] font-semibold text-foreground">{step.verb}</h3>
                            <p className="mt-2 max-w-[38ch] text-[13px] leading-relaxed text-muted-foreground">
                                {step.body}
                            </p>
                        </li>
                    ))}
                </ol>

                <Reveal className="mt-8">
                    <Link
                        href="/studio"
                        className="group inline-flex items-center gap-2 text-[13px] font-medium text-foreground link-underline"
                    >
                        Open the canvas
                        <ArrowRight
                            size={14}
                            className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                        />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
