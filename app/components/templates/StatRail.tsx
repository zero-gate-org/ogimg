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
 * Stat Rail: a headline on the left, a two by two field of glass stat panels on
 * the right.
 *
 * Measured off refs/06.svg. The rail carries the brand lockup on the top edge and
 * the headline on the bottom one. The field starts at x 537.5 and runs to x 1151.5,
 * with 258px rows, a 25px gutter and 28px corners. Its columns alternate: a narrow
 * panel beside a wide one on the top row, then the same pair reversed underneath,
 * so the field reads as a bento instead of a table. Every panel centres an
 * oversized numeral near its top edge and a small uppercase caption 26px above its
 * bottom edge.
 *
 * The numerals carry the reference's violet ramp, white at their top left through
 * `#A900FF` into blue-violet at their bottom right. That ramp is the only colour
 * on the card: the field is flat black, the panels are frosted black with a
 * hairline edge and a radial glint along the top edge, and the type stays in the
 * user's colour. The glint and the panel fills are drawn in code, and the ramp is
 * a clipped background, which the SVG export rasterises correctly.
 */

/**
 * The reference's numeral paint: blue-violet at the bottom right corner of a
 * numeral, magenta at 46%, and white where it reaches the top left. `to top
 * left` makes the ramp span each numeral's own box, the way the artwork fits one
 * gradient to every glyph group.
 */
const NUMERAL_GRADIENT =
    "linear-gradient(to top left, #008CFF 0%, #A900FF 46.28%, #FFFFFF 100%)";

/** A panel's top edge catches a radial highlight that dies out well before each corner. */
const TOP_GLINT =
    "radial-gradient(28% 72px at 50% 10px, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)";

/**
 * Numerals are set in a light monospace, captions and the rail in the user's
 * face. The reference pairs the two deliberately: the mono gives every stat the
 * same rhythm while the wide captions stay readable.
 */
const NUMERAL_FAMILY = "\"Geist Mono\", ui-monospace, monospace";
/** The reference's mono digits are a touch narrower than Geist Mono's. */
const NUMERAL_SQUEEZE = 0.92;

/** Card field measured off the reference: 614 x 541 inside a 25px gutter. */
const GRID_X = 537.5;
const GRID_Y = 48.5;
const GRID_W = 614;
const GRID_H = 541;
const GUTTER = 25;
const NARROW_W = 208;
const WIDE_W = 381;
const CARD_H = 258;
const CARD_RADIUS = 28;

/** Rail: lockup on the top edge, headline on the bottom one, nothing between. */
const PAD_X = 64;
const LOCKUP_TOP = 72;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 28;
/** Tight enough that two lines of the wordmark measure the mark's height. */
const WORDMARK_LEADING = 0.86;
const WORDMARK_WIDTH = 104;
const RAIL_WIDTH = 440;
/** Anchored to the bottom: two lines at 67px put the ink on the reference's own
 *  cap line at y436 and its second baseline at y549. */
const HEADLINE_BOTTOM = 72;
const HEADLINE_LINE = 0.95;

/** The numeral's cap lands 43px below a panel's top edge; the caption's ink stops
 *  26px above the bottom one. */
const CARD_PAD_TOP = 28;
const CARD_PAD_BOTTOM = 20;
const CARD_PAD_X = 24;
/** Matched to the reference's 64px digit height at the measured cap ratio. */
const VALUE_MAX = 87;
const VALUE_LINE = 1;
const CAPTION_MAX = 21;
const CAPTION_MIN = 13;
const CAPTION_LINE = 1.3;
const CARD_GAP = 28;

interface CardBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** The reference's four positions, top narrow/wide then wide/narrow. */
const BENTO_BOXES: CardBox[] = [
    { x: GRID_X, y: GRID_Y, width: NARROW_W, height: CARD_H },
    { x: GRID_X + NARROW_W + GUTTER, y: GRID_Y, width: WIDE_W, height: CARD_H },
    { x: GRID_X, y: GRID_Y + CARD_H + GUTTER, width: WIDE_W, height: CARD_H },
    { x: GRID_X + WIDE_W + GUTTER, y: GRID_Y + CARD_H + GUTTER, width: NARROW_W, height: CARD_H },
];

