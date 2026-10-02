"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import SocialPreview from "./SocialPreview";
import type { EditorDocument } from "../../lib/editor/types";

/**
 * Pulls sensible starting values for the share metadata out of the design, so
 * opening the drawer shows the copy that is already on the card.
 */
export const derivePreviewMeta = (design: EditorDocument) => {
    if (design.kind === "template") {
        return {
            title: design.fields.title.trim(),
            description: design.fields.tag.trim(),
            url: "https://your-site.com/blog/launch",
        };
    }

    const textLayers = design.layers
        .filter((layer) => layer.kind === "text" && layer.text.trim().length > 0)
        .sort((a, b) => (a.kind === "text" && b.kind === "text" ? b.fontSize - a.fontSize : 0));

    const headline = textLayers[0];
    const support = textLayers[1];

    return {
        title: headline && headline.kind === "text" ? headline.text.split("\n")[0].trim() : "",
        description: support && support.kind === "text" ? support.text.trim() : "",
        url: "https://your-site.com/blog/launch",
    };
};

function PreviewPanel({ design, onClose }: { design: EditorDocument; onClose: () => void }) {
    const [meta, setMeta] = useState(() => derivePreviewMeta(design));
    const reduce = useReducedMotion();
    const size = design.kind === "free" ? `${design.width} x ${design.height}` : "1200 x 630";

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Preview this card in link previews"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: 24 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full w-full max-w-[720px] flex-col border-l border-border bg-surface"
        >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-3.5">
                <div>
                    <h2 className="text-[14px] font-semibold text-foreground">Preview</h2>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {size} &middot; rendered live from this canvas
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close preview"
                    className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                >
                    <X size={15} />
                </button>
            </header>

            <div className="scroll-y min-h-0 flex-1 bg-background px-5 py-5">
                <SocialPreview
                    document={design}
                    title={meta.title}
                    description={meta.description}
                    url={meta.url}
                    cardWidth={560}
                    onTitleChange={(title) => setMeta((current) => ({ ...current, title }))}
                    onDescriptionChange={(description) =>
                        setMeta((current) => ({ ...current, description }))
                    }
                    onUrlChange={(url) => setMeta((current) => ({ ...current, url }))}
                />
            </div>
        </motion.div>
    );
}

/**
 * Slide-over preview.
 *
 * The editor keeps rendering behind the overlay, so the card, the share fields,
 * and the head tags all stay live while the user edits them.
 */
export default function PreviewDrawer({
    design,
    open,
    onClose,
}: {
    design: EditorDocument;
    open: boolean;
    onClose: () => void;
}) {
    const panelRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef(onClose);

    useEffect(() => {
        closeRef.current = onClose;
    });

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeRef.current();
        };

        const previousOverflow = globalThis.document.body.style.overflow;
        globalThis.document.body.style.overflow = "hidden";
        panelRef.current?.focus();

        // Captured on the document so Escape closes the drawer no matter which
        // field inside it currently holds focus.
        globalThis.document.addEventListener("keydown", onKeyDown, true);

        return () => {
            globalThis.document.body.style.overflow = previousOverflow;
            globalThis.document.removeEventListener("keydown", onKeyDown, true);
        };
    }, [open]);

    return (
        <AnimatePresence>
            {open ? (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <motion.button
                        type="button"
                        aria-label="Close preview"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 cursor-default bg-black/70"
                    />

                    <div ref={panelRef} tabIndex={-1} className="relative h-full w-full max-w-[720px] outline-none">
                        <PreviewPanel design={design} onClose={onClose} />
                    </div>
                </div>
            ) : null}
        </AnimatePresence>
    );
}