import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";
import { CHANGELOG_ENTRIES } from "../components/changelogData";
import { Reveal } from "../components/landing/landingPrimitives";
import { createMetadata } from "../lib/seo";

export const metadata: Metadata = createMetadata({
    title: "Changelog",
    description: "Track new features, improvements, and fixes shipped to ogimg.in.",
    path: "/changelog",
    keywords: [
        "ogimg changelog",
        "product updates",
        "release notes",
        "open graph image generator updates",
    ],
    type: "article",
});

export default function ChangelogPage() {
    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
                <div className="shell flex h-16 items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <CaretLeft size={14} />
                        Home
                    </Link>
                </div>
            </header>

            <main className="shell max-w-[62rem] py-14 md:py-20">
                <Reveal>
                    <h1 className="text-[34px] font-semibold leading-[1.06] tracking-[-0.04em] text-foreground md:text-[46px]">
                        Changelog
                    </h1>
                    <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
                        New features, improvements, and fixes, newest first.
                    </p>
                </Reveal>

                <div className="mt-12 space-y-10">
                    {CHANGELOG_ENTRIES.map((entry) => (
                        <article key={entry.version} className="border-t border-border pt-6">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                                <h2 className="font-mono text-[15px] font-semibold text-brand">{entry.version}</h2>
                                <time className="font-mono text-[11px] text-muted-foreground">{entry.date}</time>
                            </div>
                            <p className="mt-2 text-[17px] font-medium tracking-[-0.02em] text-foreground">
                                {entry.summary}
                            </p>

                            <div className="mt-6 grid gap-6 sm:grid-cols-3">
                                {entry.groups.map((group) => (
                                    <div key={group.label}>
                                        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                            {group.label}
                                        </h3>
                                        <ul className="mt-3 space-y-2">
                                            {group.items.map((item) => (
                                                <li
                                                    key={item}
                                                    className="border-l border-border pl-3 text-[13px] leading-relaxed text-muted-foreground"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}