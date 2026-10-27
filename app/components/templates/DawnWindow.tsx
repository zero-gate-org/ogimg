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
 * Dawn Window: a full bleed dawn field behind a centred two line headline and a
 * glass product window that bleeds off the bottom edge.
 *
 * Measured off refs/12.svg. The reference paints a 1200 x 630 black card, then a
 * full bleed rect carrying one enormous radial: #FFE702 at its centre, #FF5E01
 * at 0.235, #FF8CE4 at 0.434271 and #0051FF at its rim, with the rect turned 180
 * degrees around 1200,630. That is the pink top, lavender left, blue right and
 * warm orange bloom behind the top of the plate. The reference then throws a
 * 178px backdrop blur over the field, which softens the whole thing without
 * fading its edges, and paints a 1% black rect. The reference's own lockup and
 * notebook UI sit underneath the field, so none of that is visible; the app's
 * own lockup is painted after it instead.
 *
 * The CSS backdrop blur cannot survive the export path, which serialises the
 * card into a foreignObject. An SVG Gaussian on the field rect does survive it,
 * and it also reproduces the blur's clamped edge behaviour if the field is
 * mirrored into a nine tile pad and the copies are blurred together: the
 * reference's backdrop filter samples only the card and holds the edge colour
 * outside it, while blurring a single rect would fade its own rim to
 * transparent. The pad and the 178px sRGB radius below were fitted against the
 * reference raster, not guessed. A clip keeps the blurred pad inside the card,
 * and the source's 1% black rect still sits between the field and the plate.
 *
 * The plate is the reference's own alpha stack: a 990 x 849 rounded rect at
 * 104.5,304.5 with 23.5px corners, black at 0.8 under a white 0.2 hairline,
 * stroked a second time with a radial gradient (a 276.579 x 237.227 ellipse
 * centred at 599.5,339.351, white to transparent) that lights the top edge.
 * Inside it, 23.5 of plate all the way around, sits the 943 x 802 window with
 * 8px corners. The reference fills that window with the never.design task app;
 * none of it is ported, because the slot is where the user's own screenshot
 * belongs. The source's 70px backdrop blur behind the plate is left out, as in
 * Night Arc and Chroma Panel, because the plate is black at 0.8 and the field
 * behind it is already smooth.
 *
 * Type: the reference sets "Designed for / agile startups" with its ink at
 * x358..841, y96..253, which is Inter at 80px, weight 600, one em leading and
 * about -0.037 tracking. The cap sits a little over 9px inside the h1 box, so
 * the type box starts at 87 and is centred in the clear band above the plate.
 * The headline keeps a subtle white to silver ramp that follows the user's text
 * colour. The lockup is not in the reference's visible paint, so the app's own
 * mark and one line uppercase wordmark sit at 64,64 on the Night Arc pattern.
 * Geometry is mirrored by the `dawn-window` branch in `templateLayout.ts`, so
 * the card does not jump when it is detached.
 */

/** The dawn field's gradient transform and the reference's blur radius. */
const FIELD_GRADIENT_TRANSFORM = "matrix(0 956.5 -740.105 -567.945 1800 796.5)";
const FIELD_BLUR = 178;

/**
 * The nine tile mirror pad: identity in the middle, reflections across the four
 * edges, and the four corners reflected twice. Every matrix maps the 1200 x 630
 * field back onto a tile of the 3 x 3 pad around it, so the blur sees the edge
 * colour repeated outward instead of transparency.
 */
const FIELD_MIRRORS = [
    "matrix(1 0 0 1 0 0)",
    "matrix(1 0 0 -1 0 0)",
    "matrix(1 0 0 -1 0 1260)",
    "matrix(-1 0 0 1 0 0)",
    "matrix(-1 0 0 1 2400 0)",
    "matrix(-1 0 0 -1 0 0)",
    "matrix(-1 0 0 -1 2400 0)",
    "matrix(-1 0 0 -1 0 1260)",
    "matrix(-1 0 0 -1 2400 1260)",
];

/** Plate and window, as the reference measures them. */
const PLATE_X = 104.5;
const PLATE_Y = 304.5;
const PLATE_W = 990;
const PLATE_H = 849;
const PLATE_RADIUS = 23.5;
const WINDOW_X = 128;
const WINDOW_Y = 328;
const WINDOW_W = 943;
const WINDOW_H = 802;

/**
 * The plate's edge light: the reference strokes the plate a second time with a
 * radial gradient centred at 599.5,339.351 with a 276.579px horizontal radius
 * and a 237.227px vertical one. Those are the plate's own coordinates.
 */
