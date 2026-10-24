"use client";

import type { FreeDocument, Layer } from "../../lib/editor/types";
import {
    DEFAULT_CANVAS_BACKGROUND,
    createImageLayer,
    createShapeLayer,
    createTextLayer,
} from "../../lib/editor/factories";

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
        color: "#0B0B0B",
        gradientStart: "#262626",
        gradientEnd: "#050505",
        gradientAngle: 138,
        presetId: "studio-sky",
        overlay: "grid",
        overlayColor: "#FFFFFF",
        overlayOpacity: 0.11,
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
                color: "#A3A3A3",
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
            fill: "#FFFFFF",
            strokeEnabled: false,
        } as Layer,
        {
            ...createImageLayer("/hero-editor-aurora.png", "Editor screenshot"),
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

export { HERO_DOCUMENT };