import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CaretRight } from "@phosphor-icons/react/ssr";
import type { ContentBlock, Source } from "../../lib/content/types";
import type { FaqEntry } from "../../lib/seo";
import { TEMPLATE_LIBRARY } from "../templates/templateRegistry";
import TemplateGalleryPreview from "../TemplateGalleryPreview";

export function slugifyHeading(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 72);
}

export function headingId(text: string, explicit?: string) {
    return explicit ?? slugifyHeading(text);
}

const INLINE_PATTERN = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g;

/**
 * Small inline syntax so content files stay readable:
 * [label](/path), `code`, and **bold**. Everything else is plain text.
 */
export function InlineText({ text }: { text: string }) {
    const parts = text.split(INLINE_PATTERN).filter((part) => part !== "");

    return (
        <>
            {parts.map((part, index) => {
                const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                if (link) {
                    const [, label, href] = link;
                    const external = /^https?:\/\//.test(href);
                    const className =
                        "font-medium text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground";

                    if (external) {
                        return (
                            <a
                                key={`${href}-${index}`}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className={className}
                            >
                                {label}
                            </a>
                        );
                    }

                    return (
                        <Link key={`${href}-${index}`} href={href} className={className}>
                            {label}
                        </Link>
                    );
                }

                if (part.startsWith("`") && part.endsWith("`")) {
                    return (
                        <code
                            key={`code-${index}`}
                            className="border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
                        >
                            {part.slice(1, -1)}
                        </code>
                    );
                }

                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <strong key={`bold-${index}`} className="font-semibold text-foreground">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }

                return <span key={`text-${index}`}>{part}</span>;
            })}
        </>
    );
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
    return (
        <div className="space-y-6">
            {blocks.map((block, index) => (
                <ContentBlockView key={`${block.type}-${index}`} block={block} />
            ))}
        </div>
    );
}

