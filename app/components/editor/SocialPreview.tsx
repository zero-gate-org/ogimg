"use client";

import { useState } from "react";
import { CheckCircle, Copy, Globe, XLogo } from "@phosphor-icons/react";
import FreeCanvasRender from "./FreeCanvasRender";
import ScaledCanvas from "./ScaledCanvas";
import TemplateRender from "./TemplateRender";
import type { EditorDocument } from "../../lib/editor/types";

type SurfaceId = "x" | "linkedin" | "discord" | "slack";

const SURFACES: { id: SurfaceId; label: string; note: string; ratio: number }[] = [
    { id: "x", label: "X", note: "summary_large_image card", ratio: 1.91 },
    { id: "linkedin", label: "LinkedIn", note: "feed card ratio", ratio: 1.91 },
    { id: "discord", label: "Discord", note: "embed after a link", ratio: 1.9 },
    { id: "slack", label: "Slack", note: "unfurl preview", ratio: 1.75 },
];

const CARD_IMAGE_MAX_HEIGHT = 300;

function CanvasThumb({ document, maxWidth }: { document: EditorDocument; maxWidth: number }) {
    const width = document.kind === "free" ? document.width : 1200;
    const height = document.kind === "free" ? document.height : 630;

    return (
        <ScaledCanvas
            width={width}
            height={height}
            maxWidth={maxWidth}
            maxHeight={CARD_IMAGE_MAX_HEIGHT}
        >
            {document.kind === "free" ? (
                <FreeCanvasRender document={document} />
            ) : (
                <TemplateRender document={document} />
            )}
        </ScaledCanvas>
    );
}

/**
 * Shows the card the way each platform renders a link preview, so a user can
 * judge the exported image in context instead of in isolation.
 */
