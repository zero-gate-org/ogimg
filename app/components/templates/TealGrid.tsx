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
 * A product claim on a dark plate, with the product itself running off the
 * bottom edge.
 *
 * The reference paints its headline with a cream-to-teal-to-indigo ramp. That
 * ramp lives here in the light instead: it rises out of the lower area as a
 * teal bloom, warm at its core and indigo where it dies, and the type stays one
 * solid colour — which is what keeps the card in a single family when the user
 * changes it, and gradient-clipped text would not survive the export anyway.
 *
 * The plate is the other half of the design. The reference sets its headline on
 * a plain that is bounded by the grid itself, so the grid's lines stop at the
 * type rather than running through it. Reproducing that is what makes the card
 * read as built rather than decorated.
 *
 * Geometry is mirrored by the `teal-grid` branch in `templateLayout.ts`, so the
 * card does not jump when it is detached into canvas layers.
 */
const CANVAS_HEIGHT = 630;
const GRID_CELL = 250;
/** Verticals land on 225 / 475 / 725 / 975, one horizontal on the shell's edge. */
const GRID_ORIGIN_X = 225;
/** The plate is three cells wide and centred, and sits just inside the grid. */
const PLATE_LEFT = 229;
const PLATE_WIDTH = 742;
const MARK_TOP = 46;
const MARK_SIZE = 40;
const TYPE_TOP = 108;
/** Space left for the headline block: from the mark down to the shell's edge. */
const TYPE_BAND = 232;
const SHELL_LEFT = 83;
/** The plate ends exactly where the shell begins, and a grid line falls on both. */
const SHELL_TOP = 340;
const SHELL_WIDTH = 1034;
/** Chrome strip above the user's shot, so the shell reads as a running window. */
const BEZEL_HEIGHT = 24;
/** 802 tall: a wide dashboard fills the shell's width and the fold cuts it off. */
const INNER_HEIGHT = 802;
const DEFAULT_SHELL_RADIUS = 24;
/** The reference's ramp, kept as background paint only. */
const TEAL = "#0C97B0";
const INDIGO = "#500CB0";
const CREAM = "#FFE9C5";

const resolveShellRadius = (imageRadius: number | undefined) =>
    typeof imageRadius === "number" && Number.isFinite(imageRadius) && imageRadius > 0
        ? imageRadius
        : DEFAULT_SHELL_RADIUS;

