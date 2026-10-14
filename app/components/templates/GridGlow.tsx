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
 * A product claim set on a wide grid, with a screenshot that runs off the bottom
 * edge so the card reads as one continuous surface rather than a framed picture.
 *
 * The reference art paints the headline with a blue-to-violet-to-amber ramp. That
 * ramp lives here in the light instead: a violet bloom bleeding out of the
 * bottom-right corner, hot enough at the very corner to go cream. The type stays
 * a single solid colour, which is what keeps the card in one family when the user
 * changes it — and gradient-clipped text would not survive the export anyway.
 *
 * Geometry is mirrored by the `grid-glow` branch in `templateLayout.ts`, so the
 * card does not jump when it is detached into canvas layers.
 */
const CANVAS_HEIGHT = 630;
const MARK_TOP = 44;
const MARK_SIZE = 40;
const TYPE_TOP = 96;
/** The band between the mark and the screenshot; the headline is centred in it. */
const TYPE_BAND = 222;
const FRAME_LEFT = 83;
const FRAME_TOP = 318;
const FRAME_WIDTH = 1034;
/** 1034 / 646 is 16:10, so a typical dashboard shot fills the frame's width
    exactly; the frame then runs 334px past the fold and the shot bleeds off. */
const FRAME_HEIGHT = 646;
const FRAME_RADIUS = 18;
const GRID_CELL = 160;
/**
 * The grid is registered to the composition rather than to the canvas corner:
 * its centre line falls on x=600 and one of its horizontals falls on the
 * screenshot's top edge, so the layout reads as one system.
 */
const GRID_ORIGIN_X = 120; // lines at 120, 280, 440, 600, 760, 920, 1080
const GRID_ORIGIN_Y = FRAME_TOP - GRID_CELL; // lines at 158, 318, 478

/** Bloom hues. Background paint only — never applied to text. */
const VIOLET = "#A900FF";
const DEEP_VIOLET = "#500CB0";
const CORNER_CORE = "#FFE9C5";

const resolveFrameRadius = (imageRadius: number | undefined) =>
    typeof imageRadius === "number" && Number.isFinite(imageRadius) && imageRadius > 0 ? imageRadius : FRAME_RADIUS;

