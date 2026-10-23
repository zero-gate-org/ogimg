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
 * Stat Rail: a headline on the left, hairline stat cards on the right.
 *
 * The split follows the reference. A bare rail on the left carries the brand
 * lockup at the top and the headline down on the bottom edge, and the right two
 * thirds hold a bento of large rounded panels: a narrow card top-left, a wide
 * card top-right, and one card running the full width under them, all on a 24px
 * gutter with 28px corners. Each panel sets an oversized numeral over a small
 * uppercase caption. A field left empty drops its panel entirely and the
 * remaining ones grow into the space, so the grid never shows a hole.
 *
 * The reference paints its numerals with a violet to white ramp. Here that ramp
 * becomes a wash of violet light sitting behind the panels instead, and the type
 * stays on one colour: values in `tone.primary`, captions in `tone.tertiary`.
 * That is what keeps the card in a single family when the user changes the text
 * colour, and gradient clipped text would not survive the foreignObject export
 * anyway. The wash, the panel fills and every hairline are drawn in code.
 */

/** Violet hues lifted from the reference's numeral ramp. Background paint only, never applied to text. */
const VIOLET = "#8B5CF6";
const VIOLET_HOT = "#A900FF";
const VIOLET_COOL = "#008CFF";

/**
 * Card grid measured off refs/06.svg: x 537 to x 1152, y 48 to y 590, one 24px
 * gutter, 28px corners. The reference runs four panels; this app has three
 * detail slots, so the bottom row is a single full width card instead of a pair.
 */
const GRID_X = 537;
const GRID_Y = 48;
const GRID_W = 615;
const GRID_H = 542;
const GUTTER = 24;
const CARD_RADIUS = 28;
const ROW_H = (GRID_H - GUTTER) / 2;
const NARROW_W = 209;
const WIDE_W = GRID_W - NARROW_W - GUTTER;

/** Rail: lockup on the top edge, headline on the bottom one, nothing between. */
const PAD_X = 64;
const LOCKUP_TOP = 72;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 28;
/** Tight enough that two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.86;
const WORDMARK_WIDTH = 168;
const RAIL_WIDTH = 440;
/** Anchored to the bottom: two lines at 67px put the ink on the reference's own
 *  cap line at y436.2. */
const HEADLINE_BOTTOM = 72;
const HEADLINE_LINE = 0.95;

/** Numeral sits 44px below a panel's top edge, caption 34px above the bottom one. */
const CARD_PAD_TOP = 44;
const CARD_PAD_BOTTOM = 34;
const CARD_PAD_X = 26;
const VALUE_MAX = 92;
const VALUE_LINE = 1;
const CAPTION_MAX = 18;
const CAPTION_LINE = 1.3;
/** A card taller than a row centres its pair as one block rather than pinning it apart. */
const SHORT_CARD_H = ROW_H;

interface CardBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Deliberately uneven, so the field reads as a bento and not as a row of tiles.
 * Fewer than three stats redistribute across the grid: two split it into full
 * height columns, one takes the whole field.
 */
const railBoxes = (count: number): CardBox[] => {
    if (count >= 3) {
        return [
            { x: GRID_X, y: GRID_Y, width: NARROW_W, height: ROW_H },
            { x: GRID_X + NARROW_W + GUTTER, y: GRID_Y, width: WIDE_W, height: ROW_H },
            { x: GRID_X, y: GRID_Y + ROW_H + GUTTER, width: GRID_W, height: ROW_H },
        ];
    }
    if (count === 2) {
        const half = Math.round((GRID_W - GUTTER) / 2);
        return [
            { x: GRID_X, y: GRID_Y, width: half, height: GRID_H },
            { x: GRID_X + half + GUTTER, y: GRID_Y, width: GRID_W - half - GUTTER, height: GRID_H },
        ];
    }
    if (count === 1) {
        return [{ x: GRID_X, y: GRID_Y, width: GRID_W, height: GRID_H }];
    }
    return [];
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Numerals are set to fill their panel, so size solves against the box, not the slot. */
const valueSizeFor = (text: string, width: number) =>
    Math.round(clamp((width - CARD_PAD_X * 2) / (Math.max(text.length, 2) * 0.58), 26, VALUE_MAX));

/** Captions stay on one small step below each other and never outgrow the panel. */
const captionSizeFor = (text: string, width: number) =>
    Math.round(clamp((width - CARD_PAD_X * 2) / (Math.max(text.length, 6) * 0.66), 12, CAPTION_MAX));

export default function StatRail({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    detailOne,
    detailTwo,
    detailThree,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0A0A0C",
    gradientEnd = "#0E0A16",
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

    // Each field ships as "value: caption". The numeral is the label half, the
    // caption is the body half, and an empty field simply gets no card.
    const stats = [detailOne, detailTwo, detailThree]
        .map((line) => (line || "").trim())
        .filter(Boolean)
        .map((line) => {
            const { label, body } = splitPrefixedLine(line);
            return { value: label, caption: body };
        });

    const boxes = railBoxes(stats.length);

    // Light falling on the field from the top-right, which is where the
    // reference's ramp is hottest. Anchored to the right of the canvas so the
    // rail stays near-black and the type never competes with the paint.
    const wash = [
        `radial-gradient(34% 46% at 95% 8%, ${hexToRgba(VIOLET_HOT, 0.15)} 0%, ${hexToRgba(VIOLET_HOT, 0)} 66%)`,
        `radial-gradient(30% 44% at 62% 94%, ${hexToRgba(VIOLET_COOL, 0.09)} 0%, ${hexToRgba(VIOLET_COOL, 0)} 64%)`,
        `linear-gradient(120deg, ${hexToRgba(VIOLET, 0)} 34%, ${hexToRgba(VIOLET, 0.045)} 64%, ${hexToRgba(VIOLET_HOT, 0.08)} 100%)`,
    ].join(",");

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
            <div className="absolute inset-0 pointer-events-none" style={{ background: wash }} />

            {stats.map((stat, index) => {
                const box = boxes[index];
                if (!box) return null;

                const hasValue = Boolean(stat.value);
                const valueSize = valueSizeFor(stat.value || stat.caption, box.width);
                const captionSize = captionSizeFor(stat.caption, box.width);
                // Short panels pin the numeral to the top edge and the caption to
                // the bottom one, which is what gives the bento its empty middle.
                // A full height panel would strand the caption 300px below the
                // number, so it centres the pair as one block instead.
                const pinned = hasValue && box.height <= SHORT_CARD_H;

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
                            gap: pinned ? 0 : 28,
                            // Translucent so the violet keeps reading through the
                            // panel, the way the reference's cards sit on its glow.
                            background: `linear-gradient(180deg, ${hexToRgba(tone.veil, 0.66)} 0%, ${hexToRgba(tone.veil, 0.4)} 100%)`,
                            boxShadow: `inset 0 0 0 1px ${tone.hairline}`,
                        }}
                    >
                        {hasValue && (
                            <span
                                style={{
                                    color: tone.primary,
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
                                color: hasValue ? tone.tertiary : tone.primary,
                                fontSize: `${captionSize}px`,
                                lineHeight: CAPTION_LINE,
                                fontWeight: 600,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                fontStyle,
                                textDecoration,
                                textWrap: "balance",
                            }}
                        >
                            {stat.caption}
                        </span>
                    </div>
                );
            })}

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
                            color: tone.primary,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: WORDMARK_LEADING,
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            <div className="absolute" style={{ left: PAD_X, bottom: HEADLINE_BOTTOM, width: RAIL_WIDTH }}>
                <h1
                    style={{
                        margin: 0,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 700),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 67)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.08)}em`,
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
