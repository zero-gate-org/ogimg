"use client";

import { PressFigure } from "../iso/press/react";
import { DocumentPreview, HERO_DOCUMENT } from "./LiveCard";

/**
 * The hero stage: an anatomy-style figure card whose interior is filled by
 * `PressFigure` — an isometric composing press explaining how a template plus
 * layers becomes a finished OG image, with the real live-rendered product card
 * landing on its output tray.
 */
export default function HeroFigureCard() {
    return (
        <div className="relative border border-border bg-surface" data-hero-card>
            {/* Figure frame header */}
            <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5 md:px-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Fig. 01 <span className="mx-2 text-border-strong">—</span>
                    <span className="text-foreground">The og pipeline</span>
                </p>
                <p className="hidden font-mono text-[11px] text-muted-foreground sm:block">
                    1200 × 630 — composed live
                </p>
            </div>

            {/* Figure body: the isometric press; the live card prints on its tray */}
            <div className="relative px-4 pt-4 md:px-6 md:pt-6">
                <div className="mx-auto max-w-[620px]">
                    <PressFigure>
                        <DocumentPreview document={HERO_DOCUMENT} maxWidth={560} />
                    </PressFigure>
                </div>
            </div>

            {/* Figure frame footer: live press phase left, artifact right */}
            <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2.5 md:px-5">
                <p className="font-mono text-[11px] text-muted-foreground">
                    Press:{" "}
                    <span data-readout className="text-foreground">
                        ready
                    </span>
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                    Output: <span className="text-foreground">og-image-1200x630.png</span>
                </p>
            </div>
        </div>
    );
}