export default function GridGlow({
    title,
    textColor = "#FAFAFA",
    logoImage,
    image,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#08080C",
    gradientEnd = "#12121A",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.05,
    gridBlur = 0,
    titleSize,
    titleTracking,
    imageFit = "contain",
    imageRadius,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const tagline = (tag || "").trim();
    const gridLine = hexToRgba(gridColor ?? textColor, gridOpacity);
    const frameRadius = resolveFrameRadius(imageRadius);

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
              The wide grid is drawn here rather than inherited from the card's
              32px overlay — at 160px cells it reads as structure, not texture.
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
              light toward the corner the way they do in the artwork.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: [
                        `radial-gradient(38% 38% at 100% 100%, ${hexToRgba(CORNER_CORE, 0.3)} 0%, ${hexToRgba(
                            CORNER_CORE,
                            0,
                        )} 60%)`,
                        `radial-gradient(76% 76% at 100% 100%, ${hexToRgba(VIOLET, 0.44)} 0%, ${hexToRgba(
                            DEEP_VIOLET,
                            0.26,
                        )} 34%, ${hexToRgba(DEEP_VIOLET, 0)} 68%)`,
                    ].join(","),
                }}
            />

            {/* Brand mark, pinned top-centre so identity keeps one fixed spot. */}
            <div
                className="absolute"
                style={{
                    left: "50%",
                    top: MARK_TOP,
                    width: MARK_SIZE,
                    height: MARK_SIZE,
                    transform: "translateX(-50%)",
                }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoImage} alt="" className="h-full w-full object-contain" />
                ) : (
                    /* Empty state: a grid cell with a lit node at its corner. */
                    <svg
                        width={MARK_SIZE}
                        height={MARK_SIZE}
                        viewBox="0 0 40 40"
                        fill="none"
                        aria-hidden="true"
                        style={{ display: "block" }}
                    >
                        <rect
                            x="5.4"
                            y="5.4"
                            width="29.2"
                            height="29.2"
                            rx="8"
                            stroke={textColor}
                            strokeOpacity="0.5"
                            strokeWidth="2.1"
                        />
                        <line
                            x1="20"
                            y1="5.4"
                            x2="20"
                            y2="34.6"
                            stroke={textColor}
                            strokeOpacity="0.24"
                            strokeWidth="1.3"
                        />
                        <line
                            x1="5.4"
                            y1="20"
                            x2="34.6"
                            y2="20"
                            stroke={textColor}
                            strokeOpacity="0.24"
                            strokeWidth="1.3"
                        />
                        <circle cx="34.6" cy="5.4" r="4.3" fill={textColor} />
                    </svg>
                )}
            </div>

            {/* Headline and its supporting line, optically centred above the shot. */}
            <div
                className="absolute left-0 right-0 flex flex-col items-center justify-center"
                style={{ top: TYPE_TOP, height: TYPE_BAND, padding: "0 64px" }}
            >
                <h1
                    style={{
                        maxWidth: 900,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 64)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                        lineHeight: 1.04,
                        textAlign: "center",
                    }}
                >
                    {title}
                </h1>

                {tagline && (
                    <p
                        style={{
                            marginTop: 20,
                            maxWidth: 620,
                            color: tone.secondary,
                            fontSize: 20,
                            fontWeight: 400,
                            lineHeight: 1.45,
                            letterSpacing: -0.005,
                            textAlign: "center",
                        }}
                    >
                        {tagline}
                    </p>
                )}
            </div>

            {/*
              The screenshot is anchored to the bottom edge and runs past it, so
              the card is cropped by the product rather than framing it.
            */}
            {image ? (
                <div
                    className="absolute overflow-hidden"
                    style={{
                        left: FRAME_LEFT,
                        top: FRAME_TOP,
                        width: FRAME_WIDTH,
                        height: FRAME_HEIGHT,
                        borderRadius: frameRadius,
                        backgroundColor: tone.wash,
                        boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image}
                        alt="product screenshot"
                        className="h-full w-full"
                        style={{
                            objectFit: imageFit,
                            objectPosition: "top center",
                            borderRadius: frameRadius,
                        }}
                    />

                    {/* Light from the corner bloom grazing the panel's top edge. */}
                    <div
                        className="pointer-events-none absolute left-0 right-0"
                        style={{
                            top: 0,
                            height: 1,
                            background: `linear-gradient(90deg, ${tone.hairline} 0%, ${hexToRgba(
                                VIOLET,
                                0.5,
                            )} 58%, ${hexToRgba(CORNER_CORE, 0.72)} 100%)`,
                        }}
                    />
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: `radial-gradient(46% 30% at 100% 0%, ${hexToRgba(
                                VIOLET,
                                0.13,
                            )} 0%, ${hexToRgba(VIOLET, 0)} 72%)`,
                        }}
                    />
                </div>
            ) : (
                /*
                  The empty frame stops one radius past the fold: the label stays
                  on canvas, and its bottom corners hide below the edge exactly as
                  the bleeding filled frame's do.
                */
                <ImageSlot
                    /* Positioned via style: ImageSlot already carries a `relative`
                       class, and an inline position is the only thing that beats it. */
                    style={{
                        position: "absolute",
                        left: FRAME_LEFT,
                        top: FRAME_TOP,
                        width: FRAME_WIDTH,
                        height: CANVAS_HEIGHT - FRAME_TOP + frameRadius,
                    }}
                    image={image}
                    alt=""
                    radius={frameRadius}
                    tone={tone}
                    emptyLabel="Add a product screenshot"
                />
            )}
        </TemplateCard>
    );
}
