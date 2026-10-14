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
 * Stacked Deck — a claim held up by a fan of screens.
 *
 * The reference paints its headline with a cream-to-teal ramp and stands the
 * product shot on a second copy of itself. The ramp moves into the light here:
 * a jade bloom rising out of the top edge over a green-to-black wash, with the
 * type left in one solid colour so the card stays in a single family when the
 * user changes it. The second copy becomes the actual subject — two dimmer
 * frames peek out from behind the main one, so the bottom of the card reads as
 * a deck being squared up rather than a screenshot in a box.
 *
 * The reference crops the shot at the fold instead of shrinking it to fit, so
 * the screen here is a full 16:9 plate that runs past the bottom edge: a normal
 * screenshot fills it edge to edge and the card decides where the story stops.
 *
 * Structure is hairline-driven — the frames are defined by a 1px edge and a
 * light catch along the top, not by shadows. Every layer is drawn in code; the
 * only raster pixels are the user's mark and screenshot.
 *
 * Geometry is mirrored one for one by the `deck` branch of `buildPresetLayers`,
 * so the card does not jump when it is detached into canvas layers.
 */
const CANVAS_HEIGHT = 630;
const MARK_TOP = 42;
const MARK_SIZE = 44;
/** Where the headline's line box starts, just clear of the mark. */
const TYPE_TOP = 106;
const FRAME_LEFT = 104;
const FRAME_TOP = 372;
const FRAME_WIDTH = 992;
const FRAME_BEZEL = 22;
/** The frame's radius is always one step past the screen's, so the bezel holds. */
const FRAME_RADIUS_STEP = 16;
const DEFAULT_SCREEN_RADIUS = 10;
const SCREEN_TOP = FRAME_TOP + FRAME_BEZEL;
const SCREEN_WIDTH = FRAME_WIDTH - FRAME_BEZEL * 2;
/** 16:9 of the plate's own width, so a standard screenshot fills it exactly. */
const SCREEN_HEIGHT = Math.round(SCREEN_WIDTH * (9 / 16));
/** How much of the screen is actually on canvas before the fold cuts it. */
const SCREEN_VISIBLE = CANVAS_HEIGHT - SCREEN_TOP;
/**
 * The deck: identical frames shifted out and dropped, so only a corner of each
 * escapes the one in front. The shift stays inside the 20px margin so the rounded
 * corner is always on canvas — a frame bleeding off both edges would stop
 * reading as a card.
 */
const DECK_SHIFT = 84;
const DECK_DROP = 52;
const DECK_CARDS = [
    { key: "left", left: FRAME_LEFT - DECK_SHIFT, top: FRAME_TOP + DECK_DROP },
    { key: "right", left: FRAME_LEFT + DECK_SHIFT, top: FRAME_TOP + DECK_DROP },
] as const;
/** How far the copies behind are pushed back into the wash. */
const DECK_GHOST = 0.16;

/** The reference's bloom, kept as background paint rather than type colour. */
const JADE = "#0CB0A5";
const MINT = "#2BE0B7";

const resolveScreenRadius = (imageRadius: number | undefined) =>
    typeof imageRadius === "number" && Number.isFinite(imageRadius) && imageRadius > 0
        ? imageRadius
        : DEFAULT_SCREEN_RADIUS;

