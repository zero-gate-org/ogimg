import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

const GUIDE_LINKS = [
    {
        href: "/learn/what-is-an-open-graph-image",
        label: "What is an Open Graph image?",
        description: "The definition, where the card appears, and why some links show nothing.",
    },
    {
        href: "/learn/open-graph-image-size",
        label: "The right size: 1200 x 630",
        description: "Dimensions, safe areas, and the crops each platform applies.",
    },
    {
        href: "/learn/open-graph-meta-tags",
        label: "The tags, line by line",
        description: "Every meta tag that controls the card, with copy-ready examples.",
    },
];

const FACTS = [
    { label: "Canvas", value: "1200 x 630" },
    { label: "Ratio", value: "1.91:1" },
    { label: "File size", value: "Under 1 MB" },
    { label: "Safe area", value: "64 px inset" },
];

/**
 * The homepage's definition block.
 *
 * A generator page can rank for "open graph image generator" without ever
 * explaining the noun. This section gives the head term a plain answer, a set
 * of numbers, and three links into the guide cluster, while staying short
 * enough not to push the product below the fold.
 */
export default function LearnTeaser() {
    return (
        <section id="learn" aria-labelledby="learn-heading" className="scroll-mt-20 border-y border-border bg-surface-sunken">
            <div className="shell grid gap-10 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Start with the definition
                    </p>
                    <h2
                        id="learn-heading"
                        className="mt-4 max-w-[20ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[40px]"
                    >
                        What is an Open Graph image?
                    </h2>
                    <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.75] text-muted-foreground md:text-[15.5px]">
                        An Open Graph image, also called an OG image, is the card that appears when someone shares a
                        link on X, LinkedIn, Discord, Slack, Facebook, or iMessage. The page points to it with an{" "}
                        <code className="border border-border bg-background px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
                            og:image
                        </code>{" "}
                        meta tag, and the platform fetches that file to build the preview.
                    </p>
                    <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.75] text-muted-foreground md:text-[15.5px]">
                        When the tag is missing, relative, or pointed at a file behind a login, the platform falls
                        back to a random image or a plain text link. That is the difference between a share that
                        looks designed and one that disappears.
                    </p>
                    <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.75] text-muted-foreground md:text-[15.5px]">
                        ogimg.in is a free Open Graph image generator: 45 templates, a full canvas, and exports at
                        the size each platform expects. Nothing is uploaded.
                    </p>

                    <dl className="mt-7 grid max-w-[34rem] grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
                        {FACTS.map((fact) => (
                            <div key={fact.label} className="bg-background px-3 py-3">
                                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                                    {fact.label}
                                </dt>
                                <dd className="mt-1 text-[12.5px] font-medium leading-snug text-foreground">
                                    {fact.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="self-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Read the guide
                    </p>
                    <ul className="mt-3 border-t border-border">
                        {GUIDE_LINKS.map((link) => (
                            <li key={link.href} className="border-b border-border">
                                <Link
                                    href={link.href}
                                    className="group flex items-start justify-between gap-4 py-4 transition-colors hover:text-foreground"
                                >
                                    <span>
                                        <span className="block text-[15px] font-medium text-foreground">
                                            {link.label}
                                        </span>
                                        <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
                                            {link.description}
                                        </span>
                                    </span>
                                    <ArrowRight
                                        size={14}
                                        className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/learn"
                        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground link-underline"
                    >
                        All Open Graph guides
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
