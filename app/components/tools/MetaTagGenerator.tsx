"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

type PreviewTarget = "x" | "linkedin" | "discord" | "slack";

const TARGETS: { id: PreviewTarget; label: string }[] = [
    { id: "x", label: "X" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "discord", label: "Discord" },
    { id: "slack", label: "Slack" },
];

const INITIAL = {
    title: "How to design an Open Graph image that gets clicked",
    description:
        "A practical guide to 1200 x 630 cards, safe areas, and meta tags that render correctly on every platform.",
    url: "https://example.com/blog/open-graph-images",
    image: "https://example.com/og/open-graph-images.png",
    imageAlt: "A dark Open Graph card with the headline How to design an Open Graph image that gets clicked",
    siteName: "Example Blog",
    handle: "",
    type: "article",
    card: "summary_large_image",
};

type Fields = typeof INITIAL;

function escapeAttribute(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function hostOf(value: string) {
    try {
        return new URL(value).hostname.replace(/^www\./, "");
    } catch {
        return "example.com";
    }
}

function Field({
    label,
    hint,
    value,
    onChange,
    placeholder,
    multiline = false,
    max,
}: {
    label: string;
    hint?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    max?: number;
}) {
    const over = max ? value.length > max : false;

    return (
        <label className="block">
            <span className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                </span>
                {max ? (
                    <span
                        className={`font-mono text-[10px] tabular-nums ${
                            over ? "text-destructive" : "text-muted-foreground"
                        }`}
                    >
                        {value.length}/{max}
                    </span>
                ) : null}
            </span>
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="mt-1.5 w-full resize-y border border-border bg-background px-3 py-2 text-[13.5px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-border-strong"
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="mt-1.5 h-10 w-full border border-border bg-background px-3 text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-border-strong"
                />
            )}
            {hint ? <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{hint}</span> : null}
        </label>
    );
}

function PreviewImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const failed = failedSrc === src;

    if (!src || failed) {
        return (
            <div
                className={`flex items-center justify-center bg-surface-raised font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground ${className ?? ""}`}
            >
                1200 x 630 image
            </div>
        );
    }

    return (
        // Remote URLs are user supplied, so the dimensions are fixed by CSS rather than the file.
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            onError={() => setFailedSrc(src)}
            className={`object-cover ${className ?? ""}`}
        />
    );
}

