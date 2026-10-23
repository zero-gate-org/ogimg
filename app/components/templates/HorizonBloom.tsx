"use client";

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
 * Horizon Bloom. One light rising off the bottom edge of a near-black card.
 *
 * The field is a single ellipse anchored just above the top edge, so the light
 * is not a blob sitting on the canvas but a ring the card sits inside of. The
 * middle stays black where the ellipse is narrowest, violet climbs both side
 * edges, and the two bottom corners burn out to cream where the ellipse runs
 * past its own radius and pads. That is why the lockup and the headline can
 * both hold the centre line and still land on darkness.
 *
 * The reference sets its wordmark and headline in a white to silver ramp. That
 * ramp is background light here and the type stays solid `textColor`, so one
 * colour still drives the whole card when a user changes it. Every layer is
 * drawn in code: CSS gradients, one inline SVG fallback mark, and a real <img>
 * when a logo is uploaded.
 */

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

/** Bloom hues. Background paint only, never applied to text. */
const VIOLET = "#500CB0";
const CREAM = "#FFE9C5";

/**
 * 160 x 157.5 cells. The origin is nudged to the centre so a crossing falls at
 * 600 x 315, which is the same register the lockup and the headline sit on.
 */
const GRID_CELL_X = 160;
const GRID_CELL_Y = CANVAS_HEIGHT / 4;
const GRID_ORIGIN_X = CANVAS_WIDTH / 2;
const GRID_ORIGIN_Y = CANVAS_HEIGHT / 2;

/**
 * The ellipse is wider than the card and centred 16px above the top edge, so
 * its outer stops fall off canvas at the sides but inside it along the bottom.
 * Cream therefore pools into both bottom corners while the middle of the bottom
 * edge is still violet, and the clear inner band is the whole dark upper half.
 */
const BLOOM_RADIUS_X = 885.54;
const BLOOM_RADIUS_Y = 724.04;
const BLOOM_ORIGIN_Y = -15.67;

/** Straight from the vector: clear to 48.79%, full violet at 71.32%, cream at its own edge. */
const bloom = `radial-gradient(${BLOOM_RADIUS_X}px ${BLOOM_RADIUS_Y}px at ${CANVAS_WIDTH / 2}px ${BLOOM_ORIGIN_Y}px, ${hexToRgba(
    VIOLET,
    0,
)} 48.79%, ${VIOLET} 71.32%, ${CREAM} 100%)`;

/**
 * Lockup: a portrait mark, a hair of air, then a stacked uppercase wordmark.
 * The top is the cap line the reference sits on, pulled up by the leading the
 * wordmark's own line boxes add above it.
 */
const LOCKUP_TOP = 127;
const MARK_WIDTH = 42;
const MARK_HEIGHT = 56;
const LOCKUP_GAP = 14;
const WORDMARK_SIZE = 36;
/** Two lines of the wordmark measure the mark's height, which keeps the pair flush. */
const WORDMARK_LEADING = 0.85;
const WORDMARK_WIDTH = 150;

/**
 * The two display lines sit 112px apart at 118px, which is the rhythm every card
 * in this family uses: a line gap of 0.95em. The band is the height those two
 * lines occupy once the font's own ascent and descent are folded into the
 * leading, so centring it puts the baselines where the reference has them.
 */
const HEADLINE_TOP = 249;
const HEADLINE_BOTTOM = 157;
const HEADLINE_WIDTH = 900;
const HEADLINE_BASELINE_PX = 118;
const HEADLINE_BASELINE_EM = -0.08;
const HEADLINE_LEADING = 112 / HEADLINE_BASELINE_PX;

export default function HorizonBloom({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#08080A",
    gradientEnd = "#0B0A12",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.06,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const gridLine = hexToRgba(gridColor ?? textColor, gridOpacity);
    const hasLockup = Boolean(logoImage || wordmark);

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
            {/*
              Painted here rather than inherited from the card's 32px overlay: at
              seven and a half cells across, the grid reads as the structure the
              light is laid over, not as texture.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: [
                        `linear-gradient(${gridLine} 1px, transparent 1px)`,
                        `linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
                    ].join(","),
                    backgroundSize: `${GRID_CELL_X}px ${GRID_CELL_Y}px, ${GRID_CELL_X}px ${GRID_CELL_Y}px`,
                    backgroundPosition: `${GRID_ORIGIN_X}px ${GRID_ORIGIN_Y}px, ${GRID_ORIGIN_X}px ${GRID_ORIGIN_Y}px`,
                }}
            />

            {/*
              Over the grid on purpose, so the hairlines dissolve into the light
              toward the bottom corners the way they do in the artwork.
            */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: bloom }} />

            {hasLockup && (
                <div
                    className="absolute left-0 right-0 flex items-center justify-center"
                    style={{ top: LOCKUP_TOP }}
                >
                    {logoImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logoImage}
                            alt=""
                            style={{
                                width: MARK_WIDTH,
                                height: MARK_HEIGHT,
                                objectFit: "contain",
                                flexShrink: 0,
                            }}
                        />
                    ) : (
                        /*
                          Empty state: the reference's own mark, a square frame with
                          a diagonal bar of the same weight punched out of it.
                        */
                        <svg
                            width={MARK_WIDTH}
                            height={MARK_HEIGHT}
                            viewBox="0 0 36 48"
                            fill="none"
                            aria-hidden="true"
                            style={{ display: "block", flexShrink: 0 }}
                        >
                            <path
                                fillRule="evenodd"
                                d="M0 0V48H36V0ZM6.9 5L31 37.2V5H6.9ZM29.1 43L5 10.8V43H29.1Z"
                                fill={textColor}
                            />
                        </svg>
                    )}

                    {wordmark && (
                        <span
                            style={{
                                marginLeft: LOCKUP_GAP,
                                maxWidth: WORDMARK_WIDTH,
                                color: textColor,
                                fontStyle,
                                fontWeight: resolveFontWeight(fontWeight, 700),
                                textDecoration,
                                fontSize: WORDMARK_SIZE,
                                lineHeight: WORDMARK_LEADING,
                                letterSpacing: "-0.01em",
                                textTransform: "uppercase",
                            }}
                        >
                            {wordmark}
                        </span>
                    )}
                </div>
            )}

            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: HEADLINE_TOP, bottom: HEADLINE_BOTTOM }}
            >
                <h1
                    style={{
                        margin: 0,
                        maxWidth: HEADLINE_WIDTH,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, HEADLINE_BASELINE_PX)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, HEADLINE_BASELINE_EM)}em`,
                        lineHeight: HEADLINE_LEADING,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>
            </div>
        </TemplateCard>
    );
}
