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
 * Afterglow: a centred headline in a black panel, with two enormous radial
 * rings sweeping in from beyond the bottom of the card.
 *
 * Measured off refs/09.svg. The reference draws a 1200 x 630 black card, a
 * 0.5px white grid at 20% group opacity, a solid black panel from 280.75,0 to
 * 919.25,362 that clears the grid behind the type, then two radial rings on
 * full-bleed rotated rects. The first ring is pink through orange. It is painted,
 * then a 182px backdrop blur is thrown over the whole card, which is what turns
 * the ring into the soft upper-right flare and fades the panel's lower edge. The
 * second ring, lavender through blue, is painted crisp on top of that blur and
 * the panel.
 *
 * The grid is restated as 1px white at 0.1, which rasterises to the reference's
 * 0.5px at 0.2, and the rings keep the vector's rotated rects and user-space
 * gradients untouched. A CSS filter would not travel through the export, but an
 * inline SVG filter is part of the serialised markup, so the grid, panel and
 * flare are softened by SVG filters. The grid/panel group and the flare rect
 * carry separate filters: a filter over the combined group draws a ghost of the
 * HTML headline into the flare when the card is rasterised for export. The
 * filter blends in linear light to match the reference's backdrop blur, and its
 * radius is the value that lands on the reference raster rather than the nominal
 * 182px CSS radius. The flare is painted on an axis-aligned rect with the
 * source's 180 degree turn folded into its gradient transform, because a filter
 * on a rotated rect leaves a visible seam. The rect is grown past the card for
 * the same reason: the reference's backdrop blur keeps the field's brightness at
 * the top and left edges, while a filter applied to the exact card rect would
 * fade to transparent there.
 *
 * The headline is HTML so it stays editable. It is centred in the reference's
 * panel at 104px with a one em advance and a 0.79 text-colour ramp at its right
 * edge, which reproduces the artwork's white-to-silver paint without fixing the
 * type to one colour. The lockup is the app's own: a 33 x 44 replaceable mark
 * and a one-line uppercase wordmark centred on the reference's bottom line. The
 * reference's two-line "NEVER DESIGN" wordmark is replaced by the app's single
 * word domain. Geometry is mirrored by the `afterglow` branch in
 * `templateLayout.ts`, so the card does not jump when it is detached.
 */

/** The reference's black panel; it sits over the grid and under both rings. */
const PANEL_X = 280.75;
const PANEL_Y = 0;
const PANEL_W = 638.5;
const PANEL_H = 362;

/** The reference's grid, in card pixels. */
const GRID_VERTICAL_X = [120.125, 280, 439.875, 599.75, 759.625, 919.5, 1079.38];
const GRID_HORIZONTAL_Y = [157.25, 314.75, 472.25, 629.75];

/**
 * The reference's 182px backdrop blur, restated as a standard deviation. The
 * value is fitted to the reference raster: the nominal CSS radius would be half
 * of it, but the reference's edge behaviour keeps more of the flare alive than a
 * naive SVG blur of the same source does.
 */
const GLOW_BLUR = 120;

/**
 * The reference's two line ink is 628 wide inside the 638.5 panel. The app's
 * default copy needs a little more room than that to hold the same two line
 * setting, so the type box is centred on the panel but a little wider; the
 * panel itself keeps the reference's measurements.
 */
const HEADLINE_WIDTH = 716;

/** Lockup: 33 x 44 mark on the reference's bottom line, beside the wordmark. */
const LOCKUP_TOP = 506;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 27;

/** The mark's project path, shared by the other templates' empty states. */
const MARK_PATH = "M0 0V48H36V0ZM6.9 5L31 37.2V5H6.9ZM29.1 43L5 10.8V43H29.1Z";

export default function Afterglow({
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
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const blurId = `${uid}-afterglow-blur`;
    const flareId = `${uid}-afterglow-flare`;
    const ringId = `${uid}-afterglow-ring`;

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
            {/* Grid, panel, pink flare, its blur, then the crisp violet ring: the reference's paint order. */}
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
                    <filter
                        id={blurId}
                        filterUnits="userSpaceOnUse"
                        x="-1200"
                        y="-1200"
                        width="3600"
                        height="2700"
                        colorInterpolationFilters="linearRGB"
                    >
                        <feGaussianBlur stdDeviation={GLOW_BLUR} />
                    </filter>

                    <radialGradient
                        id={flareId}
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(180 1200 630) translate(2138.13 1364.31) rotate(-135) scale(1169.77 1169.77)"
                    >
                        <stop stopOpacity="0" />
                        <stop offset="0.487941" stopOpacity="0" />
                        <stop offset="0.713185" stopColor="#FF007A" />
                        <stop offset="0.933625" stopColor="#FF8E19" />
                    </radialGradient>

                    <radialGradient
                        id={ringId}
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(1800 1598.5) rotate(-119.074) scale(1128.73 1128.73)"
                    >
                        <stop stopOpacity="0" />
                        <stop offset="0.487941" stopOpacity="0" />
                        <stop offset="0.713185" stopColor="#C582FE" />
                        <stop offset="0.933625" stopColor="#3319FF" />
                    </radialGradient>
                </defs>

                {/*
                  The grid and panel share one blur. The flare gets its own
                  filter on the rect: a filter on a group containing the flare
                  draws a ghost of the HTML headline into the flare when the
                  card is rasterised for export, while a rect filter survives
                  the export unchanged.
                */}
                <g filter={`url(#${blurId})`}>
                    <g opacity="0.1" stroke="#FFFFFF" strokeWidth="1">
                        {GRID_HORIZONTAL_Y.map((y) => (
                            <line key={`h-${y}`} x1="-39" y1={y} x2="1240" y2={y} />
                        ))}
                        {GRID_VERTICAL_X.map((x) => (
                            <line key={`v-${x}`} x1={x} y1="-10" x2={x} y2="641" />
                        ))}
                    </g>

                    <rect x={PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} fill="#000000" />
                </g>

                {/*
                  The 180 degree turn that placed the source rect lives in the
                  flare gradient now, so the filtered rect stays axis-aligned and
                  Chrome does not draw a seam along the rotation. The rect runs
                  360px past the card so the blur keeps the field's edge
                  brightness, as the reference's backdrop blur does.
                */}
                <rect
                    x="-360"
                    y="-360"
                    width="1920"
                    height="1350"
                    fill={`url(#${flareId})`}
                    filter={`url(#${blurId})`}
                />

                {/* Painted after the blur, so this ring stays crisp. */}
                <rect
                    x="1200"
                    y="630"
                    width="1200"
                    height="630"
                    transform="rotate(180 1200 630)"
                    fill={`url(#${ringId})`}
                />
            </svg>

            {/* Brand lockup, centred on the reference's bottom line. */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: LOCKUP_TOP, gap: LOCKUP_GAP }}
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
                        <path fillRule="evenodd" d={MARK_PATH} fill={textColor} />
                    </svg>
                )}

                {wordmark && (
                    <span
                        style={{
                            maxWidth: 240,
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

            {/* The headline, centred on the panel at one em leading. */}
            <div
                className="absolute flex items-center justify-center"
                style={{
                    left: (1200 - HEADLINE_WIDTH) / 2,
                    top: PANEL_Y,
                    width: HEADLINE_WIDTH,
                    height: PANEL_H,
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        width: "100%",
                        // The reference ramps white into silver across the ink,
                        // and the clipped ramp keeps following the text colour.
                        backgroundImage: `linear-gradient(82deg, ${textColor} 0%, ${hexToRgba(textColor, 0.79)} 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 600),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 104)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.037)}em`,
                        lineHeight: 1,
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
