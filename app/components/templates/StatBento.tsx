"use client";

import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    hexToRgba,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
    splitPrefixedLine,
} from "./templateShared";

/**
 * Stat Bento: a claim on the left, proof on the right.
 *
 * The card is cut into two fields. The left rail is bare background — a bold
 * headline pinned to the top-left corner and the domain sitting on the bottom
 * edge under it. The right field is one piece of loud rainbow paint, and the
 * only thing allowed to live on it is a bento of dark stat cards, each one a
 * big number over a small caption.
 *
 * The colour story stays in the panel. The headline, the numbers and the
 * captions are all solid `textColor`, which is what keeps the whole card
 * export-safe inside a foreignObject and keeps the hierarchy on one colour.
 * Every layer — the rainbow, the card bodies, the hairlines — is drawn in code.
 */

// Rail width, panel seam and grid rhythm, measured off the reference art.
const RAIL_WIDTH = 497;
const GRID_PAD = 44;
const GRID_GAP = 24;
const GRID_X = RAIL_WIDTH + GRID_PAD;
const GRID_W = 1200 - GRID_X - GRID_PAD;
const GRID_Y = GRID_PAD;
const GRID_H = 630 - GRID_PAD * 2;
const ROW_H = (GRID_H - GRID_GAP) / 2;
const NARROW_W = 209;
const WIDE_W = GRID_W - NARROW_W - GRID_GAP;
const CARD_RADIUS = 16;
const CARD_INK = "#0A0A0C";

// 142deg is the axis the reference gradient actually runs on: from the panel's
// top-left corner to a point past its bottom-right, which lands one readable
// hue band per stop instead of smearing yellow straight into blue.
const RAINBOW =
    "linear-gradient(142deg, #FFE702 0%, #FF5E01 23.5%, #FF8CE4 43.4%, #A900FF 68%, #0051FF 100%)";

// Padding and leading are named rather than inlined so the detached canvas
// layers can place the same text at the same optical position.
const CARD_PAD_TOP = 39;
const CARD_PAD_BOTTOM = 36;
const CARD_PAD_X = 24;
const CARD_GAP = 36;
const VALUE_LINE = 1.02;
const CAPTION_LINE = 1.3;
const RAIL_PAD_TOP = 48;
const RAIL_PAD_RIGHT = 64;
const RAIL_PAD_LEFT = 72;
const RAIL_PAD_BOTTOM = 42;
const HEADLINE_LINE = 1.04;
const BRAND_SIZE = 30;
const BRAND_LINE = 1.1;

interface StatBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Deliberately uneven. With all three stats the hero card takes the whole
 * bottom row and the two supporting cards split the top row 209/382, so the
 * grid reads as a bento rather than a row of identical tiles. Fewer stats grow
 * into the space instead of leaving holes in the panel.
 */
