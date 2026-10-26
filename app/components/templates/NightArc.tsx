"use client";

import { useId } from "react";
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
 * Night Arc: two enormous black discs carry a teal inner shadow, so their rims
 * sweep across a navy card as two cyan arcs behind a centred headline and a
 * glass product window.
 *
 * Measured off refs/11.svg. The reference draws a 1200 x 630 #071142 card with
 * no grid, then a circle at -210.5,846.5 r741.5 and an ellipse at 1506,846.5
 * rx957 ry957.5, both filled black at 0.01. Their light is the same inner
 * shadow the reference uses in Teal Contour: the source alpha is pushed to a
 * hard mask, offset 4px down, blurred at 50, subtracted from the mask,
 * recoloured #00EAFF and laid over the black fill. Only the inside of each rim
 * keeps any light, and because the discs are enormous, that inside is the wide
 * cyan band crossing the top of the card. The 0.01 fill is what keeps the navy
 * base visible through the discs; the filter still gets a full mask because
 * the alpha is multiplied by 127 and clamped.
 *
 * Both shapes and both filters are inline SVG, so they survive the export path,
 * which serialises the card into a foreignObject. Each filter keeps the
 * reference's own user-space region, and its id carries this instance's
 * `useId` so the gallery's previews never share a definition. The reference also
 * puts a 70px backdrop blur behind the plate; it is left out, as in Chroma
 * Panel and Graphite Window, because the plate is black at 0.8 and the blur is
 * invisible through it.
 *
 * The plate is the reference's own alpha stack: a 990 x 849 rounded rect at
 * 104.5,329.5 with 23.5px corners, black at 0.8 under a white 0.2 hairline,
 * stroked a second time with a 237.227 x 276.579 radial (white to transparent)
 * centred at 599.5,364.351, which lights the top edge. Inside it, 23.5 of plate
 * all the way around, sits the 943 x 802 window with 8px corners. The reference
 * fills that window with the never.design task app; none of it is ported,
 * because the slot is where the user's own screenshot belongs.
 *
 * Type: the reference sets "Designed for / agile startups" at 96px with a one
 * em advance, weight 600, tracking about -0.037, and its two line ink spans
 * x310..889, y101..289, centred on the card. The headline gets a subtle
 * white-to-silver ramp read from the reference's white to #C9C9C9 gradient; the
 * bright end follows the user's text colour. The reference has no lockup, so the
 * app's own sits at the top left, on the same 33 x 44 mark and uppercase
 * wordmark pattern as Chroma Panel. Geometry is mirrored by the `night-arc`
 * branch in `templateLayout.ts`, so the card does not jump when it is detached.
 */

/** The two discs, with the reference's filter regions. */
const LEFT_ARC = {
    cx: -210.5,
    cy: 846.5,
    r: 741.5,
    filter: { x: -952, y: 105, width: 1483, height: 1487 },
};

const RIGHT_ARC = {
    cx: 1506,
    cy: 846.5,
    rx: 957,
    ry: 957.5,
    filter: { x: 549, y: -111, width: 1914, height: 1919 },
};

/** The reference's teal inner shadow, restated with SVG primitives. */
const ArcInnerShadow = ({
    id,
    x,
    y,
    width,
    height,
}: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}) => (
    <filter
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
    >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="50" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.916667 0 0 0 0 1 0 0 0 1 0"
        />
        <feBlend mode="normal" in2="shape" result="innerShadow" />
    </filter>
);

/** Top-left lockup: 33 x 44 mark, then the one line uppercase wordmark. */
const PAD_X = 64;
const LOCKUP_TOP = 64;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 24;
const WORDMARK_WIDTH = 220;

/**
 * The reference's two line ink starts at y101, and Inter's cap sits 11px inside
 * a 96px, one em line box, so the h1 box starts at 90. Its 760px width is wide
 * enough for the reference's second line (579px of ink) and leaves the default
 * copy on two centred lines.
 */
const HEADLINE_TOP = 90;
const HEADLINE_WIDTH = 760;
const HEADLINE_SIZE = 96;
const HEADLINE_LEADING = 1;
const HEADLINE_TRACKING = -0.037;

/**
 * The reference's white to #C9C9C9 ramp runs from 786.786,158.476 to
 * 720.893,329.561: 201.1deg, 183.35px long. Read on the default two line box at
 * 96px, its axis lands at 29.4% and 70% of the box's own CSS gradient line, so
 * the stops sit there and clamp at either end. The bright end follows the
 * user's text colour and the silver end is that colour at 0.8, which lands on
 * the reference's grey over the navy base.
 */
const RAMP_DEG = 201.1;
const RAMP_START_STOP = 29.4;
const RAMP_END_STOP = 70;
const RAMP_END_ALPHA = 0.8;

/** Plate and window, as the reference measures them. */
const PLATE_X = 104.5;
const PLATE_Y = 329.5;
const PLATE_W = 990;
const PLATE_H = 849;
const PLATE_RADIUS = 23.5;
const WINDOW_PAD = 23.5;
const WINDOW_W = 943;
const WINDOW_H = 802;

/**
 * The plate's edge light: the reference strokes the plate a second time with a
 * radial gradient centred at 599.5,364.351 with a 276.579px horizontal radius
 * and a 237.227px vertical one. Those are the plate's own coordinates.
 */
