import Link from "next/link";
import type { ReactNode } from "react";
import { CaretLeft } from "@phosphor-icons/react/ssr";
import { LEGAL_LAST_UPDATED, LEGAL_PAGES } from "../../lib/legal";
import { Reveal } from "../landing/landingPrimitives";

/**
 * Shell shared by the legal documents. They are read once, in full, usually
 * while something has gone wrong, so the column stays narrow, the sections are
 * numbered for reference, and every other policy is one click away.
 */
export function LegalDocument({
    title,
    summary,
    currentHref,
    children,
}: {
    title: string;
    summary: string;
    currentHref: string;
    children: ReactNode;
}) {
    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
                <div className="shell flex h-16 items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <CaretLeft size={14} />
                        Home
                    </Link>
                    <span className="font-mono text-[11px] text-muted-foreground">
                        Updated {LEGAL_LAST_UPDATED}
                    </span>
                </div>
            </header>

            <main className="shell max-w-[62rem] py-14 md:py-20">
                <Reveal>
                    <h1 className="text-[34px] font-semibold leading-[1.06] tracking-[-0.04em] text-foreground md:text-[46px]">
                        {title}
                    </h1>
                    <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground md:text-[16px]">
                        {summary}
                    </p>
                </Reveal>

                <Reveal delay={0.06} className="mt-12 space-y-10">
                    {children}
                </Reveal>
            </main>

            <OtherPolicies currentHref={currentHref} />
        </div>
    );
}

function OtherPolicies({ currentHref }: { currentHref: string }) {
    const others = LEGAL_PAGES.filter((page) => page.href !== currentHref);

    return (
        <section className="border-t border-border bg-surface-sunken">
            <div className="shell max-w-[62rem] py-12">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Other policies
                </h2>
                {/* Hairline grid: the gap shows the border colour through. */}
                <ul className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-3">
                    {others.map((page) => (
                        <li key={page.href} className="bg-background">
                            <Link
                                href={page.href}
                                className="flex h-full flex-col gap-1.5 p-5 transition-colors duration-200 hover:bg-surface-raised"
                            >
                                <span className="text-[14px] font-medium text-foreground">{page.label}</span>
                                <span className="text-[13px] leading-relaxed text-muted-foreground">
                                    {page.summary}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export function LegalSection({
    index,
    title,
    children,
}: {
    index: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="border-t border-border pt-8">
            <h2 className="flex items-baseline gap-3 text-[19px] font-semibold tracking-[-0.025em] text-foreground md:text-[21px]">
                <span className="font-mono text-[12px] font-normal text-muted-foreground">{index}</span>
                {title}
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-muted-foreground">{children}</div>
        </section>
    );
}

export function LegalList({ items }: { items: ReactNode[] }) {
    return (
        <ul className="space-y-3 border-l border-border pl-4">
            {items.map((item, index) => (
                <li key={index} className="text-[15px] leading-[1.7] text-muted-foreground">
                    {item}
                </li>
            ))}
        </ul>
    );
}

export function LegalLink({ href, children }: { href: string; children: ReactNode }) {
    if (href.startsWith("http")) {
        return (
            <a href={href} target="_blank" rel="noreferrer" className="link-underline text-foreground">
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className="link-underline text-foreground">
            {children}
        </Link>
    );
}