function ContentBlockView({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case "p":
            return (
                <p
                    className={
                        block.lead
                            ? "text-[17px] leading-[1.7] text-foreground md:text-[18px]"
                            : "text-[15.5px] leading-[1.8] text-muted-foreground"
                    }
                >
                    <InlineText text={block.text} />
                </p>
            );

        case "h2":
            return (
                <h2
                    id={headingId(block.text, block.id)}
                    className="scroll-mt-24 pt-4 text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[30px]"
                >
                    {block.text}
                </h2>
            );

        case "h3":
            return (
                <h3
                    id={headingId(block.text, block.id)}
                    className="scroll-mt-24 pt-2 text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] text-foreground md:text-[20px]"
                >
                    {block.text}
                </h3>
            );

        case "ul":
            return (
                <ul className="space-y-2.5">
                    {block.items.map((item, index) => (
                        <li
                            key={index}
                            className="flex gap-3 text-[15.5px] leading-[1.75] text-muted-foreground"
                        >
                            <span aria-hidden="true" className="mt-[0.62em] h-1 w-1 shrink-0 bg-border-strong" />
                            <span>
                                <InlineText text={item} />
                            </span>
                        </li>
                    ))}
                </ul>
            );

        case "ol":
            return (
                <ol className="space-y-3">
                    {block.items.map((item, index) => (
                        <li
                            key={index}
                            className="grid grid-cols-[1.75rem_1fr] gap-2 text-[15.5px] leading-[1.75] text-muted-foreground"
                        >
                            <span className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span>
                                <InlineText text={item} />
                            </span>
                        </li>
                    ))}
                </ol>
            );

        case "code":
            return (
                <figure className="border border-border bg-surface-sunken">
                    {block.label ? (
                        <figcaption className="border-b border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            {block.label}
                        </figcaption>
                    ) : null}
                    <pre className="overflow-x-auto px-4 py-4 text-[12.5px] leading-[1.7] text-foreground">
                        <code className="font-mono">{block.code.trim()}</code>
                    </pre>
                </figure>
            );

        case "table":
            return (
                <figure className="space-y-2">
                    <div className="overflow-x-auto border border-border">
                        <table className="w-full min-w-[560px] border-collapse text-left">
                            <thead>
                                <tr className="bg-surface-raised">
                                    {block.head.map((cell) => (
                                        <th
                                            key={cell}
                                            scope="col"
                                            className="border-b border-border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                                        >
                                            {cell}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {block.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border-b border-border last:border-b-0">
                                        {row.map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className={`px-4 py-3 align-top text-[13.5px] leading-relaxed ${
                                                    cellIndex === 0
                                                        ? "font-medium text-foreground"
                                                        : "text-muted-foreground"
                                                }`}
                                            >
                                                <InlineText text={cell} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {block.caption ? (
                        <figcaption className="text-[12px] leading-relaxed text-muted-foreground">
                            {block.caption}
                        </figcaption>
                    ) : null}
                </figure>
            );

        case "callout": {
            const tone = block.tone ?? "note";
            const label = tone === "tip" ? "Tip" : tone === "warning" ? "Watch out" : "Note";

            return (
                <aside
                    className={`border-l-2 py-1 pl-5 ${
                        tone === "warning" ? "border-destructive" : "border-brand"
                    }`}
                >
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {block.title ?? label}
                    </p>
                    <p className="mt-2 text-[14.5px] leading-[1.75] text-foreground/90">
                        <InlineText text={block.text} />
                    </p>
                </aside>
            );
        }

        case "quote":
            return (
                <blockquote className="border-l-2 border-border-strong pl-5">
                    <p className="text-[17px] leading-[1.65] text-foreground">
                        <InlineText text={block.text} />
                    </p>
                    {block.cite ? (
                        <cite className="mt-2 block font-mono text-[11px] not-italic text-muted-foreground">
                            {block.cite}
                        </cite>
                    ) : null}
                </blockquote>
            );

        case "links":
            return (
                <div className="not-prose">
                    {block.title ? (
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            {block.title}
                        </p>
                    ) : null}
                    <ul className="grid gap-px border border-border bg-border sm:grid-cols-2">
                        {block.items.map((item) => (
                            <li key={item.href} className="bg-background">
                                <Link
                                    href={item.href}
                                    className="group flex h-full flex-col gap-1 p-4 transition-colors hover:bg-surface-raised"
                                >
                                    <span className="flex items-center gap-1.5 text-[14px] font-medium text-foreground">
                                        {item.label}
                                        <CaretRight
                                            size={12}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </span>
                                    {item.description ? (
                                        <span className="text-[12.5px] leading-relaxed text-muted-foreground">
                                            {item.description}
                                        </span>
                                    ) : null}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case "template": {
            const exists = TEMPLATE_LIBRARY.some((template) => template.id === block.templateId);
            if (!exists) return null;

            return (
                <figure className="space-y-3">
                    <div className="border border-border bg-surface p-1.5">
                        <TemplateGalleryPreview
                            templateId={block.templateId as Parameters<typeof TemplateGalleryPreview>[0]["templateId"]}
                            maxWidth={1200}
                        />
                    </div>
                    {block.caption ? (
                        <figcaption className="text-[12.5px] leading-relaxed text-muted-foreground">
                            {block.caption}
                        </figcaption>
                    ) : null}
                </figure>
            );
        }

        case "divider":
            return <hr className="border-border" />;

        default:
            return null;
    }
}

export function KeyFacts({ facts }: { facts: { label: string; value: string }[] }) {
    return (
        <dl className="grid gap-px border border-border bg-border sm:grid-cols-3">
            {facts.map((fact) => (
                <div key={fact.label} className="bg-background px-4 py-3.5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {fact.label}
                    </dt>
                    <dd className="mt-1 text-[14px] font-medium leading-snug text-foreground">
                        <InlineText text={fact.value} />
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export function QuickAnswer({ text }: { text: string }) {
    return (
        <div className="border-l-2 border-brand bg-surface-sunken px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                The short answer
            </p>
            <p className="mt-2 text-[15.5px] leading-[1.75] text-foreground">
                <InlineText text={text} />
            </p>
        </div>
    );
}

export type Breadcrumb = { name: string; href: string };

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
    return (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5">
            {items.map((item, index) => {
                const last = index === items.length - 1;
                return (
                    <span key={item.href} className="flex items-center gap-1.5">
                        {index > 0 ? (
                            <CaretRight size={10} aria-hidden="true" className="text-muted-foreground" />
                        ) : null}
                        {last ? (
                            <span aria-current="page" className="text-[12px] text-muted-foreground">
                                {item.name}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {item.name}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

export function TableOfContents({
    items,
}: {
    items: { id: string; label: string }[];
}) {
    if (items.length < 3) return null;

    return (
        <details className="border border-border bg-surface-sunken lg:open:border-border" open>
            <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                On this page
            </summary>
            <ol className="space-y-1.5 border-t border-border px-4 py-3">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className="block text-[12.5px] leading-snug text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ol>
        </details>
    );
}

export function FaqList({ faqs }: { faqs: FaqEntry[] }) {
    if (!faqs.length) return null;

    return (
        <section aria-labelledby="faq-heading" className="mt-14 border-t border-border pt-10">
            <h2
                id="faq-heading"
                className="text-[24px] font-semibold tracking-[-0.03em] text-foreground md:text-[28px]"
            >
                Frequently asked questions
            </h2>
            <div className="mt-5 divide-y divide-border border-y border-border">
                {faqs.map((faq) => (
                    <details key={faq.question} className="group">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-[15px] font-medium text-foreground">
                            <span>{faq.question}</span>
                            <span
                                aria-hidden="true"
                                className="mt-0.5 font-mono text-[16px] leading-none text-muted-foreground transition-transform group-open:rotate-45"
                            >
                                +
                            </span>
                        </summary>
                        <p className="pb-4 pr-8 text-[14.5px] leading-[1.75] text-muted-foreground">
                            <InlineText text={faq.answer} />
                        </p>
                    </details>
                ))}
            </div>
        </section>
    );
}

export function AuthorBox({ updated, readingTime }: { updated: string; readingTime: number }) {
    return (
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-[13px] font-medium text-foreground">
                    Written and maintained by GxAditya
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    The person who builds ogimg.in. Last updated{" "}
                    <time dateTime={updated}>{formatDate(updated)}</time>. {readingTime} min read.
                </p>
            </div>
            <Link
                href="/about"
                className="link-underline shrink-0 text-[12px] font-medium text-muted-foreground hover:text-foreground"
            >
                About the project
            </Link>
        </div>
    );
}

export function Sources({ sources }: { sources: Source[] }) {
    if (!sources.length) return null;

    return (
        <section aria-labelledby="sources-heading" className="mt-10 border-t border-border pt-6">
            <h2
                id="sources-heading"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
            >
                Sources and further reading
            </h2>
            <ul className="mt-3 space-y-2">
                {sources.map((source) => (
                    <li key={source.href}>
                        <a
                            href={source.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[13px] leading-relaxed text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                        >
                            {source.label}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function RelatedLinks({
    title = "Keep reading",
    links,
}: {
    title?: string;
    links: { href: string; title: string; description: string }[];
}) {
    if (!links.length) return null;

    return (
        <section aria-labelledby="related-heading" className="mt-14">
            <h2
                id="related-heading"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
            >
                {title}
            </h2>
            <ul className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2">
                {links.map((link) => (
                    <li key={link.href} className="bg-background">
                        <Link
                            href={link.href}
                            className="group flex h-full flex-col gap-1.5 p-5 transition-colors hover:bg-surface-raised"
                        >
                            <span className="flex items-start justify-between gap-3 text-[15px] font-medium text-foreground">
                                {link.title}
                                <ArrowRight
                                    size={14}
                                    className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                                />
                            </span>
                            <span className="text-[13px] leading-relaxed text-muted-foreground">
                                {link.description}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function CtaPanel({
    title = "Make the image, then copy the tags",
    body = "Start from a template or a blank canvas. Export a 1200 x 630 PNG, JPEG, or WebP, and copy the Open Graph tags from the preview panel.",
    primary = { href: "/studio", label: "Open the canvas" },
    secondary = { href: "/template-gallery", label: "Browse templates" },
}: {
    title?: string;
    body?: string;
    primary?: { href: string; label: string };
    secondary?: { href: string; label: string };
}) {
    return (
        <section className="mt-14 border border-border bg-surface-sunken p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Free, no account
            </p>
            <h2 className="mt-3 max-w-[24ch] text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[30px]">
                {title}
            </h2>
            <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-muted-foreground">{body}</p>
            <div className="mt-5 flex flex-wrap gap-3">
                <Link
                    href={primary.href}
                    className="pressable inline-flex h-11 items-center gap-2 bg-brand px-5 text-[13px] font-semibold text-brand-ink hover:bg-brand-strong"
                >
                    {primary.label}
                    <ArrowRight size={14} weight="bold" />
                </Link>
                <Link
                    href={secondary.href}
                    className="pressable inline-flex h-11 items-center border border-border bg-surface px-5 text-[13px] font-medium text-foreground hover:border-border-strong"
                >
                    {secondary.label}
                </Link>
            </div>
        </section>
    );
}

export function PageTitle({
    eyebrow,
    title,
    description,
    meta,
}: {
    eyebrow?: string;
    title: ReactNode;
    description?: string;
    meta?: ReactNode;
}) {
    return (
        <header className="max-w-[64ch]">
            {eyebrow ? (
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {eyebrow}
                </p>
            ) : null}
            <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground md:text-[48px]">
                {title}
            </h1>
            {description ? (
                <p className="mt-4 max-w-[60ch] text-[15.5px] leading-[1.7] text-muted-foreground md:text-[16.5px]">
                    {description}
                </p>
            ) : null}
            {meta ? <div className="mt-5">{meta}</div> : null}
        </header>
    );
}

export function formatDate(iso: string) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${iso}T00:00:00Z`));
}
