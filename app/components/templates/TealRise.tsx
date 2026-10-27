"use client";

import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    hexToRgb,
    hexToRgba,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Teal Rise: a wide arc of light lying along the bottom edge of a black card,
 * with the headline set in the same ramp it rises through.
 *
 * Measured off refs/04.svg. The arc is one ellipse that is 2.6 times wider than
 * it is tall and sits with its centre 99px below the card, so the cream core is
 * only a finger of light at the middle of the bottom edge, teal rings it, and a
 * violet halo climbs to about three quarters of the way up before it is gone.
 * A hairline grid runs under all of it, registered so one crossing lands on the
 * card's centre line.
 *
 * The reference paints its headline with a second, far larger ellipse of the
 * same ramp, which puts cream on the top-left of the type and lets it cool to
 * teal and then to a dim indigo toward the bottom-right. That diagonal is the
 * design, so the type keeps a gradient here too, the way StatRail's numerals do.
 * Its bright end is the user's text colour rather than the reference's cream, so
 * the headline still answers the colour control, and only the cool tail is
 * background light. The tail is cut at the density the reference's own type
 * reaches, so a longer headline dims without ever vanishing.
 *
 * One port needs care: an SVG renderer lerps the teal stop into the transparent
 * violet stop while CSS interpolates premultiplied, which would keep the teal
 * and only thin it, turning the halo dark green instead of indigo. The run is
 * therefore written out at its quarter points, which puts the composite back
 * within a couple of points of the reference at every sample along it.
 */
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

/** The ramp's three hues. The teal and violet are background paint. */
const CREAM = "#FFE9C5";
const TEAL = "#0C97B0";
const VIOLET = "#500CB0";

/** Where the reference's ramp turns, as a share of the ellipse's own radius. */
const CORE = 20.878;
const RING = 31.25;
const FADE = 51.206;

/**
 * 160 x 157.5 cells. The reference's crossings sit a hair off the card's axes
 * because its whole artwork is nudged up by 0.6px, and the nudged origin is what
 * keeps a hairline from printing across the card's top edge.
 */
const GRID_CELL_X = 160;
const GRID_CELL_Y = CANVAS_HEIGHT / 4;
const GRID_ORIGIN_X = 599.75;
const GRID_ORIGIN_Y = 314.382;

/** The arc: 1301.65 x 500.535, centred 99.4px below the bottom edge. */
const BLOOM_RADIUS_X = 1301.65;
const BLOOM_RADIUS_Y = 500.535;
const BLOOM_ORIGIN_Y = 729.377;

/**
 * One point of the reference's teal-to-violet run, where colour and alpha move
 * together: `t` is how far along that run the stop sits.
 */
const rampStop = (t: number) => {
    const [tr, tg, tb] = hexToRgb(TEAL);
    const [vr, vg, vb] = hexToRgb(VIOLET);
    const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
    return `rgba(${mix(tr, vr)}, ${mix(tg, vg)}, ${mix(tb, vb)}, ${(1 - t).toFixed(3)})`;
};

/**
 * Quarter-points of a teal-to-violet run, placed across the radius span the run
 * covers. `reach` is how far along the run its last stop sits.
 */
const runStops = (reach: number, from: number, to: number) =>
    [0.25, 0.5, 0.75]
        .map((step) => `${rampStop(step * reach)} ${(from + step * (to - from)).toFixed(3)}%`)
        .join(", ");

const bloom = `radial-gradient(${BLOOM_RADIUS_X}px ${BLOOM_RADIUS_Y}px at ${CANVAS_WIDTH / 2}px ${BLOOM_ORIGIN_Y}px, ${CREAM} 0%, ${CREAM} ${CORE}%, ${TEAL} ${RING}%, ${runStops(
    1,
    RING,
    FADE,
)}, ${rampStop(1)} ${FADE}%, ${rampStop(1)} 100%)`;

/**
 * The same ramp across the headline box. The reference's ellipse is so large
 * that its radius is a straight line over the type, so the turns transfer: the
 * box's bright corner reads r 0.089 and its dark one 0.419, which is where the
 * type stops cooling, and the turns land at these shares of the box.
 */
const TYPE_CORE = 36.26;
const TYPE_RING = 67.69;
const TYPE_TAIL = 0.533;

const typeRamp = (textColor: string) =>
    `linear-gradient(154deg, ${textColor} 0%, ${textColor} ${TYPE_CORE}%, ${TEAL} ${TYPE_RING}%, ${runStops(
        TYPE_TAIL,
        TYPE_RING,
        100,
    )}, ${rampStop(TYPE_TAIL)} 100%)`;

/** Lockup: a mark and an uppercase wordmark, centred on the same axis as the type. */
const LOCKUP_TOP = 100;
const MARK_WIDTH = 32;
const MARK_HEIGHT = 43;
const LOCKUP_GAP = 10;
const WORDMARK_SIZE = 27;
const WORDMARK_LEADING = 0.9;
const WORDMARK_WIDTH = 190;

/**
 * The reference's two lines advance by exactly 120px against a cap height of
 * 87.273, and Space Grotesk caps at 0.70em, so a 125px face lands on that cap
 * and a leading of 0.96 lands on that advance. The band below is the two line
 * boxes they make, whose cap lines fall where the reference's do.
 */
const HEADLINE_TOP = 196;
const HEADLINE_BOTTOM = 194;
const HEADLINE_WIDTH = 950;
const HEADLINE_SIZE = 125;
const HEADLINE_LEADING = 120 / HEADLINE_SIZE;

export default function TealRise({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#000000",
    gradientEnd = "#000000",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.07,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const gridLine = hexToRgba(gridColor ?? textColor, gridOpacity);
    const hasLockup = Boolean(logoImage || wordmark);
    const headlineSize = resolveTitleFontSize(titleSize, HEADLINE_SIZE);

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
            showLift={false}
        >
            {/*
              Painted here instead of inheriting the card's 32px overlay: at 160 x
              157.5 the grid is the structure the light is laid over, which is how
              the reference sets it.
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

            {/* Over the grid on purpose, so the hairlines dissolve into the arc. */}
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
                                letterSpacing: "0.01em",
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
                <div
                    style={{
                        margin: 0,
                        maxWidth: HEADLINE_WIDTH,
                        backgroundImage: typeRamp(textColor),
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${headlineSize}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.08)}em`,
                        lineHeight: HEADLINE_LEADING,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </div>
            </div>
        </TemplateCard>
    );
}
