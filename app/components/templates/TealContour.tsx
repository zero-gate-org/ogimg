"use client";

import { useId } from "react";
import TemplateCard from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
} from "./templateShared";

/**
 * Teal Contour: three faceted black panels laid across a black card, each one
 * rimmed with a soft teal inner shadow, with a lockup above and a low headline
 * on the left.
 *
 * Measured off refs/07.svg. The reference builds its light from three enormous
 * rounded decagons: one hanging off the top edge, one off the left and bottom,
 * and one off the right and bottom. Each path is filled black and carries an
 * inner shadow offset 4px down, blurred at 50 and coloured `#00EAFF`, so only the
 * inside of every edge lights up. The panels overlap, and each one's black fill
 * covers the rims painted before it, which is what breaks the light into the
 * three arcs the card shows. The paths and their filters are ported as they are.
 *
 * A CSS filter would not travel through the export, but an SVG filter is part of
 * the serialised SVG markup, so it does. One filter definition serves all three
 * paths, and its region is a percentage of each path's own box, so every panel
 * gets its own rim from the same primitives. The id carries the instance's
 * `useId`, which keeps the gallery's many previews from sharing a definition.
 * The black background rectangle is left out on purpose: the card's own
 * background fills the uncovered corners, so the background controls still do
 * something, and the default black still matches the reference.
 *
 * Type: the reference sets a 33 x 44 mark at 64,64 with a two line wordmark, and
 * a two line headline at 96px with a one em advance. The wordmark is the app's
 * single word domain here, and the reference's "Designed for Saas startups"
 * becomes "Designed for link previews". Geometry is mirrored by the
 * `teal-contour` branch in `templateLayout.ts`, so the card does not jump when
 * it is detached.
 */

/** The three panels, in the reference's paint order. */
const TOP_SHAPE =
    "M661.394 -730.174C696.678 -744.789 736.322 -744.789 771.606 -730.174L1030.86 -622.789C1066.14 -608.174 1094.17 -580.141 1108.79 -544.857L1216.17 -285.606C1230.79 -250.322 1230.79 -210.678 1216.17 -175.394L1108.79 83.8569C1094.17 119.141 1066.14 147.174 1030.86 161.789L771.606 269.174C736.322 283.789 696.678 283.789 661.394 269.174L402.143 161.789C366.859 147.174 338.826 119.141 324.211 83.8569L216.826 -175.394C202.211 -210.678 202.211 -250.322 216.826 -285.606L324.211 -544.857C338.826 -580.141 366.859 -608.174 402.143 -622.789L661.394 -730.174Z";

const LEFT_SHAPE =
    "M107.894 152.826C143.178 138.211 182.822 138.211 218.106 152.826L454.376 250.692C489.66 265.307 517.693 293.34 532.308 328.624L630.174 564.894C644.789 600.178 644.789 639.822 630.174 675.106L532.308 911.376C517.693 946.66 489.66 974.693 454.376 989.308L218.107 1087.17C182.822 1101.79 143.178 1101.79 107.894 1087.17L-128.376 989.308C-163.66 974.693 -191.693 946.66 -206.308 911.376L-304.174 675.107C-318.789 639.822 -318.789 600.178 -304.174 564.894L-206.308 328.624C-191.693 293.34 -163.66 265.307 -128.376 250.692L107.894 152.826Z";

const RIGHT_SHAPE =
    "M1504.76 775.022C1528.01 744.723 1538.27 706.429 1533.28 668.564L1507.12 469.87C1502.14 432.006 1482.32 397.672 1452.02 374.423L1293.02 252.422C1262.72 229.173 1224.43 218.912 1186.56 223.897L987.87 250.056C950.006 255.041 915.673 274.863 892.423 305.162L770.422 464.157C747.173 494.456 736.912 532.75 741.897 570.614L768.056 769.308C773.041 807.173 792.863 841.506 823.162 864.755L982.157 986.756C1012.46 1010.01 1050.75 1020.27 1088.61 1015.28L1287.31 989.123C1325.17 984.138 1359.51 964.316 1382.76 934.016L1504.76 775.022Z";

/**
 * The reference's inner shadow, restated with SVG primitives. Its colour matrix
 * is `0 0 0 0 0 / 0 0 0 0 0.916667 / 0 0 0 0 1 / 0 0 0 1 0`, which is `#00EAFF`.
 * The source alpha is pushed to a hard mask, offset down 4px, blurred at 50,
 * then subtracted from the same mask so only the inside of the edge keeps the
 * difference. The last blend lays that teal remainder over the black fill.
 */
const InnerShadowFilter = ({ id }: { id: string }) => (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="50" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.916667 0 0 0 0 1 0 0 0 1 0"
        />
        <feBlend mode="normal" in2="shape" result="innerShadow" />
    </filter>
);

/** Left rail, measured off the reference: lockup at the top, headline at the bottom. */
const PAD_X = 64;
const LOCKUP_TOP = 64;
const MARK_WIDTH = 33;
const MARK_HEIGHT = 44;
const LOCKUP_GAP = 11;
const WORDMARK_SIZE = 27;
const WORDMARK_WIDTH = 150;

/**
 * Two lines at a 96px face advance 95px, and the reference's last descender
 * stops 59px above the bottom edge. The box is 640 wide so the default pair
 * breaks after "Designed for" and leaves the right half to the rims.
 */
const HEADLINE_BOTTOM = 65;
const HEADLINE_WIDTH = 640;
const HEADLINE_SIZE = 96;
const HEADLINE_LEADING = 0.99;

export default function TealContour({
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
    gridOpacity = 0.08,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const wordmark = (logo || "").trim();
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const filterId = `${uid}-rim`;

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
              The three panels and their rims. Painted in the reference's order,
              because each black fill has to cover the rim of the panel before it.
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
                    <InnerShadowFilter id={filterId} />
                </defs>
                <path d={TOP_SHAPE} fill="#000000" filter={`url(#${filterId})`} />
                <path d={LEFT_SHAPE} fill="#000000" filter={`url(#${filterId})`} />
                <path d={RIGHT_SHAPE} fill="#000000" filter={`url(#${filterId})`} />
            </svg>

            {/* Brand lockup, on the reference's top-left corner. */}
            <div
                className="absolute flex items-center"
                style={{ left: PAD_X, top: LOCKUP_TOP, gap: LOCKUP_GAP }}
            >
                {logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={logoImage}
                        alt=""
                        style={{
                            width: MARK_WIDTH,
                            height: MARK_HEIGHT,
                            objectFit: "contain",
                            flexShrink: 0,
                        }}
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
                            color: textColor,
                            fontStyle,
                            fontWeight: resolveFontWeight(fontWeight, 700),
                            textDecoration,
                            fontSize: WORDMARK_SIZE,
                            lineHeight: 1,
                            letterSpacing: "-0.01em",
                            textTransform: "uppercase",
                        }}
                    >
                        {wordmark}
                    </span>
                )}
            </div>

            {/* The headline, anchored to the bottom of the rail. */}
            <div
                className="absolute"
                style={{ left: PAD_X, bottom: HEADLINE_BOTTOM, width: HEADLINE_WIDTH }}
            >
                <div
                    style={{
                        margin: 0,
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 600),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, HEADLINE_SIZE)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.037)}em`,
                        lineHeight: HEADLINE_LEADING,
                        textWrap: "balance",
                    }}
                >
                    {title}
                </div>
            </div>
        </TemplateCard>
    );
}
