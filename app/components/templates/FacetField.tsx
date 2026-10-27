"use client";

import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    clampGridBlur,
    getBackgroundFill,
    getCardTone,
    getGridOverlayStyle,
    hexToRgba,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Facet Field: pale light riding over a violet-to-magenta field.
 *
 * The vector lays three very large plates over a black artboard, and the plates
 * *are* the field: each one is an opaque shape filled with the gradient, and each
 * throws a white inner shadow off its own rim. Because they overlap and the one
 * at x 136 is painted last, every pixel belongs to the topmost plate covering it,
 * so a card cannot reproduce that by adding three glows together. It is
 * reproduced exactly by painting the plates opaque in the vector's own order,
 * bottom first: each one brings its own slice of the field and erases whatever
 * was underneath, which is what "topmost wins" means. The rim light peaks where a
 * rim faces the top edge and fades toward the middle, and because each rim is a
 * flat rather than a curve, the crests that frame the type come out faceted.
 *
 * Under y 200 the vector stacks ten masked, progressively blurred copies of the
 * field. Measured against the plates, that stack adds a slow white veil rising
 * from nothing at y 200 to about seven percent at the bottom edge, so a plain
 * linear gradient stands in for it.
 *
 * The reference sets its headline in a white-to-silver ramp. That ramp is
 * background paint here, declared as constants below and never applied to
 * glyphs: every letter stays flat `textColor`, which keeps the card in one
 * family when the user changes colour.
 */

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

/** The plate light. Background paint only, never applied to text. */
const PALE = "#FFFFFF";

/**
 * Measured off refs/09.svg. Each plate is a regular octagon with all eight of its
 * corners rounded: a side runs out to 55.11 either side of the corner it meets,
 * and the rounding stands 10.96 proud of the chord between them. Two plates stand
 * on the card's midline at x 136 and x 538 with a half-side of 474.17; the third
 * sits at x 1158, a tenth smaller. At those sizes the three outlines cover every
 * point of the card between them, which is what lets the shared card fill and its
 * one decorative lift stay hidden underneath.
 */
const PLATE_RUN = 55.106;
const PLATE_BULGE = 10.96;

/** The plate outline as points inside its own box, whose half-side is the bulge. */
const plateClip = (halfSide: number, reach: number) => {
    const tangent = Math.hypot(halfSide, PLATE_RUN);
    const tilt = Math.atan2(PLATE_RUN, halfSide);
    const points: string[] = [];
    for (let corner = 0; corner < 8; corner++) {
        const phi = (corner * Math.PI) / 4;
        for (const [offset, radius] of [
            [-tilt, tangent],
            [0, reach],
            [tilt, tangent],
        ] as const) {
            const t = phi + offset;
            points.push(
                `${(reach + radius * Math.cos(t)).toFixed(2)}px ${(reach + radius * Math.sin(t)).toFixed(2)}px`
            );
        }
    }
    return `polygon(${points.join(", ")})`;
};

/** In the vector's paint order, so the plate at x 136 ends up on top. */
const PLATES = [
    { cx: 1158, halfSide: 446.174 },
    { cx: 538, halfSide: 474.174 },
    { cx: 136, halfSide: 474.174 },
].map(({ cx, halfSide }) => {
    const reach = halfSide + PLATE_BULGE;
    return { cx, left: cx - reach, top: 315 - reach, reach, clip: plateClip(halfSide, reach) };
});

/**
 * The vector's shadow is white, offset 84px down and blurred 125 standard
 * deviations, so the light at a point is the Gaussian of how far it sits past the
 * plate's rim, measured from the offset centre. Fitted against the reference, the
 * rim that curve turns on lies 454px out and fades over 128, and the stops below
 * are that curve read off every 57px. Painting it as stops rather than an inset
 * box-shadow keeps the falloff smooth at every size and rides out the export,
 * which copies declarations but cannot be trusted with a shadow blurred this far.
 */