const bentoBoxes = (count: number): StatBox[] => {
    if (count >= 3) {
        return [
            { x: GRID_X, y: GRID_Y, width: NARROW_W, height: ROW_H },
            { x: GRID_X + NARROW_W + GRID_GAP, y: GRID_Y, width: WIDE_W, height: ROW_H },
            { x: GRID_X, y: GRID_Y + ROW_H + GRID_GAP, width: GRID_W, height: ROW_H },
        ];
    }
    const half = Math.round((GRID_W - GRID_GAP) / 2);
    if (count === 2) {
        return [
            { x: GRID_X, y: GRID_Y, width: half, height: GRID_H },
            { x: GRID_X + half + GRID_GAP, y: GRID_Y, width: GRID_W - half - GRID_GAP, height: GRID_H },
        ];
    }
    if (count === 1) {
        return [{ x: GRID_X, y: GRID_Y, width: GRID_W, height: GRID_H }];
    }
    return [];
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Numerals are set to fill the card, so their size is solved against its width. */
const valueSizeFor = (text: string, width: number) =>
    Math.round(clamp((width - CARD_PAD_X * 2 - 8) / (Math.max(text.length, 2) * 0.6), 26, 72));

/** Captions stay on one small step below each other and never outgrow the card. */
const captionSizeFor = (text: string, width: number) =>
    Math.round(clamp((width - CARD_PAD_X * 2) / (Math.max(text.length, 8) * 0.52), 15, 24));

export default function StatBento({
    title,
    textColor = "#FAFAFA",
    logo,
    detailOne,
    detailTwo,
    detailThree,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = CARD_INK,
    gradientEnd = CARD_INK,
    gradientAngle = 145,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const brand = (logo || "").trim();

    // Each stat ships as "value: caption". The number is the label half, the
    // caption is the body half; an empty field simply does not get a card.
    const stats = [detailOne, detailTwo, detailThree]
        .map((line) => (line || "").trim())
        .filter(Boolean)
        .map((line) => {
            const { label, body } = splitPrefixedLine(line);
            return { value: label, caption: body };
        });

    const boxes = bentoBoxes(stats.length);

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
            {/* The loud half of the card: one diagonal rainbow field, edge to edge. */}
            <div
                className="absolute inset-y-0 pointer-events-none"
                style={{ left: RAIL_WIDTH, width: 1200 - RAIL_WIDTH, background: RAINBOW }}
            />

            {/* Bento of dark stat cards, placed from the same boxes the detached
                canvas mirrors so nothing shifts when a user hits Layout. */}
            {stats.map((stat, index) => {
                const box = boxes[index];
                if (!box) return null;
                const hasValue = Boolean(stat.value);
                const valueSize = valueSizeFor(stat.value || stat.caption, box.width);
                const captionSize = captionSizeFor(stat.caption, box.width);
                // Short cards pin the pair to the top and bottom edges, which is
                // what gives the bento its empty middle. A card that runs the
                // full panel height would strand the caption 400px below the
                // number, so it centres the pair as one block instead.
                const pinned = hasValue && box.height <= 320;

                return (
                    <div
                        key={`${stat.value}-${stat.caption}-${index}`}
                        className="absolute flex flex-col items-center text-center"
                        style={{
                            left: box.x,
                            top: box.y,
                            width: box.width,
                            height: box.height,
                            borderRadius: CARD_RADIUS,
                            padding: `${pinned ? CARD_PAD_TOP : 0}px ${CARD_PAD_X}px ${pinned ? CARD_PAD_BOTTOM : 0}px`,
                            justifyContent: pinned ? "space-between" : "center",
                            gap: pinned ? 0 : CARD_GAP,
                            // The top of each card lets the rainbow through and
                            // closes to solid ink by the middle, so the panel
                            // reads as light falling on the cards from behind.
                            background: `linear-gradient(180deg, ${hexToRgba(CARD_INK, 0.72)} 0%, ${hexToRgba(CARD_INK, 0.93)} 26%, ${CARD_INK} 54%)`,
                            boxShadow: `inset 0 1px 0 ${hexToRgba("#ffffff", 0.1)}, inset 0 0 0 1px ${tone.hairline}`,
                        }}
                    >
                        {hasValue && (
                            <span
                                style={{
                                    color: textColor,
                                    fontStyle,
                                    fontWeight: resolveFontWeight(fontWeight, 640),
                                    textDecoration,
                                    fontSize: `${valueSize}px`,
                                    lineHeight: VALUE_LINE,
                                    letterSpacing: "-0.04em",
                                }}
                            >
                                {stat.value}
                            </span>
                        )}
                        <span
                            style={{
                                color: hasValue ? tone.secondary : textColor,
                                fontSize: `${captionSize}px`,
                                lineHeight: CAPTION_LINE,
                                // Small type opens up slightly; only the display
                                // numerals get negative tracking.
                                letterSpacing: "0.01em",
                                fontWeight: 600,
                            }}
                        >
                            {stat.caption}
                        </span>
                    </div>
                );
            })}

            {/* The quiet half: bare background, headline top-left, domain on the
                bottom edge. Nothing else competes with the panel. */}
            <div
                className="absolute inset-y-0 left-0 flex flex-col justify-between"
                style={{
                    width: RAIL_WIDTH,
                    padding: `${RAIL_PAD_TOP}px ${RAIL_PAD_RIGHT}px ${RAIL_PAD_BOTTOM}px ${RAIL_PAD_LEFT}px`,
                }}
            >
                <div
                    style={{
                        maxWidth: RAIL_WIDTH - RAIL_PAD_LEFT - RAIL_PAD_RIGHT,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 640),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 56)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                        lineHeight: HEADLINE_LINE,
                    }}
                >
                    {title}
                </div>

                {brand && (
                    <p
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 600),
                            textDecoration,
                            fontSize: BRAND_SIZE,
                            lineHeight: BRAND_LINE,
                            letterSpacing: "-0.015em",
                        }}
                    >
                        {brand}
                    </p>
                )}
            </div>
        </TemplateCard>
    );
}