export default function SocialPreview({
    document,
    title,
    description,
    url,
    onTitleChange,
    onDescriptionChange,
    onUrlChange,
    compact = false,
    cardWidth = 460,
}: {
    document: EditorDocument;
    title: string;
    description: string;
    url: string;
    onTitleChange?: (value: string) => void;
    onDescriptionChange?: (value: string) => void;
    onUrlChange?: (value: string) => void;
    compact?: boolean;
    /** Width of the simulated card. Thumb sizes are derived from it. */
    cardWidth?: number;
}) {
    const [surface, setSurface] = useState<SurfaceId>("x");
    const [copied, setCopied] = useState(false);

    const editable = Boolean(onTitleChange);
    const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "") || "your-site.com";
    const metaTags = [
        `<meta property="og:image" content="${url.startsWith("http") ? url : `https://${host}/og.png`}" />`,
        `<meta property="og:image:width" content="${document.kind === "free" ? document.width : 1200}" />`,
        `<meta property="og:image:height" content="${document.kind === "free" ? document.height : 630}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
    ].join("\n");

    const designWidth = document.kind === "free" ? document.width : 1200;
    const designHeight = document.kind === "free" ? document.height : 630;
    const designRatio = designWidth / designHeight;
    const surfaceRatio = SURFACES.find((entry) => entry.id === surface)?.ratio ?? 1.91;

    // A card this far from the platform ratio gets cropped or letterboxed, so
    // say so rather than letting the user assume the preview is exact.
    const cropNote =
        Math.abs(designRatio - surfaceRatio) / surfaceRatio > 0.12
            ? `Your ${designWidth} x ${designHeight} canvas is ${designRatio > surfaceRatio ? "wider" : "taller"} than a ${surfaceRatio.toFixed(2)}:1 link card. Feeds will ${designRatio > surfaceRatio ? "crop the sides" : "letterbox or crop it"}.`
            : null;

    const copyTags = async () => {
        try {
            await navigator.clipboard.writeText(metaTags);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Preview surface">
                {SURFACES.map((entry) => (
                    <button
                        key={entry.id}
                        type="button"
                        role="tab"
                        aria-selected={surface === entry.id}
                        onClick={() => setSurface(entry.id)}
                        className={`border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                            surface === entry.id
                                ? "border-brand bg-brand text-brand-ink"
                                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
                        }`}
                    >
                        {entry.label}
                    </button>
                ))}
            </div>

            {cropNote ? (
                <p className="mb-3 border-l-2 border-brand bg-surface-raised px-3 py-2 text-[12px] leading-relaxed text-muted-foreground">
                    {cropNote}
                </p>
            ) : null}

            <div className="border border-border bg-surface-sunken p-4">
                <div className="mx-auto w-full min-w-0" style={{ maxWidth: cardWidth }}>
                    {surface === "x" ? (
                        <article className="border border-border bg-[#000000] p-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 shrink-0 border border-border bg-surface-raised" />
                                <div className="min-w-0">
                                    <p className="truncate text-[13px] font-semibold text-[#E7E9EA]">
                                        Your Product
                                    </p>
                                    <p className="truncate text-[12px] text-[#71767B]">{host}</p>
                                </div>
                            </div>
                            <div className="mt-3 overflow-hidden border border-[#2F3336]">
                                <CanvasThumb document={document} maxWidth={cardWidth - 32} />
                            </div>
                            <p className="mt-2.5 line-clamp-1 text-[14px] font-bold text-[#E7E9EA]">{title}</p>
                            <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#71767B]">
                                {description}
                            </p>
                        </article>
                    ) : null}

                    {surface === "linkedin" ? (
                        <article className="overflow-hidden border border-border bg-white text-[#000000]">
                            <div className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 shrink-0 border border-[#0000001a] bg-[#EEF1F5]" />
                                    <div className="min-w-0">
                                        <p className="truncate text-[13px] font-semibold">Your Product</p>
                                        <p className="truncate text-[12px] text-[#00000099]">1,204 followers</p>
                                    </div>
                                </div>
                                <p className="mt-3 line-clamp-2 text-[14px] leading-snug">{title}</p>
                                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-[#00000099]">
                                    {description}
                                </p>
                            </div>
                            <div className="w-full overflow-hidden bg-[#F4F2EE]">
                                <CanvasThumb document={document} maxWidth={cardWidth} />
                            </div>
                            <p className="flex items-center gap-1.5 border-t border-[#0000001a] px-4 py-2.5 text-[12px] text-[#00000099]">
                                <Globe size={13} />
                                {host}
                            </p>
                        </article>
                    ) : null}

                    {surface === "discord" ? (
                        <article className="rounded-[4px] bg-[#313338] p-4 text-[#DBDEE1]">
                            <div className="flex gap-3">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-[#5865F2]" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[14px] font-semibold text-white">
                                        Your Product
                                        <span className="ml-2 rounded bg-[#5865F2] px-1 py-0.5 text-[10px] font-bold text-white">
                                            APP
                                        </span>
                                    </p>
                                    <p className="mt-3 line-clamp-2 text-[14px] leading-snug text-[#DBDEE1]/90">
                                        {title}
                                    </p>
                                    <p className="mt-1 text-[13px] leading-relaxed text-[#949BA4]">{description}</p>
                                    <div className="mt-3 overflow-hidden rounded-[4px] bg-[#1E1F22] p-1">
                                        <div className="overflow-hidden">
                                            <CanvasThumb document={document} maxWidth={cardWidth - 64} />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-1 pt-1.5 text-[12px] text-[#949BA4]">
                                            <XLogo size={12} />
                                            {host}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-[12px] text-[#949BA4]">Shared today at 09:14</p>
                                </div>
                            </div>
                        </article>
                    ) : null}

                    {surface === "slack" ? (
                        <article className="border border-border bg-white p-4 text-[#1D1C1D]">
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-9 shrink-0 border border-[#0000001a] bg-[#F4F2EE]" />
                                <div className="min-w-0">
                                    <p className="truncate text-[13px] font-bold">Your Product</p>
                                    <p className="text-[12px] text-[#616061]">9:14 AM</p>
                                </div>
                            </div>
                            <p className="mt-3 line-clamp-2 text-[14px] leading-snug font-medium">{title}</p>
                            <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-[#616061]">
                                {description}
                            </p>
                            <div className="mt-3 flex gap-3 border-t border-[#00000014] pt-3">
                                <div className="w-[45%] shrink-0 overflow-hidden">
                                    <CanvasThumb document={document} maxWidth={Math.round(cardWidth * 0.36)} />
                                </div>
                                <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-[#616061]">
                                    <span className="block truncate font-semibold text-[#1264A3]">{host}</span>
                                    {description}
                                </p>
                            </div>
                            <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[#616061]">
                                <CheckCircle size={13} className="text-[#2BAC76]" />
                                Preview generated in your browser
                            </p>
                        </article>
                    ) : null}
                </div>
            </div>

            {editable ? (
                <div className="mt-5 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                            <span className="mb-1.5 block text-[12px] font-medium text-foreground/85">
                                Link title
                            </span>
                            <input
                                type="text"
                                value={title}
                                onChange={(event) => onTitleChange?.(event.target.value)}
                                className="w-full h-10 border border-border bg-surface-sunken px-3 text-[13px] focus:border-brand focus:outline-none"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-1.5 block text-[12px] font-medium text-foreground/85">
                                Destination URL
                            </span>
                            <input
                                type="text"
                                value={url}
                                onChange={(event) => onUrlChange?.(event.target.value)}
                                className="w-full h-10 border border-border bg-surface-sunken px-3 text-[13px] focus:border-brand focus:outline-none"
                            />
                        </label>
                    </div>
                    <label className="block">
                        <span className="mb-1.5 block text-[12px] font-medium text-foreground/85">
                            Link description
                        </span>
                        <textarea
                            value={description}
                            onChange={(event) => onDescriptionChange?.(event.target.value)}
                            rows={2}
                            className="w-full border border-border bg-surface-sunken px-3 py-2 text-[13px] leading-relaxed focus:border-brand focus:outline-none resize-y"
                        />
                    </label>

                    <div className="border border-border bg-surface-sunken p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                Head tags
                            </span>
                            <button
                                type="button"
                                onClick={copyTags}
                                className="inline-flex items-center gap-1.5 border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                            >
                                {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                        <pre className="scroll-x whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-foreground/80">
                            {metaTags}
                        </pre>
                    </div>
                </div>
            ) : null}

            {!compact ? (
                <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                    Preview is a scale render of the live canvas, so it matches the exported file exactly.
                </p>
            ) : null}
        </div>
    );
}