const GLINT_X = 599.5 - PLATE_X;
const GLINT_Y = 339.351 - PLATE_Y;
const GLINT_RX = 276.579;
const GLINT_RY = 237.227;

/** Top left lockup: 33 x 44 mark, then the one line uppercase wordmark. */
const PAD_X = 64;
const LOCKUP_TOP = 64;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 24;
const WORDMARK_WIDTH = 220;

/**
 * The reference's ink starts at y96, and Inter's cap sits a little over 9px
 * inside an 80px, one em line box, so the h1 box starts at 87. Its 760px width
 * is centred on the card and holds the app's two line default.
 */
const HEADLINE_TOP = 87;
const HEADLINE_WIDTH = 760;
const HEADLINE_SIZE = 80;
const HEADLINE_LEADING = 1;
const HEADLINE_TRACKING = -0.037;

/**
 * The reference's white to silver paint, read the same way as Night Arc's ramp:
 * the bright end follows the user's text colour and the silver end is that
 * colour at 0.8. The stops sit where the ramp's axis crosses the h1 box.
 */
const RAMP_DEG = 201.1;
const RAMP_START_STOP = 29.4;
const RAMP_END_STOP = 70;
const RAMP_END_ALPHA = 0.8;

export default function DawnWindow({
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
    image,
    imageFit = "cover",
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const fieldGradientId = `${uid}-dawn-field`;
    const fieldBlurId = `${uid}-dawn-blur`;
    const fieldClipId = `${uid}-dawn-clip`;

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
              The dawn field, its clamped backdrop blur and the source's 1% black
              rect. The mirrored pad is what lets one SVG Gaussian match the
              reference's edge holding backdrop filter; the clip then keeps the
              blurred pad inside the card.
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
                    <radialGradient
                        id={fieldGradientId}
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform={FIELD_GRADIENT_TRANSFORM}
                    >
                        <stop stopColor="#FFE702" />
                        <stop offset="0.235" stopColor="#FF5E01" />
                        <stop offset="0.434271" stopColor="#FF8CE4" />
                        <stop offset="1" stopColor="#0051FF" />
                    </radialGradient>

                    <clipPath id={fieldClipId}>
                        <rect width="1200" height="630" />
                    </clipPath>

                    {/*
                      The filter region reaches 640px past the card, inside the
                      mirror pad, which is the reference's 178px blur spread on
                      every side. sRGB matches what the reference's backdrop
                      filter produced; linearRGB washes the warm centre out.
                    */}
                    <filter
                        id={fieldBlurId}
                        x="-640"
                        y="-640"
                        width="2480"
                        height="1910"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feGaussianBlur stdDeviation={FIELD_BLUR} />
                    </filter>
                </defs>

                <g clipPath={`url(#${fieldClipId})`}>
                    <g filter={`url(#${fieldBlurId})`}>
                        {FIELD_MIRRORS.map((mirror) => (
                            <g key={mirror} transform={mirror}>
                                {/*
                                  The reference turns this rect 180 degrees around
                                  1200,630. Keeping that turn on every copy is what
                                  anchors the gradient's yellow centre at
                                  600,463.5, under the plate.
                                */}
                                <rect
                                    x="1200"
                                    y="630"
                                    width="1200"
                                    height="630"
                                    transform="rotate(180 1200 630)"
                                    fill={`url(#${fieldGradientId})`}
                                />
                            </g>
                        ))}
                    </g>

                    {/* The source's 1% black wash over the field. */}
                    <rect width="1200" height="630" fill="#000000" fillOpacity="0.01" />
                </g>
            </svg>

            {/*
              The plate, bleeding off the bottom edge as the reference sets it.
              It is painted over the field and under the type, which is the
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
                  105.0 and 304.0 to 305.0: the box is pushed out half a pixel
                  and carries a whole pixel of border, which puts it on the same
                  pixel row and column the reference rasterizes.
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
                        left: WINDOW_X - PLATE_X,
                        top: WINDOW_Y - PLATE_Y,
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

            {/* Brand lockup, on the top left corner, centred on the mark. */}
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
              so it stays editable, and it keeps the reference's subtle white and
              silver ramp with the bright end tied to the text colour.
            */}
            <div
                className="absolute"
                style={{ left: (1200 - HEADLINE_WIDTH) / 2, top: HEADLINE_TOP, width: HEADLINE_WIDTH }}
            >
                <div
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
                </div>
            </div>
        </TemplateCard>
    );
}
