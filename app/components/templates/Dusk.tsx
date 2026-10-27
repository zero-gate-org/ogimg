"use client";

import type { CSSProperties } from "react";
import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    hexToRgba,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Dusk: a near-black card with almost nothing on it, lit from one corner.
 *
 * The reference art paints its headline with a white-to-grey ramp and lets a
 * violet field do the talking. The ramp is dropped and the light is kept: the
 * whole colour story lives in the background, and the type stays one solid
 * colour, which is what keeps the card in a single family when the user changes
 * it (and gradient-clipped text would not survive the export anyway).
 *
 * The light is not a corner blob. It is one enormous ellipse whose centre sits
 * up and to the left of the card, so the visible band is the far arc of that
 * ellipse sweeping in from the bottom-right: black through 48.8% of its radius,
 * deep violet by 71.3%, and warm cream by the outer edge. The ellipse is tilted
 * 17.3deg, which is what gives the band its diagonal inner edge running from the
 * top-right corner down to the bottom-left; an unrotated CSS ellipse bows the
 * wrong way and reads as a vignette. So the field is painted on an oversized
 * rotated div and the cream is a second div on the same geometry, which together
 * reproduce the source ramp stop for stop.
 *
 * Type is set on one left rail at 64px: mark and wordmark at the top, the
 * headline on the bottom rail. Geometry is mirrored by the `dusk` branch in
 * `templateLayout.ts`, so the card does not jump when it is detached.
 */

/** Left rail shared by the lockup, the headline and the tag line. */
const RAIL_LEFT = 64;
const MARK_TOP = 80;
/** 33 x 44: the reference mark's own proportions, so the lockup keeps its shape. */
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 12;
/** Two lines of this size fill the mark's height, which is how the reference locks up. */
const WORDMARK_SIZE = 21;

/** Measured from the bottom edge up: the headline's last line ends here. */
const BOTTOM_RAIL = 74;
/** Width of the type rail. Narrow on purpose: it holds the reference copy to two
    lines and leaves the right half of the card to the light. Four lines of the
    default size still clear the lockup; past that the headline slider takes over. */
const TYPE_WIDTH = 620;
const TAG_SIZE = 20;
const TAG_LEADING = 1.4;
const TAG_TO_HEADLINE = 22;
const HEADLINE_LEADING = 1.04;

/** Centre, radii and tilt of the light field, in card pixels (1200 x 630). */
const FIELD_X = 446;
const FIELD_Y = 79;
const FIELD_RX = 1241;
const FIELD_RY = 682;
const FIELD_TILT = -17.3;
/** Half the painted square. It has to clear the 934px from the field centre to the far corner. */
const FIELD_HALF = 1000;
/** Where the violet lands and where it is fully down, as a share of the field radius. */
const VIOLET_START = 48.8;
const VIOLET_FULL = 71.3;

/** Background paint only. Neither hue is ever applied to text. */
const VIOLET = "#500CB0";
const CREAM = "#FFE9C5";

/** One full-bleed layer of the field, rotated about the field's own centre. */
const fieldLayer = (background: string): CSSProperties => ({
    position: "absolute",
    left: `${FIELD_X - FIELD_HALF}px`,
    top: `${FIELD_Y - FIELD_HALF}px`,
    width: `${FIELD_HALF * 2}px`,
    height: `${FIELD_HALF * 2}px`,
    transform: `rotate(${FIELD_TILT}deg)`,
    pointerEvents: "none",
    background,
});

const violetField = `radial-gradient(${FIELD_RX}px ${FIELD_RY}px at 50% 50%,
    ${hexToRgba(VIOLET, 0)} 0%,
    ${hexToRgba(VIOLET, 0)} ${VIOLET_START}%,
    ${hexToRgba(VIOLET, 0.92)} ${VIOLET_FULL}%,
    ${hexToRgba(VIOLET, 0.92)} 100%)`;

/** The leak beside the bloom: the same ellipse, lit only past the violet's full stop. */
const creamLeak = `radial-gradient(${FIELD_RX}px ${FIELD_RY}px at 50% 50%,
    ${hexToRgba(CREAM, 0)} 0%,
    ${hexToRgba(CREAM, 0)} ${VIOLET_FULL}%,
    ${hexToRgba(CREAM, 1)} 100%)`;

export default function Dusk({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0A0A0C",
    gradientEnd = "#0C0A14",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const tagline = (tag || "").trim();

    return (
        <TemplateCard
            tone={tone}
            textColor={textColor}
            fontFamily={fontFamily}
            backgroundMode={backgroundMode}
            gradientStart={gradientStart}
            gradientEnd={gradientEnd}
            gradientAngle={gradientAngle}
            backgroundPresetId={backgroundPresetId}
            gridOverlay={gridOverlay}
            gridColor={gridColor}
            gridOpacity={gridOpacity}
            gridBlur={gridBlur}
        >
            {/* The field, then the leak. Two divs because the card has one light, not two. */}
            <div style={fieldLayer(violetField)} />
            <div style={fieldLayer(creamLeak)} />

            {/* Brand lockup, top of the rail. */}
            <div
                className="absolute flex items-center"
                style={{ left: RAIL_LEFT, top: MARK_TOP, gap: LOCKUP_GAP }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{
                            width: `${MARK_WIDTH}px`,
                            height: `${MARK_HEIGHT}px`,
                            objectFit: "contain",
                            flexShrink: 0,
                        }}
                    />
                ) : (
                    /* Empty state: the reference mark — a frame with a full-weight diagonal. */
                    <svg
                        width={MARK_WIDTH}
                        height={MARK_HEIGHT}
                        viewBox="0 0 33 44"
                        fill="none"
                        aria-hidden="true"
                        style={{ display: "block", flexShrink: 0 }}
                    >
                        <rect x="2.2" y="2.2" width="28.6" height="39.6" stroke={textColor} strokeWidth="4.4" />
                        <line x1="4.4" y1="4.4" x2="28.6" y2="39.6" stroke={textColor} strokeWidth="4.4" />
                    </svg>
                )}

                {wordmark && (
                    <span
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: `${WORDMARK_SIZE}px`,
                            lineHeight: 1.05,
                            letterSpacing: "0.01em",
                            textTransform: "uppercase",
                            maxWidth: "220px",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/* The headline, on the bottom rail. The block grows upward as it wraps. */}
            <div className="absolute" style={{ left: RAIL_LEFT, bottom: BOTTOM_RAIL, width: `${TYPE_WIDTH}px` }}>
                <div
                    style={{
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 84)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                        lineHeight: HEADLINE_LEADING,
                    }}
                >
                    {title}
                </div>

                {tagline && (
                    <p
                        style={{
                            marginTop: `${TAG_TO_HEADLINE}px`,
                            /* Secondary rather than tertiary: this line lands in the
                               violet band, where the quietest tone would sink. */
                            color: tone.secondary,
                            fontStyle,
                            fontWeight: 500,
                            textDecoration,
                            fontSize: `${TAG_SIZE}px`,
                            lineHeight: TAG_LEADING,
                            letterSpacing: "0.005em",
                        }}
                    >
                        {tagline}
                    </p>
                )}
            </div>
        </TemplateCard>
    );
}
