"use client";

import { useId } from "react";
import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Violet Fade: a centred gradient headline over a faint grid, with a warm floor
 * glow rising from the bottom edge.
 *
 * Measured off refs/08.svg. The reference draws a 1200 x 630 black card, a
 * 0.5px white grid at 20% group opacity, a solid black panel from 282,153 to
 * 918,477 that clears the grid behind the type, then a radial floor glow on a
 * full-bleed rect. The glow's warm core sits just below the card, so black passes
 * through warm cream at the bottom edge and violet before it fades out under the
 * headline around y 400. The grid and glow are ported as one inline SVG: the
 * grid's 0.5px stroke is restated as a 1px stroke at 0.1 white, which rasterises
 * to the same pixels, and the glow keeps the reference's rotated rect and
 * user-space radial gradient untouched. Both ids carry `useId`, so the gallery's
 * many previews never share a definition. The central panel and the glow are
 * fixed paint, while the card's own fill shows around them, which keeps the
 * background controls meaningful.
 *
 * The headline is the reference's user-space diagonal ramp: violet at its top
 * right, magenta at 43.87%, and near-white at its bottom left. It is rebuilt as
 * a clipped CSS gradient at the same 228.8deg angle, with the bright end driven
 * by the user's text colour. The 96px type is centred in the black panel at one
 * em leading, which is the reference's own line advance.
 *
 * The reference has no lockup, so the app's own sits at the top of the panel: a
 * 28 x 36 replaceable mark beside an uppercase wordmark. The reference also has
 * no URL line, so the tag field provides one just above the panel's bottom edge.
 * Both are secondary to the headline. Geometry is mirrored by the `violet-fade`
 * branch in `templateLayout.ts`, so the card does not jump when it is detached.
 */

/** The reference's black panel; it sits over the grid and under the glow. */
const PANEL_X = 282;
const PANEL_Y = 153;
const PANEL_W = 636;
const PANEL_H = 324;

/** The reference's grid, in card pixels. */
const GRID_VERTICAL_X = [120.625, 280.5, 440.375, 600.25, 760.125, 920, 1079.88];
const GRID_HORIZONTAL_Y = [152.5, 315.25, 478];

/** The reference's headline paint. Both stops are fixed; the bright end follows the user. */
const HEADLINE_VIOLET = "#A900FF";
const HEADLINE_MAGENTA = "#C655FF";
const HEADLINE_ANGLE = 228.8;
/**
 * The reference's gradient starts above and right of the type box, so its ramp
 * reaches the visible ink already mixed. Restating the source stops on the CSS
 * gradient line therefore needs a stop before zero: with the violet at -5.8%,
 * magenta at 39.1% and the bright end at 96.5%, every sampled glyph keeps the
 * reference's own colour position.
 */
const HEADLINE_VIOLET_STOP = -5.8;
const HEADLINE_MAGENTA_STOP = 39.1;
const HEADLINE_BRIGHT_STOP = 96.5;

/** Panel lockup, measured off the rendered card. */
const LOCKUP_TOP = 173;
const MARK_WIDTH = 28;
const MARK_HEIGHT = 36;
const LOCKUP_GAP = 10;
const WORDMARK_SIZE = 20;
const WORDMARK_WIDTH = 180;

/** URL line, low enough to clear the headline but inside the panel. */
const URL_TOP = 432;
const URL_SIZE = 20;

/** The mark's project path, shared by the other templates' empty states. */
const MARK_PATH = "M0 0V48H36V0ZM6.9 5L31 37.2V5H6.9ZM29.1 43L5 10.8V43H29.1Z";

export default function VioletFade({
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
    const url = (tag || "").trim();
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const glowId = `${uid}-glow`;

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
            {/* Grid, black panel, floor glow: the reference's paint order. */}
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
                    <radialGradient
                        id={glowId}
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(1800 481.264) rotate(90) scale(749 1297.06)"
                    >
                        <stop offset="0.208781" stopColor="#FFE9C5" />
                        <stop offset="0.312499" stopColor="#500CB0" />
                        <stop offset="0.512059" stopOpacity="0" />
                        <stop offset="1" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <g opacity="0.1" stroke="#FFFFFF" strokeWidth="1">
                    {GRID_HORIZONTAL_Y.map((y) => (
                        <line key={`h-${y}`} x1="-39" y1={y} x2="1240" y2={y} />
                    ))}
                    {GRID_VERTICAL_X.map((x) => (
                        <line key={`v-${x}`} x1={x} y1="-10" x2={x} y2="641" />
                    ))}
                </g>

                <rect x={PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} fill="#000000" />

                <rect
                    x="1200"
                    y="629.632"
                    width="1200"
                    height="630"
                    transform="rotate(180 1200 629.632)"
                    fill={`url(#${glowId})`}
                />
            </svg>

            {/* Brand lockup, centred near the top of the panel. */}
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
                            maxWidth: WORDMARK_WIDTH,
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: 1,
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/* The headline, centred in the panel the grid leaves clear. */}
            <div
                className="absolute flex items-center justify-center"
                style={{
                    left: PANEL_X,
                    top: PANEL_Y,
                    width: PANEL_W,
                    height: PANEL_H,
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        maxWidth: PANEL_W,
                        backgroundImage: `linear-gradient(${HEADLINE_ANGLE}deg, ${HEADLINE_VIOLET} ${HEADLINE_VIOLET_STOP}%, ${HEADLINE_MAGENTA} ${HEADLINE_MAGENTA_STOP}%, ${textColor} ${HEADLINE_BRIGHT_STOP}%, ${textColor} 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 600),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 96)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.037)}em`,
                        lineHeight: 1,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>
            </div>

            {url && (
                <p
                    className="absolute left-0 right-0"
                    style={{
                        top: URL_TOP,
                        margin: 0,
                        color: tone.secondary,
                        fontStyle,
                        fontWeight: 500,
                        textDecoration,
                        fontSize: URL_SIZE,
                        lineHeight: 1,
                        letterSpacing: "0.01em",
                        textAlign: "center",
                    }}
                >
                    {url}
                </p>
            )}
        </TemplateCard>
    );
}
