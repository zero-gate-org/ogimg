"use client";

import { useEffect, useState } from "react";
import type { FreeDocument, Layer } from "../../lib/editor/types";
import {
    DEFAULT_CANVAS_BACKGROUND,
    createImageLayer,
    createShapeLayer,
    createTextLayer,
} from "../../lib/editor/factories";
import FreeCanvasRender from "../editor/FreeCanvasRender";
import ScaledCanvas from "../editor/ScaledCanvas";

/**
 * A small, real document built with the same layer types the editor writes, so
 * the hero card is rendered by the shipping canvas code rather than a mock-up.
 */
const HERO_DOCUMENT: FreeDocument = {
    kind: "free",
    id: "hero-demo",
    name: "Hero preview",
    width: 1200,
    height: 630,
    background: {
        ...DEFAULT_CANVAS_BACKGROUND,
        mode: "gradient",
        color: "#0B0B0D",
        gradientStart: "#1D4ED8",
        gradientEnd: "#0B0B0D",
        gradientAngle: 138,
        presetId: "studio-sky",
        overlay: "grid",
        overlayColor: "#BFDBFE",
        overlayOpacity: 0.16,
        overlayBlur: 0.4,
        noise: true,
    },
    layers: [
        {
            ...createTextLayer({
                text: "Open Graph images\nyour links deserve",
                name: "Headline",
                x: 96,
                y: 176,
                width: 600,
                height: 180,
                fontId: "geist-sans",
                fontSize: 66,
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: -0.036,
                color: "#FFFFFF",
            }),
        },
        {
            ...createTextLayer({
                text: "Templates or a blank canvas. Export PNG, JPEG, or WebP in the browser.",
                name: "Subtext",
                x: 96,
                y: 384,
                width: 560,
                height: 96,
                fontId: "geist-sans",
                fontSize: 25,
                fontWeight: 400,
                lineHeight: 1.38,
                letterSpacing: -0.012,
                color: "#C7D2FE",
            }),
        },
        {
            ...createShapeLayer("rect"),
            id: "hero-accent",
            name: "Accent bar",
            x: 96,
            y: 128,
            width: 92,
            height: 8,
            fillEnabled: true,
            fill: "#C9F24D",
            strokeEnabled: false,
        } as Layer,
        {
            ...createImageLayer("/editor-preview.png", "Editor screenshot"),
            id: "hero-shot",
            name: "Editor screenshot",
            x: 728,
            y: 152,
            width: 392,
            height: 286,
            fit: "cover",
        } as Layer,
        {
            ...createShapeLayer("rect"),
            id: "hero-shot-frame",
            name: "Frame",
            x: 728,
            y: 152,
            width: 392,
            height: 286,
            fillEnabled: false,
            strokeEnabled: true,
            stroke: "#FFFFFF",
            strokeWidth: 2,
        } as Layer,
        {
            ...createTextLayer({
                text: "ogimg.in",
                name: "Wordmark",
                x: 96,
                y: 84,
                width: 300,
                height: 44,
                fontId: "geist-pixel-square",
                fontSize: 30,
                fontWeight: 400,
                letterSpacing: -0.02,
                color: "#FAFAFA",
            }),
        },
    ],
};

/**
 * Renders a document with the production canvas code, scaled to the width it is
 * actually given. Shared by the hero and the social preview simulator.
 */
export function DocumentPreview({
    document,
    maxWidth,
    className = "",
}: {
    document: FreeDocument;
    maxWidth: number;
    className?: string;
}) {
    return (
        <ScaledCanvas
            width={document.width}
            height={document.height}
            maxWidth={maxWidth}
            className={className}
        >
            <FreeCanvasRender document={document} />
        </ScaledCanvas>
    );
}

/**
 * Cycles through a few real documents so the landing page shows range without
 * shipping a video. Interval driven and disabled under reduced motion.
 */
export function RotatingPreview({ documents, interval = 4200 }: { documents: FreeDocument[]; interval?: number }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (media.matches || documents.length < 2) return;

        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % documents.length);
        }, interval);

        return () => window.clearInterval(timer);
    }, [documents.length, interval]);

    return (
        <div className="relative">
            {documents.map((document, entry) => (
                <div
                    key={document.id}
                    aria-hidden={entry !== index}
                    className={`transition-opacity duration-500 ${
                        entry === index ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
                    }`}
                >
                    <DocumentPreview document={document} maxWidth={560} />
                </div>
            ))}
        </div>
    );
}

export { HERO_DOCUMENT };