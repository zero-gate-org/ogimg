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
} from "./templateShared";

/** The ticket surface. Code-drawn, so it survives the foreignObject export. */
const PANEL = "#5C0909";

/**
 * Traced from the reference: a full-height slab whose four corners are bitten
 * inward by concave radius-144 arcs of unequal reach, so the purple field wraps
 * around it like overlapping passes. The arcs are hand-resolved into one path
 * because a mask or a blur would not survive serialisation, and because the notch
 * has to line up with the card edge rather than with the type.
 */
const NOTCH_PATH = [
    "M355.5 0 L960 0 L960 116.09",
    "A144 144 0 0 0 1053 250.76",
    "L1053 510 L895 510",
    "A144 144 0 0 0 753 630",
    "L210.5 630 L210.5 469",
    "A144 144 0 0 0 114.5 333.2",
    "L114.5 189.09 L211.5 189.09",
    "A144 144 0 0 0 355.5 45.09 Z",
].join(" ");

/**
 * Empty-state mark: a portrait frame crossed by a single diagonal, drawn with
 * evenodd so the two wedges stay open and the ticket reads through it.
 */
const FallbackMark = ({ color }: { color: string }) => (
    <svg
        width="40"
        height="53"
        viewBox="0 0 36 48"
        fill="none"
        aria-hidden="true"
        style={{ display: "block", width: "40px", height: "53px", flexShrink: 0 }}
    >
        <path
            d="M0 0V48H36V0H0Z M6.9 5L31 37.17V5H6.9Z M29.1 43L5 10.83V43H29.1Z"
            fillRule="evenodd"
            fill={color}
        />
    </svg>
);

/**
 * A bright purple field with a maroon ticket notched out of it.
 *
 * The card is typographic: mark, wordmark, headline and domain all sit on the
 * maroon panel in one cream colour, muted only by opacity. Everything behind the
 * type is drawn in code — the gradient fill from the shared card, the notched
 * panel from one inline SVG path, and a single hairline of rim light where the
 * purple meets the panel — so the whole thing serialises cleanly.
 */
export default function NotchCard({
    title,
    textColor = "#FFEDC8",
    logoImage,
    tag,
    logo,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#B026E0",
    gradientEnd = "#8B10C9",
    gradientAngle = 160,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity,
    gridBlur,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const tagline = (tag || "").trim();
    const wordmark = (logo || "").trim();
    const hasLockup = Boolean(logoImage || wordmark);

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
              The rim is stroked before the panel is filled, so the inner half of
              the line is painted over and only the purple side keeps it: light
              catching the edge of the ticket, with no blur anywhere.
            */}
            <svg
                width="1200"
                height="630"
                viewBox="0 0 1200 630"
                fill="none"
                aria-hidden="true"
                style={{
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    width: "1200px",
                    height: "630px",
                    pointerEvents: "none",
                }}
            >
                <path d={NOTCH_PATH} stroke={hexToRgba("#EA8CFF", 0.4)} strokeWidth="3.5" />
                <path d={NOTCH_PATH} fill={PANEL} />
            </svg>

            <div className="relative z-10 flex h-full w-full flex-col items-center px-[150px] pt-[70px] pb-[100px]">
                {hasLockup && (
                    <div className="flex shrink-0 items-center gap-[15px]">
                        {logoImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={logoImage}
                                alt=""
                                style={{ width: "40px", height: "53px", objectFit: "contain", flexShrink: 0 }}
                            />
                        ) : (
                            <FallbackMark color={textColor} />
                        )}

                        {wordmark && (
                            <span
                                className="text-[27px] leading-none"
                                style={{
                                    color: textColor,
                                    fontStyle,
                                    fontWeight: resolveFontWeight(fontWeight, 700),
                                    textDecoration,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                {wordmark}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex min-h-0 w-full flex-1 items-center justify-center py-6">
                    <div
                        className="max-w-[820px] text-center"
                        style={{
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: `${resolveTitleFontSize(titleSize, 80)}px`,
                            letterSpacing: `${resolveTitleTracking(titleTracking, -0.02)}em`,
                            lineHeight: 1.02,
                            /* A centred display line should not end in an orphan word. */
                            textWrap: "balance" as const,
                        }}
                    >
                        {title}
                    </div>
                </div>

                {tagline && (
                    <p
                        /*
                          The cap is the notch, not taste: the bottom-right bite
                          reaches to x=822 at this line's baseline, so a centred
                          domain can only be ~440px wide before it steps off the
                          panel and onto the purple.
                        */
                        className="max-w-[440px] shrink-0 text-center text-[28px] font-semibold leading-none"
                        style={{
                            color: tone.secondary,
                            letterSpacing: "0.005em",
                            textWrap: "balance" as const,
                        }}
                    >
                        {tagline}
                    </p>
                )}
            </div>
        </TemplateCard>
    );
}