const GLINT_X = 599.5 - PLATE_X;
const GLINT_Y = 364.351 - PLATE_Y;
const GLINT_RX = 276.579;
const GLINT_RY = 237.227;

export default function NightArc({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#071142",
    gradientEnd = "#071142",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
    image,
    imageFit = "cover",
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const leftFilterId = `${uid}-night-arc-left`;
    const rightFilterId = `${uid}-night-arc-right`;

    // The plate is the reference's own alpha stack, hung off the text colour so a
    // light card inverts with it instead of going dark on dark.
    const plateFill = tone.isDarkText ? "rgba(0, 0, 0, 0.8)" : "rgba(250, 250, 252, 0.86)";
    const plateEdge = hexToRgba(textColor, 0.2);
    const windowTint = hexToRgba(textColor, 0.05);
    const faint = hexToRgba(textColor, 0.5);

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
              The two rim lit discs, painted in the reference's order. Their black
              fills are almost transparent, so the card's own fill shows through
              everything except the teal band along each rim.
            */}
            <svg
                width="1200"
                height="630"
                viewBox="0 0 1200 630"
                fill="none"
                aria-hidden="true"
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "1200px",
                    height: "630px",
                    pointerEvents: "none",
                }}
            >
                <defs>
                    <ArcInnerShadow id={leftFilterId} {...LEFT_ARC.filter} />
                    <ArcInnerShadow id={rightFilterId} {...RIGHT_ARC.filter} />
                </defs>

                <circle
                    cx={LEFT_ARC.cx}
                    cy={LEFT_ARC.cy}
                    r={LEFT_ARC.r}
                    fill="#000000"
                    fillOpacity="0.01"
                    filter={`url(#${leftFilterId})`}
                />
                <ellipse
                    cx={RIGHT_ARC.cx}
                    cy={RIGHT_ARC.cy}
                    rx={RIGHT_ARC.rx}
                    ry={RIGHT_ARC.ry}
                    fill="#000000"
                    fillOpacity="0.01"
                    filter={`url(#${rightFilterId})`}
                />
            </svg>

            {/*
              The plate, bleeding off the bottom edge as the reference sets it.
              It is painted over the arcs and under the type, which is the
              reference's own paint order.
            */}
            <div
                className="absolute"
                style={{
                    left: PLATE_X,
                    top: PLATE_Y,
                    width: PLATE_W,
                    height: PLATE_H,
                    borderRadius: PLATE_RADIUS,
                    background: plateFill,
                }}
            >
                {/*
                  The white hairline, at 0.2 of the text colour. The reference
                  strokes its path from the centre, so the band runs 104.0 to
                  105.0 and 329.0 to 330.0: the box is pushed out half a pixel and
                  carries a whole pixel of border, which puts it on the same pixel
                  row and column the reference rasterizes.
                */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: -0.5,
                        border: `1px solid ${plateEdge}`,
                        borderRadius: PLATE_RADIUS + 0.5,
                    }}
                />

                {/* The stroke gradient, restated as a hairline along the plate's top edge. */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: -0.5,
                        height: 1,
                        background: `radial-gradient(${GLINT_RX}px ${GLINT_RY}px at ${GLINT_X}px ${GLINT_Y}px, ${hexToRgba(
                            textColor,
                            1,
                        )} 0%, ${hexToRgba(textColor, 0)} 100%)`,
                    }}
                />

                {/* The window, clipped to its 8px corners: the user's screenshot fills it. */}
                <div
                    style={{
                        position: "absolute",
                        left: WINDOW_PAD,
                        top: WINDOW_PAD,
                        width: WINDOW_W,
                        height: WINDOW_H,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: windowTint,
                    }}
                >
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt=""
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: imageFit,
                                objectPosition: "left top",
                                display: "block",
                            }}
                        />
                    ) : null}

                    {!image && (
                        <div className="flex h-full w-full items-center justify-center">
                            <span
                                style={{
                                    color: faint,
                                    fontSize: 12,
                                    lineHeight: 1,
                                    fontWeight: 600,
                                    letterSpacing: "0.16em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Your screenshot
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Brand lockup, on the top-left corner, centred on the mark. */}
            <div
                className="absolute flex items-center"
                style={{ left: PAD_X, top: LOCKUP_TOP, gap: LOCKUP_GAP }}
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
                      Empty state: the project's own mark, a diagonal bar punched
                      out of a filled square, so the two can never drift apart.
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
                            maxWidth: WORDMARK_WIDTH,
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: 1,
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/*
              The headline, centred in the clear band above the plate. It is HTML
              so it stays editable, and it keeps the reference's own white to
              silver ramp with the bright end tied to the text colour.
            */}
            <div
                className="absolute"
                style={{ left: (1200 - HEADLINE_WIDTH) / 2, top: HEADLINE_TOP, width: HEADLINE_WIDTH }}
            >
                <h1
                    style={{
                        margin: 0,
                        backgroundImage: `linear-gradient(${RAMP_DEG}deg, ${textColor} ${RAMP_START_STOP}%, ${hexToRgba(
                            textColor,
                            RAMP_END_ALPHA,
                        )} ${RAMP_END_STOP}%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 600),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, HEADLINE_SIZE)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, HEADLINE_TRACKING)}em`,
                        lineHeight: HEADLINE_LEADING,
                        textAlign: "center",
                        textWrap: "balance",
                        whiteSpace: "pre-line",
                    }}
                >
                    {title}
                </h1>
            </div>
        </TemplateCard>
    );
}