export default function MetaTagGenerator() {
    const [fields, setFields] = useState<Fields>(INITIAL);
    const [target, setTarget] = useState<PreviewTarget>("x");
    const [copied, setCopied] = useState(false);

    const set = <K extends keyof Fields>(key: K) => (value: Fields[K]) =>
        setFields((current) => ({ ...current, [key]: value }));

    const tags = useMemo(() => {
        const title = escapeAttribute(fields.title);
        const description = escapeAttribute(fields.description);
        const url = escapeAttribute(fields.url);
        const image = escapeAttribute(fields.image);
        const imageAlt = escapeAttribute(fields.imageAlt);
        const siteName = escapeAttribute(fields.siteName);
        const handle = fields.handle.trim().replace(/^@/, "");

        const lines = [
            "<!-- Open Graph -->",
            `<meta property="og:type" content="${escapeAttribute(fields.type)}" />`,
            `<meta property="og:title" content="${title}" />`,
            `<meta property="og:description" content="${description}" />`,
            `<meta property="og:url" content="${url}" />`,
            `<meta property="og:image" content="${image}" />`,
            `<meta property="og:image:width" content="1200" />`,
            `<meta property="og:image:height" content="630" />`,
            `<meta property="og:image:alt" content="${imageAlt}" />`,
            `<meta property="og:site_name" content="${siteName}" />`,
            `<meta property="og:locale" content="en_US" />`,
            "",
            "<!-- X / Twitter -->",
            `<meta name="twitter:card" content="${escapeAttribute(fields.card)}" />`,
            `<meta name="twitter:title" content="${title}" />`,
            `<meta name="twitter:description" content="${description}" />`,
            `<meta name="twitter:image" content="${image}" />`,
            `<meta name="twitter:image:alt" content="${imageAlt}" />`,
        ];

        if (handle) {
            lines.push(`<meta name="twitter:site" content="@${escapeAttribute(handle)}" />`);
            lines.push(`<meta name="twitter:creator" content="@${escapeAttribute(handle)}" />`);
        }

        return lines.join("\n");
    }, [fields]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(tags);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    };

    const host = hostOf(fields.url);
    const cardTitle = fields.title || "Your page title";
    const cardDescription = fields.description || "Your page description";
    const imageAlt = fields.imageAlt || cardTitle;

    return (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <section aria-labelledby="generator-fields" className="min-w-0">
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                    <h2 id="generator-fields" className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
                        Page details
                    </h2>
                    <button
                        type="button"
                        onClick={() => setFields(INITIAL)}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Reset
                    </button>
                </div>

                <div className="mt-5 space-y-4">
                    <Field
                        label="Page title"
                        value={fields.title}
                        onChange={set("title")}
                        max={60}
                        hint="The headline a social card shows. Aim for 60 characters or fewer."
                    />
                    <Field
                        label="Description"
                        value={fields.description}
                        onChange={set("description")}
                        multiline
                        max={200}
                        hint="One concrete sentence. X and LinkedIn truncate around 200 characters."
                    />
                    <Field
                        label="Page URL"
                        value={fields.url}
                        onChange={set("url")}
                        placeholder="https://example.com/page"
                    />
                    <Field
                        label="Image URL"
                        value={fields.image}
                        onChange={set("image")}
                        placeholder="https://example.com/og.png"
                        hint="Use an absolute URL. The tags declare 1200 x 630; if your file differs, change the width and height tags before publishing."
                    />
                    <Field
                        label="Image alt text"
                        value={fields.imageAlt}
                        onChange={set("imageAlt")}
                        hint="Describe the card for screen readers and AI crawlers."
                    />
                    <Field label="Site name" value={fields.siteName} onChange={set("siteName")} />
                    <Field
                        label="X handle (optional)"
                        value={fields.handle}
                        onChange={set("handle")}
                        placeholder="yourhandle"
                        hint="Adds twitter:site and twitter:creator. Without the @."
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Page type
                            </span>
                            <select
                                value={fields.type}
                                onChange={(event) => set("type")(event.target.value)}
                                className="mt-1.5 h-10 w-full border border-border bg-background px-2 text-[13.5px] text-foreground outline-none focus:border-border-strong"
                            >
                                <option value="website">website</option>
                                <option value="article">article</option>
                                <option value="product">product</option>
                                <option value="profile">profile</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                X card
                            </span>
                            <select
                                value={fields.card}
                                onChange={(event) => set("card")(event.target.value)}
                                className="mt-1.5 h-10 w-full border border-border bg-background px-2 text-[13.5px] text-foreground outline-none focus:border-border-strong"
                            >
                                <option value="summary_large_image">summary_large_image</option>
                                <option value="summary">summary</option>
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            <section aria-labelledby="generator-preview" className="min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                    <h2 id="generator-preview" className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
                        Live preview
                    </h2>
                    <div role="tablist" aria-label="Preview platform" className="flex gap-1">
                        {TARGETS.map((entry) => (
                            <button
                                key={entry.id}
                                type="button"
                                role="tab"
                                aria-selected={target === entry.id}
                                onClick={() => setTarget(entry.id)}
                                className={`h-7 px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                                    target === entry.id
                                        ? "bg-foreground text-background"
                                        : "border border-border text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {entry.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-5">
                    {target === "x" ? (
                        <div className="border border-border bg-background p-3">
                            <div className="flex gap-3">
                                <div className="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-surface-raised" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 text-[13px]">
                                        <span className="font-semibold text-foreground">Your account</span>
                                        <span className="text-muted-foreground">@you · now</span>
                                    </div>
                                    <p className="mt-1 text-[14px] leading-snug text-foreground">
                                        A new post with a link.
                                    </p>
                                    <div className="mt-2 overflow-hidden rounded-2xl border border-border">
                                        <PreviewImage
                                            src={fields.image}
                                            alt={imageAlt}
                                            className="aspect-[1.91/1] w-full"
                                        />
                                        <div className="px-3 py-2.5">
                                            <p className="text-[12px] text-muted-foreground">{host}</p>
                                            <p className="mt-0.5 line-clamp-2 text-[14px] font-medium leading-snug text-foreground">
                                                {cardTitle}
                                            </p>
                                            <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                                                {cardDescription}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {target === "linkedin" ? (
                        <div className="border border-border bg-background p-3">
                            <div className="flex gap-3">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-surface-raised" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold text-foreground">Your account</p>
                                    <p className="text-[11px] text-muted-foreground">1st · Just now</p>
                                    <p className="mt-2 text-[13.5px] leading-snug text-foreground">
                                        Sharing a new page.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 border border-border">
                                <PreviewImage src={fields.image} alt={imageAlt} className="aspect-[1.91/1] w-full" />
                                <div className="border-t border-border bg-surface-sunken px-3 py-2.5">
                                    <p className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-foreground">
                                        {cardTitle}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-muted-foreground">{host}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {target === "discord" ? (
                        <div className="rounded-md bg-[#313338] p-3">
                            <div className="flex gap-3">
                                <div className="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-[#5865f2]" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px]">
                                        <span className="font-semibold text-[#f2f3f5]">Your account</span>{" "}
                                        <span className="text-[#949ba4]">Today at 12:00</span>
                                    </p>
                                    <p className="mt-1 text-[14px] text-[#dbdee1]">Have a look at this page.</p>
                                    <div className="mt-2 max-w-[420px] border-l-4 border-[#5865f2] bg-[#2b2d31] p-2.5">
                                        <p className="text-[11px] text-[#dbdee1]">{fields.siteName || host}</p>
                                        <p className="mt-1 text-[14px] font-semibold leading-snug text-[#00a8fc]">
                                            {cardTitle}
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#dbdee1]">
                                            {cardDescription}
                                        </p>
                                        <PreviewImage
                                            src={fields.image}
                                            alt={imageAlt}
                                            className="mt-2 aspect-[1.91/1] w-full rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {target === "slack" ? (
                        <div className="rounded-md bg-white p-3">
                            <div className="flex gap-2.5">
                                <div className="h-9 w-9 shrink-0 rounded bg-[#e8e8e8]" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px]">
                                        <span className="font-bold text-[#1d1c1d]">Your account</span>{" "}
                                        <span className="text-[#616061]">12:00</span>
                                    </p>
                                    <p className="mt-0.5 text-[13px] text-[#1d1c1d]">Have a look at this page.</p>
                                    <div className="mt-1.5 max-w-[420px] border-l-4 border-[#e8e8e8] pl-2.5">
                                        <p className="text-[11px] font-bold text-[#1d1c1d]">
                                            {fields.siteName || host}
                                        </p>
                                        <p className="text-[13px] font-bold leading-snug text-[#1264a3]">{cardTitle}</p>
                                        <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-[#1d1c1d]">
                                            {cardDescription}
                                        </p>
                                        <PreviewImage
                                            src={fields.image}
                                            alt={imageAlt}
                                            className="mt-2 aspect-[1.91/1] w-full rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 border border-border">
                    <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-raised px-3 py-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            Paste into &lt;head&gt;
                        </p>
                        <button
                            type="button"
                            onClick={copy}
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground transition-colors hover:text-brand-strong"
                        >
                            {copied ? <Check size={13} weight="bold" /> : <Copy size={13} />}
                            {copied ? "Copied" : "Copy tags"}
                        </button>
                    </div>
                    <pre className="max-h-[340px] overflow-auto px-3 py-3 text-[11.5px] leading-[1.7] text-foreground">
                        <code className="font-mono">{tags}</code>
                    </pre>
                </div>
            </section>
        </div>
    );
}