export default function StackedDeck({
    title,
    textColor = "#E8EAED",
    logoImage,
    image,
    tag,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0B3B36",
    gradientEnd = "#05070A",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
    imageFit = "contain",
    imageRadius,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const tagline = (tag || "").trim();
    const screenRadius = resolveScreenRadius(imageRadius);
    const frameRadius = screenRadius + FRAME_RADIUS_STEP;
    const frameHeight = SCREEN_HEIGHT + FRAME_BEZEL * 2;

    /**
     * Each plate is a solid neutral veil under a few percent of the text colour.
     * The veil matters: without it the frames behind show straight through the
     * one in front and the deck collapses into one shape.
     */
    const plate = (tint: number, veil: number) =>
        [
            `linear-gradient(178deg, ${hexToRgba(textColor, tint)} 0%, ${hexToRgba(textColor, tint * 0.34)} 46%, ${hexToRgba(
                textColor,
                tint * 0.18,
            )} 100%)`,
            hexToRgba(tone.veil, veil),
        ].join(",");

    const deckPlate = plate(0.05, 0.8);
    const mainPlate = plate(0.085, 0.88);
    const deckEdge = hexToRgba(textColor, 0.13);
    const deckScreen = hexToRgba(textColor, 0.08);

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
              One painted layer for the whole light story: jade blooming out of the
              top edge, a second wash leaning to the left where the reference is
              brightest, and a scrim that pulls the bottom to black so the deck can
              sit in front of it.
            */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "none",
                    background: [
                        `radial-gradient(88% 74% at 50% -22%, ${hexToRgba(MINT, 0.26)} 0%, ${hexToRgba(
                            JADE,
                            0.16,
                        )} 38%, ${hexToRgba(JADE, 0)} 76%)`,
                        `radial-gradient(46% 44% at 14% -10%, ${hexToRgba(JADE, 0.24)} 0%, ${hexToRgba(
                            JADE,
                            0,
                        )} 72%)`,
                        `linear-gradient(180deg, ${hexToRgba(tone.veil, 0)} 44%, ${hexToRgba(
                            tone.veil,
                            0.62,
                        )} 100%)`,
                    ].join(","),
                }}
            />

            {/* The two frames behind. Same object as the main one, dimmer and dropped. */}
            {DECK_CARDS.map((card) => (
                <div
                    key={card.key}
                    style={{
                        position: "absolute",
                        left: card.left,
                        top: card.top,
                        width: FRAME_WIDTH,
                        height: frameHeight,
                        zIndex: 2,
                        borderRadius: frameRadius,
                        background: deckPlate,
                        boxShadow: `inset 0 0 0 1px ${deckEdge}`,
                    }}
                >
                    {/*
                      A copy of the same screenshot, pushed almost fully back into
                      the wash. It is what makes the stack read as one screen dealt
                      twice rather than two unrelated panels, and the 52px drop puts
                      its content out of register with the frame in front.
                    */}
                    {image && (
                        <div
                            style={{
                                position: "absolute",
                                left: FRAME_BEZEL,
                                top: FRAME_BEZEL,
                                width: SCREEN_WIDTH,
                                height: SCREEN_HEIGHT,
                                borderRadius: screenRadius,
                                overflow: "hidden",
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={image}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: imageFit,
                                    borderRadius: screenRadius,
                                    opacity: DECK_GHOST,
                                    display: "block",
                                }}
                            />
                        </div>
                    )}

                    <div
                        style={{
                            position: "absolute",
                            left: FRAME_BEZEL,
                            top: FRAME_BEZEL,
                            width: SCREEN_WIDTH,
                            height: SCREEN_HEIGHT,
                            borderRadius: screenRadius,
                            boxShadow: `inset 0 0 0 1px ${deckScreen}`,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: frameRadius,
                            right: frameRadius,
                            height: 1,
                            background: `linear-gradient(90deg, ${hexToRgba(textColor, 0)} 0%, ${hexToRgba(
                                JADE,
                                0.16,
                            )} 50%, ${hexToRgba(textColor, 0)} 100%)`,
                        }}
                    />
                </div>
            ))}

            {/* The frame in front, carrying the real screenshot. */}
            <div
                style={{
                    position: "absolute",
                    left: FRAME_LEFT,
                    top: FRAME_TOP,
                    width: FRAME_WIDTH,
                    height: frameHeight,
                    zIndex: 3,
                    borderRadius: frameRadius,
                    background: mainPlate,
                    boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                }}
            >
                {/* Light catching the top edge, strongest under the centre of the bloom. */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: frameRadius,
                        right: frameRadius,
                        height: 1,
                        background: `linear-gradient(90deg, ${hexToRgba(textColor, 0)} 0%, ${hexToRgba(
                            textColor,
                            0.1,
                        )} 22%, ${hexToRgba(MINT, 0.42)} 50%, ${hexToRgba(textColor, 0.1)} 78%, ${hexToRgba(
                            textColor,
                            0,
                        )} 100%)`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: FRAME_BEZEL,
                        top: FRAME_BEZEL,
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
                        borderRadius: screenRadius,
                        overflow: "hidden",
                    }}
                >
                    {image ? (
                        <ImageSlot
                            className="h-full w-full"
                            image={image}
                            alt="product screenshot"
                            fit={imageFit}
                            radius={screenRadius}
                            tone={tone}
                        />
                    ) : (
                        /*
                          The empty plate stops just past the fold. At the full
                          plate height the label would centre below the canvas and
                          the slot would read as broken rather than empty.
                        */
                        <ImageSlot
                            style={{ height: SCREEN_VISIBLE + 10 }}
                            image={image}
                            alt=""
                            radius={screenRadius}
                            tone={tone}
                            emptyLabel="Add a product screenshot"
                        />
                    )}
                </div>
            </div>

            {/* Brand mark, pinned top-centre so identity keeps one fixed spot. */}
            <div
                style={{
                    position: "absolute",
                    top: MARK_TOP,
                    left: "50%",
                    width: MARK_SIZE,
                    height: MARK_SIZE,
                    zIndex: 4,
                    transform: "translateX(-50%)",
                }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{ width: MARK_SIZE, height: MARK_SIZE, objectFit: "contain", display: "block" }}
                    />
                ) : (
                    /* Empty state: the mark is the card's own idea — three squared frames. */
                    <svg
                        width={MARK_SIZE}
                        height={MARK_SIZE}
                        viewBox="0 0 44 44"
                        fill="none"
                        aria-hidden="true"
                        style={{ display: "block" }}
                    >
                        <rect x="17" y="4" width="22" height="22" rx="5" stroke={textColor} strokeOpacity="0.32" strokeWidth="2" />
                        <rect x="12" y="10" width="22" height="22" rx="5" stroke={textColor} strokeOpacity="0.58" strokeWidth="2" />
                        <rect x="7" y="16" width="22" height="22" rx="5" fill={tone.veil} stroke={textColor} strokeWidth="2" />
                    </svg>
                )}
            </div>

            <div
                style={{
                    position: "absolute",
                    top: TYPE_TOP,
                    left: 0,
                    right: 0,
                    zIndex: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0 96px",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        maxWidth: 940,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 760),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 96)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                        lineHeight: 1.02,
                        textAlign: "center",
                        textWrap: "balance",
                    }}
                >
                    {title}
                </h1>

                {tagline && (
                    <p
                        style={{
                            margin: "22px 0 0",
                            maxWidth: 620,
                            color: tone.secondary,
                            fontSize: 19,
                            fontWeight: 400,
                            lineHeight: 1.45,
                            textAlign: "center",
                        }}
                    >
                        {tagline}
                    </p>
                )}
            </div>
        </TemplateCard>
    );
}
