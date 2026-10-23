"use client";

import TemplateCard, { ImageSlot } from "./TemplateCard";
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
 * Prism Frame: a product panel set inside a rainbow bezel.
 *
 * The card is cut in two. The left half is bare background and holds one 64px
 * rail: the lockup at the top, the headline low down. The right half is a single
 * saturated ramp, yellow at the top of the band through coral and pink to violet
 * at the bottom, bleeding off the top, right and bottom edges. Inside that band
 * sits a dark panel with its own 23.5px bezel, and the panel is the image slot,
 * so it walks off the canvas the way the artwork's product shot does.
 *
 * The rainbow is background paint and stays inside the frame. The reference
 * outlines its headline in a silver ramp; here the type is solid `textColor`,
 * because gradient letters stop matching the card the moment a user changes the
 * text colour and do not survive the foreignObject export anyway. The band
 * carries the colour so the type can carry the hierarchy.
 */

/** Rainbow hues and the panel ink. Background paint only, never applied to text. */
const RAINBOW_YELLOW = "#FFE702";
const RAINBOW_PINK = "#FF8CE4";
const RAINBOW_BLUE = "#0051FF";
const PANEL_INK = "#0A0A0C";

/** Left edge of the band. Everything to the left of it is the user's own fill. */
const BAND_X = 609;

/**
 * The reference's axis is the band's own top-left corner to its bottom-right, so
 * `to bottom right` on this exact box reproduces it stop for stop.
 */
const RAINBOW = `linear-gradient(to bottom right, ${RAINBOW_YELLOW} 0%, ${RAINBOW_PINK} 43.4%, ${RAINBOW_BLUE} 100%)`;

/**
 * The panel and its screen both run past the canvas, which is why their sizes are
 * larger than the space they appear to occupy. Only the top-left radius is ever
 * seen.
 */
const PANEL = { left: 649.5, top: 40.5, width: 1153, height: 849, radius: 23.5 };
const BEZEL = 23.5;
const SCREEN_RADIUS = 8;

/** Rail padding, shared by the lockup and the headline. */
const PAD = 64;
const LOCKUP_TOP = 80;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 27;
/** Tight enough that two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.88;
const WORDMARK_WIDTH = 112;

const HEADLINE_WIDTH = 480;
/** Bottom of the text box, solved so the second baseline lands at y 545. */
const HEADLINE_BOTTOM = 76;
const HEADLINE_LINE = 0.98;
const HEADLINE_BASELINE_PX = 67;
const HEADLINE_TRACKING_EM = -0.08;

export default function PrismFrame({
    title,
    textColor = "#FAFAFA",
    logoImage,
    image,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0A0A0C",
    gradientEnd = "#0A0A0C",
    gradientAngle = 150,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
    imageFit = "cover",
    imageRadius,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const brandName = (logo || "").trim();

    // The light in the reference sits just off the canvas at the top right of the
    // panel, so the edge highlight ramps up as it travels toward that corner.
    const edgeLight = `linear-gradient(90deg, ${hexToRgba(textColor, 0.06)} 0%, ${hexToRgba(
        textColor,
        0.16,
    )} 46%, ${hexToRgba(textColor, 0.4)} 100%)`;

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
            {/* The only loud thing on the card, and the frame for everything else. */}
            <div
                style={{
                    position: "absolute",
                    left: BAND_X,
                    top: 0,
                    width: 1200 - BAND_X,
                    height: 630,
                    background: RAINBOW,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: PANEL.left,
                    top: PANEL.top,
                    width: PANEL.width,
                    height: PANEL.height,
                    borderRadius: PANEL.radius,
                    // Eighty percent ink, so the bezel still reads through the panel
                    // at its corners the way it does in the artwork.
                    background: hexToRgba(PANEL_INK, 0.82),
                    boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: PANEL.radius,
                        right: PANEL.radius,
                        height: 1,
                        background: edgeLight,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: BEZEL,
                        top: BEZEL,
                        right: BEZEL,
                        bottom: BEZEL,
                        borderRadius: SCREEN_RADIUS,
                        overflow: "hidden",
                    }}
                >
                    <ImageSlot
                        className="h-full w-full"
                        image={image}
                        fit={imageFit}
                        radius={imageRadius}
                        tone={tone}
                        emptyLabel="Product screenshot"
                    />
                </div>
            </div>

            {/* Lockup at the head of the rail: the mark, 11px, then the wordmark. */}
            <div
                style={{
                    position: "absolute",
                    left: PAD,
                    top: LOCKUP_TOP,
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: LOCKUP_GAP,
                }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{ width: MARK_WIDTH, height: MARK_HEIGHT, objectFit: "contain", flexShrink: 0 }}
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

                {brandName && (
                    <span
                        style={{
                            maxWidth: WORDMARK_WIDTH,
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            fontSize: WORDMARK_SIZE,
                            lineHeight: WORDMARK_LEADING,
                            letterSpacing: "-0.02em",
                            textTransform: "uppercase",
                            textDecoration,
                        }}
                    >
                        {brandName}
                    </span>
                )}
            </div>

            {/* The headline sits low on the rail, clear of the band by 65px. */}
            <div
                style={{
                    position: "absolute",
                    left: PAD,
                    bottom: HEADLINE_BOTTOM,
                    width: HEADLINE_WIDTH,
                    zIndex: 2,
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, HEADLINE_BASELINE_PX)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, HEADLINE_TRACKING_EM)}em`,
                        lineHeight: HEADLINE_LINE,
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>
            </div>
        </TemplateCard>
    );
}
