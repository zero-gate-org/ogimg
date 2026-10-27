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

/** One padding module drives the mark, the headline rail, and the gutter to the frame. */
const PAD = 64;
const MARK_SIZE = 44;
const HEADLINE_WIDTH = 560;
const TAG_WIDTH = 452;

/**
 * The device leaves the canvas on the right and the bottom, so its top-left
 * corner is the only radius ever seen. These numbers are mirrored one for one
 * by the `spotlight` branch of `buildPresetLayers`.
 */
const FRAME = { left: 672, top: 76, width: 624, height: 636, radius: 30, bezel: 22 };
const SCREEN_RADIUS = 10;

/**
 * Spotlight — a product shot standing in a shaft of light.
 *
 * One diagonal beam falls from the top-right across near-black. The headline is
 * anchored bottom-left in the dark half of it, the brand mark holds the opposite
 * corner, and a translucent device frame walks off the right edge carrying the
 * screenshot.
 *
 * The beam is painted *under* the frame on purpose. The frame's fill is only a
 * few percent of the text colour, so the light reads through the glass the way
 * it does in the reference, rather than the frame sitting on top of a hole in it.
 *
 * Structure stays hairline-driven: the frame is defined by a 1px edge plus a
 * highlight strip along the top, no shadows. The beam, the frame, and the
 * empty-state mark are all drawn in code; the only raster pixels are the user's
 * logo and screenshot.
 */
export default function Spotlight({
    title,
    textColor = "#FAFAFA",
    logoImage,
    image,
    tag,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0A0A0C",
    gradientEnd = "#161618",
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
    const tagline = (tag || "").trim();

    /**
     * The beam is the user's text colour at low alpha rather than a fixed hue, so
     * a light card gets shade falling across it instead of glow. One colour still
     * drives the whole card.
     */
    const lit = (alpha: number) => hexToRgba(textColor, alpha);

    // The source sits just off the top-right corner; the shaft is the same light
    // stretched into a band whose leading edge (the 56% stop) runs from x 868 on
    // the top edge down to x 518 on the bottom edge. The rail therefore stays in
    // near-darkness and only the brightest few letters of the headline brush the
    // edge of the beam, exactly as they do in the reference.
    const beam = [
        `radial-gradient(44% 52% at 96% -12%, ${lit(0.14)} 0%, ${lit(0.045)} 44%, ${lit(0)} 76%)`,
        `linear-gradient(119deg, ${lit(0)} 0%, ${lit(0)} 42%, ${lit(0.02)} 50%, ${lit(0.085)} 56%, ${lit(0.05)} 60%, ${lit(0.045)} 74%, ${lit(0.03)} 100%)`,
    ].join(",");

    const frameFill = `linear-gradient(168deg, ${lit(0.075)} 0%, ${lit(0.03)} 42%, ${lit(0.015)} 100%)`;

    // Light catches the top edge hardest where the beam crosses it, which is off
    // canvas to the right, so the highlight ramps up as it leaves the card.
    const frameEdge = `linear-gradient(90deg, ${lit(0.05)} 0%, ${lit(0.16)} 42%, ${lit(0.4)} 82%, ${lit(0.46)} 100%)`;

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
            <div style={{ position: "absolute", inset: 0, zIndex: 1, background: beam }} />

            <div
                style={{
                    position: "absolute",
                    left: FRAME.left,
                    top: FRAME.top,
                    width: FRAME.width,
                    height: FRAME.height,
                    zIndex: 2,
                    borderRadius: FRAME.radius,
                    background: frameFill,
                    boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: FRAME.radius,
                        right: FRAME.radius,
                        height: 1,
                        background: frameEdge,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: FRAME.bezel,
                        top: FRAME.bezel,
                        right: FRAME.bezel,
                        bottom: FRAME.bezel,
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

            <div
                style={{
                    position: "absolute",
                    left: PAD,
                    top: PAD,
                    zIndex: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{ width: MARK_SIZE, height: MARK_SIZE, objectFit: "contain", flexShrink: 0 }}
                    />
                ) : (
                    <svg
                        width={MARK_SIZE}
                        height={MARK_SIZE}
                        viewBox="0 0 44 44"
                        fill="none"
                        style={{ flexShrink: 0 }}
                        aria-hidden="true"
                    >
                        <rect x="1.75" y="1.75" width="40.5" height="40.5" rx="12" stroke={lit(0.32)} strokeWidth="1.5" />
                        <path d="M12.5 31.5 25.5 15.5" stroke={textColor} strokeWidth="3" strokeLinecap="round" />
                        <circle cx="31.5" cy="12.5" r="3.5" fill={textColor} />
                    </svg>
                )}

                {brandName && (
                    <p
                        style={{
                            margin: 0,
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 600),
                            textDecoration,
                            fontSize: 21,
                            lineHeight: 1,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {brandName}
                    </p>
                )}
            </div>

            <div
                style={{
                    position: "absolute",
                    left: PAD,
                    bottom: PAD,
                    width: HEADLINE_WIDTH,
                    zIndex: 3,
                }}
            >
                <div
                    style={{
                        margin: 0,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 76)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                        lineHeight: 1.02,
                        textWrap: "balance",
                    }}
                >
                    {title}
                </div>

                {tagline && (
                    <>
                        <div
                            style={{
                                width: 56,
                                height: 1,
                                marginTop: 24,
                                backgroundColor: tone.hairline,
                            }}
                        />
                        <p
                            style={{
                                margin: "24px 0 0",
                                maxWidth: TAG_WIDTH,
                                color: tone.secondary,
                                fontSize: 20,
                                lineHeight: 1.45,
                            }}
                        >
                            {tagline}
                        </p>
                    </>
                )}
            </div>
        </TemplateCard>
    );
}