export default function TealGrid({
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
    gradientEnd = "#0E1416",
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
    const shellRadius = resolveShellRadius(imageRadius);
    const innerRadius = Math.max(4, shellRadius - 16);
    /** Depth rather than a hue: the plate and the shell's bezel push the card stock
        further along its own light, so a light card inverts without a second palette. */
    const solidify = (alpha: number) => hexToRgba(tone.veil, alpha);

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
              Wide grid, drawn here rather than inherited from the card's 32px
              overlay: at 250px cells it reads as structure. The origin is
              registered to the composition, so the outer verticals frame the
              plate and one horizontal lands on the shell's top edge.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: [
                        `linear-gradient(${gridLine} 1px, transparent 1px)`,
                        `linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
                    ].join(","),
                    backgroundSize: `${GRID_CELL}px ${GRID_CELL}px, ${GRID_CELL}px ${GRID_CELL}px`,
                    backgroundPosition: `${GRID_ORIGIN_X}px ${SHELL_TOP - GRID_CELL}px, ${GRID_ORIGIN_X}px ${
                        SHELL_TOP - GRID_CELL
                    }px`,
                }}
            />

            {/*
              The plate sits over the grid and clears it behind the headline. Its
              bottom edge hides under the shell, so what survives on screen is two
              verticals framing the type — the reference's whole structure.
            */}
            <div
                className="absolute"
                style={{
                    left: PLATE_LEFT,
                    top: 0,
                    width: PLATE_WIDTH,
                    height: SHELL_TOP,
                    backgroundColor: solidify(0.62),
                }}
            />

            {/*
              The ramp, moved from the type into the light: teal bleeding up out of
              the lower area, warm at the core, indigo where it fades out to the
              right. Drawn over the plate so the bottom of the type sits in it.
            */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: [
                        `radial-gradient(24% 24% at 38% 50%, ${hexToRgba(CREAM, 0.1)} 0%, ${hexToRgba(CREAM, 0)} 64%)`,
                        `radial-gradient(64% 58% at 50% 55%, ${hexToRgba(TEAL, 0.38)} 0%, ${hexToRgba(
                            TEAL,
                            0.14,
                        )} 40%, ${hexToRgba(TEAL, 0)} 74%)`,
                        `radial-gradient(52% 48% at 88% 94%, ${hexToRgba(INDIGO, 0.26)} 0%, ${hexToRgba(
                            INDIGO,
                            0,
                        )} 68%)`,
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
                    /* Empty state: a node on the grid, with the line running out either side. */
                    <svg
                        width={MARK_SIZE}
                        height={MARK_SIZE}
                        viewBox="0 0 40 40"
                        fill="none"
                        aria-hidden="true"
                        style={{ display: "block" }}
                    >
                        <circle cx="20" cy="20" r="9.6" stroke={textColor} strokeOpacity="0.9" strokeWidth="2.2" />
                        <line x1="0" y1="20" x2="7" y2="20" stroke={textColor} strokeOpacity="0.4" strokeWidth="2.2" />
                        <line
                            x1="33"
                            y1="20"
                            x2="40"
                            y2="20"
                            stroke={textColor}
                            strokeOpacity="0.4"
                            strokeWidth="2.2"
                        />
                    </svg>
                )}
            </div>

            {/* Headline and its supporting line, centred in the plate above the shot. */}
            <div
                className="absolute left-0 right-0 flex flex-col items-center justify-center"
                style={{ top: TYPE_TOP, height: TYPE_BAND, padding: "0 64px" }}
            >
                <h1
                    style={{
                        maxWidth: 700,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 64)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                        lineHeight: 1.04,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>

                {tagline && (
                    <p
                        style={{
                            marginTop: 24,
                            maxWidth: 560,
                            color: tone.secondary,
                            fontSize: 18,
                            fontWeight: 400,
                            lineHeight: 1.45,
                            letterSpacing: 0.005,
                            textAlign: "center",
                        }}
                    >
                        {tagline}
                    </p>
                )}
            </div>

            {/*
              The shot is anchored along the bottom edge and runs past it, so the
              card is cropped by the product rather than framing a picture of it.
            */}
            <div
                className="absolute"
                style={{
                    left: SHELL_LEFT,
                    top: SHELL_TOP,
                    width: SHELL_WIDTH,
                    height: BEZEL_HEIGHT + INNER_HEIGHT,
                    borderRadius: shellRadius,
                    backgroundColor: solidify(0.5),
                    boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                }}
            >
                {/* The bloom catching the chrome strip, so the shell arrives lit. */}
                <div
                    className="pointer-events-none absolute left-0 right-0 top-0"
                    style={{
                        height: BEZEL_HEIGHT,
                        borderRadius: `${shellRadius}px ${shellRadius}px 0 0`,
                        borderBottom: `1px solid ${tone.hairline}`,
                        background: `radial-gradient(58% 140% at 50% 100%, ${hexToRgba(TEAL, 0.2)} 0%, ${hexToRgba(
                            TEAL,
                            0,
                        )} 72%)`,
                    }}
                />

                {/* The top hairline is brightest where the light is strongest. */}
                <div
                    className="pointer-events-none absolute left-0 right-0 top-0"
                    style={{
                        height: 1,
                        background: `linear-gradient(90deg, transparent 0%, ${tone.hairline} 18%, ${hexToRgba(
                            textColor,
                            0.5,
                        )} 50%, ${tone.hairline} 82%, transparent 100%)`,
                    }}
                />

                {image ? (
                    <div
                        className="absolute overflow-hidden"
                        style={{
                            left: 0,
                            right: 0,
                            top: BEZEL_HEIGHT,
                            height: INNER_HEIGHT,
                            borderRadius: innerRadius,
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
                                borderRadius: innerRadius,
                            }}
                        />
                    </div>
                ) : (
                    /*
                      The empty plate stops one radius past the fold: the label
                      stays on canvas, and its bottom corners hide below the edge
                      exactly as the bleeding filled plate's do.
                    */
                    <ImageSlot
                        /* Positioned via style: ImageSlot already carries a `relative`
                           class, and an inline position is the only thing that beats it. */
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: BEZEL_HEIGHT,
                            height: CANVAS_HEIGHT - SHELL_TOP - BEZEL_HEIGHT + innerRadius,
                        }}
                        image={image}
                        alt=""
                        radius={innerRadius}
                        tone={tone}
                        emptyLabel="Add a product screenshot"
                    />
                )}
            </div>
        </TemplateCard>
    );
}
