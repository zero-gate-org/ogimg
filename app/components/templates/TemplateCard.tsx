"use client";

import type { CSSProperties, ReactNode } from "react";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type BackgroundMode,
    type BackgroundPresetId,
    type CardTone,
    type GridOverlay,
    clampGridBlur,
    getBackgroundFill,
    getCardTone,
    getGridOverlayStyle,
    hexToRgba,
} from "./templateShared";

/**
 * Shared frame every template builds on.
 *
 * Three rules hold the system together, so no template has to reinvent them:
 * the fill is the user's choice, hierarchy is expressed as opacities of the
 * user's text colour, and structure is drawn with hairlines rather than
 * shadows or decorative glows.
 */
export default function TemplateCard({
    children,
    textColor,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart,
    gradientEnd,
    gradientAngle = 140,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    tone,
    className = "",
    style,
}: {
    children: ReactNode;
    textColor: string;
    fontFamily: string;
    backgroundMode?: BackgroundMode;
    gradientStart: string;
    gradientEnd: string;
    gradientAngle?: number;
    backgroundPresetId?: BackgroundPresetId;
    gridOverlay?: GridOverlay;
    gridColor?: string;
    gridOpacity?: number;
    gridBlur?: number;
    /** Pass a tone down to children so the whole card agrees on one palette. */
    tone?: CardTone;
    className?: string;
    style?: CSSProperties;
}) {
    const resolvedTone = tone ?? getCardTone(textColor);
    const backgroundFill = getBackgroundFill(
        backgroundMode,
        gradientStart,
        gradientEnd,
        gradientAngle,
        backgroundPresetId,
    );
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor ?? textColor, gridOpacity);
    const clampedGridBlur = clampGridBlur(gridBlur);

    return (
        <div
            id="og-template-node"
            className={`relative isolate flex overflow-hidden ${className}`}
            style={{
                width: "1200px",
                height: "630px",
                fontFamily,
                background: backgroundFill,
                ...style,
            }}
        >
            {/*
              One soft lift toward the text colour, so a flat fill still has
              depth. Deliberately the only decorative layer.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: resolvedTone.isDarkText
                        ? `radial-gradient(120% 90% at 50% 0%, ${hexToRgba(textColor, 0.07)} 0%, ${hexToRgba(textColor, 0)} 62%)`
                        : `radial-gradient(120% 90% at 50% 0%, ${hexToRgba("#ffffff", 0.6)} 0%, ${hexToRgba("#ffffff", 0)} 62%)`,
                }}
            />

            {gridOverlay !== "none" && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        ...overlayStyle,
                        filter: clampedGridBlur > 0 ? `blur(${clampedGridBlur}px)` : undefined,
                        transform: clampedGridBlur > 0 ? "scale(1.01)" : undefined,
                    }}
                />
            )}

            <div className="relative z-10 h-full w-full">{children}</div>
        </div>
    );
}

/** A hairline. Structure comes from rules, not from boxes and shadows. */
export const Rule = ({ tone, className = "" }: { tone: CardTone; className?: string }) => (
    <div className={`w-full shrink-0 ${className}`} style={{ height: 1, backgroundColor: tone.hairline }} />
);

/**
 * Image slot with a considered empty state. Templates that reserve space for
 * an image should never leave a blank rectangle when the user clears it.
 */
export const ImageSlot = ({
    image,
    alt = "",
    fit = "cover",
    radius,
    tone,
    emptyLabel = "Add an image",
    className = "",
    style,
}: {
    image?: string;
    /** Empty when the slot is decorative, which is the case in every template here. */
    alt?: string;
    fit?: "cover" | "contain" | "fill";
    radius?: number;
    tone: CardTone;
    emptyLabel?: string;
    className?: string;
    style?: CSSProperties;
}) => {
    const borderRadius = typeof radius === "number" && radius > 0 ? `${radius}px` : undefined;

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{
                borderRadius,
                backgroundColor: tone.fill,
                boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                ...style,
            }}
        >
            {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={image}
                    alt={alt}
                    className="h-full w-full"
                    style={{ objectFit: fit, borderRadius }}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center px-8">
                    <span
                        className="text-[15px] font-medium uppercase tracking-[0.2em]"
                        style={{ color: tone.tertiary }}
                    >
                        {emptyLabel}
                    </span>
                </div>
            )}
        </div>
    );
};

/**
 * Small uppercase label. Not every section gets one, so this is opt-in rather
 * than something the layout sprinkles automatically.
 */
export const MetaLabel = ({
    children,
    tone,
    className = "",
}: {
    children: ReactNode;
    tone: CardTone;
    className?: string;
}) => (
    <span
        className={`text-[14px] font-semibold uppercase tracking-[0.2em] ${className}`}
        style={{ color: tone.tertiary }}
    >
        {children}
    </span>
);