/**
 * Four stats reproduce the reference exactly. Fewer stats reflow so the field
 * never shows a hole: three grow a full width panel along the bottom, two split
 * the field into full height columns, one takes all of it.
 */
const railBoxes = (count: number): CardBox[] => {
    if (count >= 4) return BENTO_BOXES;
    if (count === 3) {
        return [
            BENTO_BOXES[0],
            BENTO_BOXES[1],
            { x: GRID_X, y: GRID_Y + CARD_H + GUTTER, width: GRID_W, height: CARD_H },
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
    Math.round(clamp((width - CARD_PAD_X * 2) / (Math.max(text.length, 1) * 0.6), 26, VALUE_MAX));

/** Captions stay on one step below the numerals and never outgrow the panel. */
const captionSizeFor = (text: string, width: number) =>
    Math.round(
        clamp((width - CARD_PAD_X * 2) / (Math.max(text.length, 6) * 0.66), CAPTION_MIN, CAPTION_MAX),
    );

export default function StatRail({
    title,
    textColor = "#FAFAFA",
    logoImage,
    logo,
    tag,
    detailOne,
    detailTwo,
    detailThree,
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

    // Each field ships as "value: caption". The numeral is the label half, the
    // caption is the body half, and an empty field simply gets no panel. The
    // fourth stat rides in the tag slot so the field can hold the reference's
    // full two by two.
    const stats = [detailOne, detailTwo, detailThree, tag]
        .map((line) => (line || "").trim())
        .filter(Boolean)
        .map((line) => {
            const { label, body } = splitPrefixedLine(line);
            return { value: label, caption: body };
        });

    const boxes = railBoxes(stats.length);

    // Flat black in the reference, so the panels do the work. `isDarkText` means
    // the user chose light type, which in turn means the panels are dark glass.
    const cardFill = tone.isDarkText ? "rgba(0, 0, 0, 0.7)" : "rgba(252, 252, 253, 0.7)";
    const glint = tone.isDarkText ? TOP_GLINT : "none";

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
            {stats.map((stat, index) => {
                const box = boxes[index];
                if (!box) return null;

                const hasValue = Boolean(stat.value);
                const valueSize = valueSizeFor(stat.value || stat.caption, box.width);
                const captionSize = captionSizeFor(stat.caption, box.width);
                // Only full height panels need their pair centred; the reference's
                // rows pin the numeral to the top edge and the caption to the bottom.
                // A lone caption centres instead of hanging off the top edge.
                const pinned = box.height <= CARD_H;
                const split = pinned && hasValue;

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
                            justifyContent: split ? "space-between" : "center",
                            gap: split ? 0 : CARD_GAP,
                            background: cardFill,
                            boxShadow: `inset 0 0 0 1px ${hexToRgba(textColor, 0.2)}`,
                            backdropFilter: "blur(14px)",
                            WebkitBackdropFilter: "blur(14px)",
                        }}
                    >
                        {pinned && (
                            <div
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    height: 1,
                                    background: glint,
                                }}
                            />
                        )}

                        {hasValue && (
                            <span
                                style={{
                                    display: "block",
                                    whiteSpace: "nowrap",
                                    backgroundImage: NUMERAL_GRADIENT,
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent",
                                    WebkitTextFillColor: "transparent",
                                    fontFamily: NUMERAL_FAMILY,
                                    fontWeight: 300,
                                    fontSize: `${valueSize}px`,
                                    lineHeight: VALUE_LINE,
                                    letterSpacing: 0,
                                    transform: `scaleX(${NUMERAL_SQUEEZE})`,
                                    transformOrigin: "center",
                                }}
                            >
                                {stat.value}
                            </span>
                        )}
                        <span
                            style={{
                                color: hasValue ? hexToRgba(textColor, 0.5) : tone.primary,
                                fontSize: `${captionSize}px`,
                                lineHeight: CAPTION_LINE,
                                fontWeight: 400,
                                letterSpacing: 0,
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
                        // The reference ramps its headline white into silver, and the
                        // clipped gradient keeps that ramp while still following the
                        // user's text colour.
                        backgroundImage: `linear-gradient(112deg, ${textColor} 0%, ${hexToRgba(textColor, 0.78)} 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
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
