"use client";

import TemplateCard, { MetaLabel } from "./TemplateCard";
import {
    DEFAULT_BACKGROUND_PRESET_ID,
    type TemplateProps,
    getCardTone,
    resolveFontWeight,
    resolveTitleFontSize,
    resolveTitleTracking,
    splitPrefixedLine,
} from "./templateShared";

/**
 * Release notes as a ledger. Each entry is a ruled row with the keyword pulled
 * into a fixed width column, so Added, Improved and Fixed line up down the
 * card instead of floating inside a sentence.
 */
export default function Changelog({
    title,
    textColor = "#E8EAED",
    logoImage,
    tag,
    logo,
    detailOne,
    detailTwo,
    detailThree,
    fontStyle,
    fontWeight,
    textDecoration,
    fontFamily,
    backgroundMode = "Gradient",
    gradientStart = "#0C1013",
    gradientEnd = "#151A1F",
    gradientAngle = 155,
    backgroundPresetId = DEFAULT_BACKGROUND_PRESET_ID,
    gridOverlay = "none",
    gridColor,
    gridOpacity = 0.14,
    gridBlur = 0,
    titleSize,
    titleTracking,
}: TemplateProps) {
    const tone = getCardTone(textColor);
    const productName = (logo || "").trim();
    const footerCta = (tag || "").trim();
    const entries = [detailOne, detailTwo, detailThree].map((line) => line?.trim() || "").filter(Boolean);
    const hasKeywords = entries.some((line) => splitPrefixedLine(line).label);

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
            <div className="flex h-full w-full flex-col p-14">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        {logoImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logoImage} alt="" className="h-9 w-9 object-contain" />
                        )}
                        {productName && (
                            <p
                                className="text-[19px] leading-none tracking-[-0.01em]"
                                style={{
                                    color: textColor,
                                    fontStyle,
                                    fontWeight: resolveFontWeight(fontWeight, 600),
                                    textDecoration,
                                }}
                            >
                                {productName}
                            </p>
                        )}
                    </div>

                    {footerCta && <MetaLabel tone={tone}>{footerCta}</MetaLabel>}
                </div>

                <h1
                    className="mt-9 max-w-[900px] leading-[1.06]"
                    style={{
                        color: textColor,
                        fontStyle,
                        fontWeight: resolveFontWeight(fontWeight, 660),
                        textDecoration,
                        fontSize: `${resolveTitleFontSize(titleSize, 54)}px`,
                        letterSpacing: `${resolveTitleTracking(titleTracking, -0.03)}em`,
                    }}
                >
                    {title}
                </h1>

                {entries.length > 0 && (
                    <ul
                        className="mt-8 flex flex-1 flex-col border-t"
                        style={{ borderColor: tone.hairline }}
                    >
                        {entries.map((line, index) => {
                            const { label, body } = splitPrefixedLine(line);

                            return (
                                <li
                                    key={`${line}-${index}`}
                                    className="flex flex-1 items-center gap-7 border-b py-5"
                                    style={{ borderColor: tone.hairline }}
                                >
                                    <span
                                        className={`shrink-0 text-[15px] font-semibold uppercase tracking-[0.16em] ${
                                            hasKeywords ? "w-[104px]" : "w-auto"
                                        }`}
                                        style={{ color: tone.tertiary }}
                                    >
                                        {label}
                                    </span>
                                    <span className="text-[23px] leading-[1.3]" style={{ color: tone.primary }}>
                                        {body}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </TemplateCard>
    );
}