const RIM_DROP = 84;
const RIM_REACH = 570;
const RIM_PROFILE: [number, number][] = [
    [0, 0],
    [57, 0.001],
    [114, 0.004],
    [171, 0.014],
    [228, 0.039],
    [285, 0.094],
    [342, 0.192],
    [399, 0.334],
    [456, 0.506],
    [513, 0.677],
    [570, 0.817],
];
const rimFill = (reach: number) =>
    `radial-gradient(${RIM_REACH}px ${RIM_REACH}px at ${reach}px ${reach + RIM_DROP}px, ${RIM_PROFILE.map(
        ([distance, level]) => `${hexToRgba(PALE, level)} ${distance}px`
    ).join(", ")})`;

/** The stacked backdrop-blur bands, collapsed to the ramp they actually leave. */
const VEIL_TOP = 200;
const VEIL_STRENGTH = 0.068;

/** Lockup: the reference's mark, a hair of air, then an uppercase wordmark on two lines. */
const LOCKUP_TOP = 99;
const MARK_WIDTH = 36;
const MARK_HEIGHT = 48;
const LOCKUP_GAP = 12;
const WORDMARK_SIZE = 29;
/** Tight enough that two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.87;
const WORDMARK_WIDTH = 140;

/** The band the two display lines are centred in, placed so the block starts on
 *  the reference's own cap line at y224.6. */
const HEADLINE_TOP = 145;
const HEADLINE_BOTTOM = 123;
const HEADLINE_WIDTH = 720;
const BASELINE_PX = 118;
const BASELINE_EM = -0.08;
/** The reference sets its two baselines 112px apart at 118px of type. */
const HEADLINE_LEADING = 0.95;

const DOMAIN_BOTTOM = 72;
const DOMAIN_SIZE = 40;

export default function FacetField({
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
    gradientStart = "#6B00FF",
    gradientEnd = "#C700FF",
    gradientAngle = 180,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const domain = (tag || "").trim();
    const fieldFill = getBackgroundFill(
        backgroundMode,
        gradientStart,
        gradientEnd,
        gradientAngle,
        backgroundPresetId
    );
    const overlayStyle = getGridOverlayStyle(gridOverlay, gridColor ?? textColor, gridOpacity);
    const clampedGridBlur = clampGridBlur(gridBlur);

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
            /*
              The plates cover the card edge to edge, so anything the shared frame
              draws under them is hidden. The grid has to come back over the top,
              which means it is drawn here instead.
            */
            gridOverlay="none"
            gridColor={gridColor}
            gridOpacity={gridOpacity}
            gridBlur={gridBlur}
        >
            {/*
              One opaque plate per outline, in the vector's own paint order. The
              inner layer is the whole card's field, pushed back so it sits where
              it would if the plate were not cutting it, and the rim light rides
              on top. Each plate erases the ones below it inside its own edge,
              which is how the reference hands a pixel to the topmost plate.
            */}
            {PLATES.map(({ cx, left, top, reach, clip }) => (
                <div
                    key={cx}
                    className="absolute pointer-events-none"
                    style={{ left, top, width: reach * 2, height: reach * 2, clipPath: clip }}
                >
                    <div
                        className="absolute"
                        style={{
                            left: -left,
                            top: -top,
                            width: CANVAS_WIDTH,
                            height: CANVAS_HEIGHT,
                            background: fieldFill,
                        }}
                    />
                    <div className="absolute inset-0" style={{ backgroundImage: rimFill(reach) }} />
                </div>
            ))}

            <div
                className="absolute left-0 right-0 bottom-0 pointer-events-none"
                style={{
                    top: VEIL_TOP,
                    background: `linear-gradient(180deg, ${hexToRgba(PALE, 0)} 0%, ${hexToRgba(
                        PALE,
                        VEIL_STRENGTH
                    )} 100%)`,
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
                      Empty state: the reference's own mark, a diagonal bar punched
                      out of a filled square so the two can never drift apart.
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

            {/* Two lines of display type, centred in the lit band between the facets. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: HEADLINE_TOP, bottom: HEADLINE_BOTTOM }}
            >
                <div
                    style={{
                        maxWidth: HEADLINE_WIDTH,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, BASELINE_PX)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, BASELINE_EM)}em`,
                        lineHeight: HEADLINE_LEADING,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </div>
            </div>

            {domain && (
                <p
                    className="absolute left-0 right-0"
                    style={{
                        bottom: DOMAIN_BOTTOM,
                        color: textColor,
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
