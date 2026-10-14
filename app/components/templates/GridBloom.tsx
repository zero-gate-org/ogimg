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
 * Grid Bloom — a typographic card lit from two opposite corners.
 *
 * The field is built to survive a half-turn: one bloom burns out of the
 * top-right corner, an identical one out of the bottom-left, and the fine grid
 * is registered so a crossing falls exactly on the centre of the card. Rotate
 * it 180° and the light lands in the same places. That symmetry is what keeps
 * the middle of the card dark along the anti-diagonal, which is where the
 * headline sits — the type never competes with the light, it is framed by it.
 *
 * The reference paints its headline with a violet-to-cream ramp. The ramp lives
 * here in the light instead, and the type stays one solid colour, which is what
 * keeps the card in a single family when the user changes it — gradient-clipped
 * text would not survive the foreignObject export anyway.
 *
 * Every layer is drawn in code: CSS gradients, one inline SVG fallback mark, and
 * a real <img> when a logo is uploaded. Geometry is mirrored by the `crossglow`
 * branch of `buildPresetLayers`, so the card does not jump when it is detached.
 */

const CANVAS_HEIGHT = 630;

/**
 * ~40px cells. The origin is nudged so a vertical line falls on x=600 and a
 * horizontal one on y=315 — the two crossings that hold the half-turn symmetry.
 */
const GRID_CELL = 40;
const GRID_ORIGIN_X = 0;
const GRID_ORIGIN_Y = CANVAS_HEIGHT / 2 - 8 * GRID_CELL;

/** Bloom hues. Background paint only — never applied to text. */
const VIOLET = "#6A00FF";
/** The reference's outermost stop: hot enough at the very tip to go to cream. */
const CORNER_CORE = "#FFE9C5";

/**
 * One falloff, shared by both lobes of a bloom so they read as a single light.
 * The flat top to 0.42 is deliberate: the reference holds full saturation over a
 * broad band along each edge instead of peaking at the corner tip, then drops off
 * a cliff toward the middle of the card.
 */
const FALLOFF: [number, number][] = [
    [0, 1],
    [0.42, 1],
    [0.5, 0.58],
    [0.6, 0.33],
    [0.7, 0.18],
    [0.78, 0.06],
    [0.9, 0],
];

const CORE_STOPS: [number, number][] = [
    [0, 0.62],
    [0.25, 0.45],
    [0.45, 0.28],
    [0.68, 0.1],
    [0.85, 0],
];

const stops = (hex: string, ramp: [number, number][]) =>
    ramp.map(([position, alpha]) => `${hexToRgba(hex, alpha)} ${(position * 100).toFixed(0)}%`).join(", ");

/**
 * The light runs along the two edges that meet at a corner rather than out from
 * it in a circle, so each bloom is two ellipses — one wide and flat along the
 * horizontal edge, one narrow and deep along the vertical — with the cream core
 * laid over the join. A single ellipse cannot do both: it would have to light
 * the middle of the card to reach as far down an edge as the artwork does.
 *
 * Listed first, the core paints on top, which is what washes out the extreme
 * corner while the saturation just inside it stays pure violet.
 */
const bloomAt = (x: number, y: number) => {
    const at = `${x}% ${y}%`;
    const lobe = (size: string) => `radial-gradient(${size} at ${at}, ${stops(VIOLET, FALLOFF)})`;
    return [
        `radial-gradient(28% 54% at ${at}, ${stops(CORNER_CORE, CORE_STOPS)})`,
        lobe("66% 60%"),
        lobe("33% 128%"),
    ].join(", ");
};

/** Lockup: a portrait mark, a hair of air, then a stacked uppercase wordmark. */
const LOCKUP_TOP = 96;
const MARK_WIDTH = 30;
const MARK_HEIGHT = 40;
const LOCKUP_GAP = 10;
const WORDMARK_SIZE = 26;
/** Tight enough that two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.88;
const WORDMARK_WIDTH = 132;

/** The band the headline is centred in, between the lockup and the domain. */
const HEADLINE_TOP = 152;
const HEADLINE_BOTTOM = 128;
const HEADLINE_WIDTH = 820;

const DOMAIN_BOTTOM = 78;
const DOMAIN_SIZE = 32;

export default function GridBloom({
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
    gradientStart = "#08080C",
    gradientEnd = "#0A0812",
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
    const domain = (tag || "").trim();
    const gridLine = hexToRgba(gridColor ?? textColor, gridOpacity);

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
              The fine grid is drawn here rather than inherited from the card's
              32px overlay: at 40px cells with a crossing on the centre it reads
              as the structure the blooms are laid over, not as texture.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: [
                        `linear-gradient(${gridLine} 1px, transparent 1px)`,
                        `linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
                    ].join(","),
                    backgroundSize: `${GRID_CELL}px ${GRID_CELL}px, ${GRID_CELL}px ${GRID_CELL}px`,
                    backgroundPosition: `${GRID_ORIGIN_X}px ${GRID_ORIGIN_Y}px, ${GRID_ORIGIN_X}px ${GRID_ORIGIN_Y}px`,
                }}
            />

            {/*
              Painted over the grid on purpose, so the lines dissolve into the
              light toward each corner the way they do in the artwork.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: bloomAt(100, 0) }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: bloomAt(0, 100) }}
            />

            {/* Brand lockup, centred as one group at the top of the card. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: LOCKUP_TOP }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{ width: MARK_WIDTH, height: MARK_HEIGHT, objectFit: "contain", flexShrink: 0 }}
                    />
                ) : (
                    /*
                      Empty state: the reference's own mark — a frame and a
                      diagonal bar of the same weight, punched out of one filled
                      square so the two can never drift apart.
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
                            fontWeight: 700,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: WORDMARK_LEADING,
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                            textDecoration,
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/* The headline, held in the dark band between the two blooms. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: HEADLINE_TOP, bottom: HEADLINE_BOTTOM }}
            >
                <h1
                    style={{
                        maxWidth: HEADLINE_WIDTH,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 84)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                        lineHeight: 1.04,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>
            </div>

            {domain && (
                <p
                    className="absolute left-0 right-0"
                    style={{
                        bottom: DOMAIN_BOTTOM,
                        color: hexToRgba(textColor, 0.86),
                        fontSize: DOMAIN_SIZE,
                        fontWeight: 500,
                        lineHeight: 1,
                        letterSpacing: "-0.005em",
                        textAlign: "center",
                        fontStyle,
                        textDecoration,
                    }}
                >
                    {domain}
                </p>
            )}
        </TemplateCard>
    );
}
