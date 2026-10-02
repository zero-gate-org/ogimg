import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Reveal } from "./landingPrimitives";

/**
 * Three step flow, laid out as a hairline timeline rather than numbered circles.
 * Labels are the actions themselves, not "Step 1".
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
                <Reveal className="max-w-[46ch]">
                    <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[40px]">
                        Three steps, no handoff
                    </h2>
                </Reveal>

                <ol className="mt-12 grid gap-px border border-border bg-border md:grid-cols-3">
                    {STEPS.map((step) => (
                        <li key={step.verb} className="bg-surface p-6">
                            <h3 className="text-[15px] font-semibold text-foreground">{step.verb}</h3>
                            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{step.body}</p>
                        </li>
                    ))}
                </ol>

                <Reveal className="mt-8">
                    <Link
                        href="/studio"
                        className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
                    >
                        Open the canvas
                        <ArrowRight size={14} />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}