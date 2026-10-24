import { getTemplateById, type TemplateId } from "../../components/templates/templateRegistry";
import { getCardTone, hexToRgba, splitPrefixedLine } from "../../components/templates/templateShared";
import type { TemplateFontId } from "../../components/templates/fontCatalog";
import { createId, DEFAULT_CANVAS_BACKGROUND } from "./factories";
import type {
    CanvasBackground,
    FreeDocument,
    ImageLayer,
    Layer,
    ShapeLayer,
    TemplateDocument,
    TemplateFields,
    TemplateLayout,
    TemplateLayoutSlot,
    TextLayer,
} from "./types";

/**
 * Templates that have been rebuilt into editable canvas layers. A template that
 * is not listed here keeps rendering its fixed JSX, so nothing changes for it.
 * Each entry needs a matching preset branch in `buildPresetLayers`.
 */
const LAYOUT_EDITABLE_TEMPLATE_IDS: TemplateId[] = [
    "minimalist-tech",
    "app-showcase",
    "centered-container",
    "brand-pitch",
    "editorial-pixel",
    "saas-launch",
    "blog-post",
    "podcast-cover",
    "changelog",
    "neon-grid",
    "spotlight",
    "grid-glow",
    "arc",
    "teal-grid",
    "mesh",
    "dusk",
    "spectrum",
    "ticket",
    "deck",
    "bento",
    "crossglow",
    "horizon-bloom",
    "corner-flare",
    "solar-mesh",
    "violet-rail",
    "tilt-plate",
    "stat-rail",
    "prism-frame",
    "arch-glow",
    "facet-field",
    "cyan-rim",
    "light-column",
    "soft-mesh",
    "agile-startup",
];

export const isTemplateLayoutEditable = (templateId: TemplateId) =>
    LAYOUT_EDITABLE_TEMPLATE_IDS.includes(templateId);

/**
 * A detached template keeps its content in `fields` and its placement in
 * `layout.layers`. Both panels drive the same layer objects, so a text edit and
 * a drag never fight over the element.
 */
const BACKGROUND_KEYS: (keyof TemplateFields)[] = [
    "backgroundMode",
    "gradientStart",
    "gradientEnd",
    "gradientAngle",
    "backgroundPresetId",
    "gridOverlay",
    "gridColor",
    "gridOpacity",
    "gridBlur",
];

const TEXT_SLOT_KEYS: TemplateLayoutSlot[] = ["title", "tag", "logo", "detailOne", "detailTwo", "detailThree"];

const DETAIL_LABEL_SLOT: Partial<Record<TemplateLayoutSlot, TemplateLayoutSlot>> = {
    detailOne: "detailOneLabel",
    detailTwo: "detailTwoLabel",
    detailThree: "detailThreeLabel",
    // Only Stat Rail registers this slot; elsewhere the tag stays one layer.
    tag: "tagLabel",
};

/**
 * Re-colors a layer to a new text color while keeping the opacity it was built
 * with. Muted tones (secondary at 0.68, tertiary at 0.46, hairlines at 0.16) are
 * stored as rgba, so swapping the hex channels preserves the hierarchy without a
 * per-slot special case.
 */
const recolourKeepingAlpha = (previous: string, textColor: string): string => {
    const match = /^rgba\([^)]*,\s*([\d.]+)\)$/i.exec(previous.trim());
    if (!match) return textColor;
    const alpha = Number.parseFloat(match[1]);
    if (alpha >= 1) return textColor;
    return hexToRgba(textColor, alpha);
};

/** Maps the template's background fields onto the canvas background model. */
const fieldsToCanvasBackground = (fields: TemplateFields): CanvasBackground => {
    const mode =
        fields.backgroundMode === "Solid Color"
            ? "solid"
            : fields.backgroundMode === "Background"
              ? "preset"
              : "gradient";

    return {
        ...DEFAULT_CANVAS_BACKGROUND,
        mode,
        color: fields.gradientStart,
        gradientStart: fields.gradientStart,
        gradientEnd: fields.gradientEnd,
        gradientAngle: fields.gradientAngle,
        presetId: fields.backgroundPresetId,
        imageSrc: "",
        imageName: "",
        overlay: fields.gridOverlay,
        overlayColor: fields.gridColor,
        overlayOpacity: fields.gridOpacity,
        overlayBlur: fields.gridBlur,
        // The template card draws its own soft lift; there is no noise film.
        noise: false,
    };
};

interface TextSeed {
    slot: TemplateLayoutSlot;
    text: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontWeight?: number;
    lineHeight?: number;
    letterSpacing?: number;
    align?: TextLayer["align"];
    verticalAlign?: TextLayer["verticalAlign"];
    uppercase?: boolean;
    opacity?: number;
    balance?: boolean;
}

/**
 * Builds a text layer from a compact seed. Only the fields a template preset
 * needs are set; the rest fall back to the canvas defaults so a detached layer
 * behaves exactly like one created in the free editor.
 */
const makeTextLayer = (
    seed: TextSeed,
    fontId: TextLayer["fontId"],
    color: string,
): TextLayer => ({
    id: createId("tpl-layer"),
    kind: "text",
    name: seed.name,
    x: seed.x,
    y: seed.y,
    width: seed.width,
    height: seed.height,
    rotation: 0,
    opacity: seed.opacity ?? 1,
    locked: false,
    hidden: false,
    text: seed.text,
    fontId,
    fontSize: seed.fontSize,
    fontWeight: seed.fontWeight ?? 700,
    italic: false,
    lineHeight: seed.lineHeight ?? 1.08,
    letterSpacing: seed.letterSpacing ?? -0.02,
    align: seed.align ?? "left",
    verticalAlign: seed.verticalAlign ?? "top",
    color,
    uppercase: seed.uppercase ?? false,
    shadow: false,
    balance: seed.balance ?? false,
});

const makeImageLayer = (
    slot: TemplateLayoutSlot,
    name: string,
    src: string,
    box: { x: number; y: number; width: number; height: number },
    fit: ImageLayer["fit"],
    radius: number,
): ImageLayer => ({
    id: createId("tpl-layer"),
    kind: "image",
    name,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: !src,
    src,
    alt: name,
    fit,
    radius,
});

/** A 1px horizontal rule drawn as a shape layer, matching the card's hairlines. */
const makeRule = (x: number, y: number, width: number, color: string): ShapeLayer => ({
    id: createId("tpl-layer"),
    kind: "shape",
    name: "Rule",
    x,
    y,
    width,
    height: 1,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    shape: "rect",
    fillEnabled: true,
    fill: color,
    strokeEnabled: false,
    stroke: color,
    strokeWidth: 0,
    radius: 0,
});

/**
 * Rebuilds each editable template's design as concrete layers at a fixed 1200 x
 * 630. The coordinates mirror the JSX so the card looks the same the moment it
 * is detached; from there the user owns every position.
 */
const buildPresetLayers = (templateId: TemplateId, document: TemplateDocument): TemplateLayout | null => {
    const fields = document.fields;
    const template = getTemplateById(templateId);
    const color = fields.textColor;
    const tone = getCardTone(color);
    const fontId = fields.fontId;
    const headlineSize = fields.titleSize ?? template.defaultTitleSize;
    const headlineTracking = fields.titleTracking ?? template.defaultTitleTracking;

    if (templateId === "minimalist-tech") {
        // Narrow left rail (54% of 1200 = 648) with 56px padding; the headline is
        // bottom anchored in that rail. The screenshot sits on the bottom edge and
        // bleeds past the right, so its box runs wider than the remaining panel.
        const logoImage = makeImageLayer(
            "logoImage",
            "Logo",
            document.logoImage,
            { x: 56, y: 56, width: 44, height: 44 },
            "contain",
            0,
        );
        const brand = makeTextLayer(
            {
                slot: "logo",
                text: fields.logo,
                name: "Brand",
                x: 110,
                y: 58,
                width: 380,
                height: 40,
                fontSize: 21,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: -0.02,
                verticalAlign: "middle",
            },
            fontId,
            color,
        );
        const tag = makeTextLayer(
            {
                slot: "tag",
                text: fields.tag,
                name: "Status",
                x: 300,
                y: 58,
                width: 292,
                height: 40,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: 0.2,
                align: "right",
                verticalAlign: "middle",
                uppercase: true,
            },
            fontId,
            hexToRgba(color, 0.55),
        );
        const title = makeTextLayer(
            {
                slot: "title",
                text: fields.title,
                name: "Headline",
                x: 56,
                y: 300,
                width: 560,
                height: 260,
                fontSize: headlineSize,
                fontWeight: 700,
                lineHeight: 1.03,
                letterSpacing: headlineTracking,
                verticalAlign: "bottom",
            },
            fontId,
            color,
        );
        const image = makeImageLayer(
            "image",
            "Screenshot",
            document.image,
            { x: 648, y: 203, width: 684, height: 428 },
            fields.imageFit,
            fields.imageRadius,
        );

        const layers: Layer[] = [image, logoImage, brand, tag, title];
        return {
            background: fieldsToCanvasBackground(fields),
            layers,
            slots: {
                logoImage: logoImage.id,
                logo: brand.id,
                tag: tag.id,
                title: title.id,
                image: image.id,
            },
        };
    }

    if (templateId === "app-showcase") {
        // Left identity rail (44% of 1200 = 528) with 56px padding, top logo row
        // and a bottom title + subtext block; the product shot bleeds the whole
        // right panel edge to edge.
        const logoImage = makeImageLayer("logoImage", "Logo", document.logoImage, { x: 56, y: 56, width: 40, height: 40 }, "contain", 0);
        const brand = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Brand", x: 108, y: 56, width: 340, height: 40, fontSize: 20, fontWeight: 600, lineHeight: 1, letterSpacing: -0.01, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 56, y: 262, width: 440, height: 175, fontSize: headlineSize, fontWeight: 680, lineHeight: 1.08, letterSpacing: headlineTracking, verticalAlign: "bottom" },
            fontId,
            color,
        );
        const subtext = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Subtext", x: 56, y: 461, width: 416, height: 113, fontSize: 21, fontWeight: 400, lineHeight: 1.35, letterSpacing: 0, verticalAlign: "bottom" },
            fontId,
            tone.secondary,
        );
        const image = makeImageLayer("image", "Product", document.image, { x: 528, y: 0, width: 672, height: 630 }, fields.imageFit, fields.imageRadius);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, logoImage, brand, title, subtext],
            slots: { logoImage: logoImage.id, logo: brand.id, title: title.id, tag: subtext.id, image: image.id },
        };
    }

    if (templateId === "centered-container") {
        // Centred stack: mark, headline, a short rule, then subtext. Everything is
        // horizontally centred with full-width boxes so the type stays balanced.
        const logoImage = makeImageLayer("logoImage", "Logo", document.logoImage, { x: 557, y: 70, width: 86, height: 86 }, "contain", 0);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 150, y: 200, width: 900, height: 158, fontSize: headlineSize, fontWeight: 720, lineHeight: 1.04, letterSpacing: headlineTracking, align: "center" },
            fontId,
            color,
        );
        const rule = makeRule(572, 406, 56, tone.hairline);
        const subtext = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Subtext", x: 320, y: 431, width: 560, height: 129, fontSize: 23, fontWeight: 400, lineHeight: 1.4, letterSpacing: 0, align: "center" },
            fontId,
            tone.secondary,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, rule, title, subtext],
            slots: { logoImage: logoImage.id, title: title.id, tag: subtext.id },
        };
    }

    if (templateId === "brand-pitch") {
        // Headline + subheading on the left column, benefits as a ruled list on the
        // right. Columns split the padded content width 1.15fr / 1fr with a 64px gap.
        const logoImage = makeImageLayer("logoImage", "Logo", document.logoImage, { x: 56, y: 56, width: 40, height: 40 }, "contain", 0);
        const brand = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Brand", x: 108, y: 56, width: 340, height: 40, fontSize: 20, fontWeight: 600, lineHeight: 1, letterSpacing: -0.01, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 56, y: 200, width: 548, height: 140, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.05, letterSpacing: headlineTracking },
            fontId,
            color,
        );
        const subheading = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Subheading", x: 56, y: 356, width: 548, height: 92, fontSize: 22, fontWeight: 400, lineHeight: 1.35, letterSpacing: 0 },
            fontId,
            tone.secondary,
        );

        const benefits = [fields.detailOne, fields.detailTwo, fields.detailThree]
            .map((line) => line.trim())
            .filter(Boolean);
        const rows = [
            { y: 236, slot: "detailOne" as TemplateLayoutSlot, ruleY: -1 },
            { y: 300, slot: "detailTwo" as TemplateLayoutSlot, ruleY: 284 },
            { y: 364, slot: "detailThree" as TemplateLayoutSlot, ruleY: 348 },
        ];
        const benefitTexts: TextLayer[] = [];
        const rules: ShapeLayer[] = [];
        const benefitSlots: Partial<Record<TemplateLayoutSlot, string>> = {};
        rows.forEach((row, i) => {
            if (!benefits[i]) return;
            const text = makeTextLayer(
                { slot: row.slot, text: benefits[i], name: `Benefit ${i + 1}`, x: 668, y: row.y, width: 476, height: 40, fontSize: 21, fontWeight: 400, lineHeight: 1.3, letterSpacing: 0 },
                fontId,
                color,
            );
            benefitTexts.push(text);
            benefitSlots[row.slot] = text.id;
            if (row.ruleY >= 0) rules.push(makeRule(668, row.ruleY, 476, tone.hairline));
        });

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, brand, title, subheading, ...rules, ...benefitTexts],
            slots: { logoImage: logoImage.id, logo: brand.id, title: title.id, tag: subheading.id, ...benefitSlots },
        };
    }

    if (templateId === "editorial-pixel") {
        // Poster: small mark + brand top left, status MetaLabel top right, then a
        // flush-left headline with a right-aligned link line on the same baseline.
        const logoImage = makeImageLayer("logoImage", "Logo", document.logoImage, { x: 56, y: 56, width: 32, height: 32 }, "contain", 0);
        const brand = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Brand", x: 100, y: 56, width: 300, height: 32, fontSize: 19, fontWeight: 600, lineHeight: 1, letterSpacing: -0.01, verticalAlign: "middle" },
            fontId,
            color,
        );
        const status = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Status", x: 900, y: 56, width: 244, height: 32, fontSize: 14, fontWeight: 600, lineHeight: 1, letterSpacing: 0.2, align: "right", verticalAlign: "middle", uppercase: true },
            fontId,
            tone.tertiary,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 56, y: 219, width: 760, height: 355, fontSize: headlineSize, fontWeight: 400, lineHeight: 1.08, letterSpacing: headlineTracking, verticalAlign: "bottom" },
            fontId,
            color,
        );
        const ctaRule = makeRule(1080, 519, 64, tone.hairline);
        const cta = makeTextLayer(
            { slot: "detailOne", text: fields.detailOne, name: "Link", x: 800, y: 536, width: 344, height: 38, fontSize: 22, fontWeight: 400, lineHeight: 1, letterSpacing: 0, align: "right", verticalAlign: "bottom" },
            fontId,
            tone.secondary,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, brand, status, title, ctaRule, cta],
            slots: { logoImage: logoImage.id, logo: brand.id, tag: status.id, title: title.id, detailOne: cta.id },
        };
    }

    if (templateId === "saas-launch") {
        // Stacked announcement: header row, headline, then a keyword ledger on the
        // left (label column + body) and a product shot on the right.
        const logoImage = makeImageLayer("logoImage", "Logo", document.logoImage, { x: 56, y: 48, width: 40, height: 40 }, "contain", 0);
        const brand = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Brand", x: 108, y: 48, width: 340, height: 40, fontSize: 20, fontWeight: 600, lineHeight: 1, letterSpacing: -0.01, verticalAlign: "middle" },
            fontId,
            color,
        );
        const status = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Release", x: 900, y: 48, width: 244, height: 40, fontSize: 14, fontWeight: 600, lineHeight: 1, letterSpacing: 0.2, align: "right", verticalAlign: "middle", uppercase: true },
            fontId,
            tone.tertiary,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 56, y: 124, width: 860, height: 130, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: headlineTracking },
            fontId,
            color,
        );

        const slots: Partial<Record<TemplateLayoutSlot, string>> = { logoImage: logoImage.id, logo: brand.id, tag: status.id, title: title.id };
        const ledger: Layer[] = [];
        [
            { field: fields.detailOne, base: "detailOne" as TemplateLayoutSlot, label: "detailOneLabel" as TemplateLayoutSlot, y: 322 },
            { field: fields.detailTwo, base: "detailTwo" as TemplateLayoutSlot, label: "detailTwoLabel" as TemplateLayoutSlot, y: 400 },
            { field: fields.detailThree, base: "detailThree" as TemplateLayoutSlot, label: "detailThreeLabel" as TemplateLayoutSlot, y: 478 },
        ].forEach((row, i) => {
            const value = row.field.trim();
            if (!value) return;
            const { label, body } = splitPrefixedLine(value);
            if (i > 0) ledger.push(makeRule(56, row.y - 18, 482, tone.hairline));
            const labelLayer = makeTextLayer(
                { slot: row.label, text: label, name: `Keyword ${i + 1}`, x: 56, y: row.y, width: 86, height: 28, fontSize: 15, fontWeight: 600, lineHeight: 1, letterSpacing: 0.14, uppercase: true },
                fontId,
                tone.tertiary,
            );
            const bodyLayer = makeTextLayer(
                { slot: row.base, text: body, name: `Detail ${i + 1}`, x: 162, y: row.y - 4, width: 376, height: 52, fontSize: 21, fontWeight: 400, lineHeight: 1.3, letterSpacing: 0 },
                fontId,
                color,
            );
            ledger.push(labelLayer, bodyLayer);
            slots[row.label] = labelLayer.id;
            slots[row.base] = bodyLayer.id;
        });

        const image = makeImageLayer("image", "Screenshot", document.image, { x: 578, y: 281, width: 566, height: 301 }, fields.imageFit, fields.imageRadius);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, logoImage, brand, status, title, ...ledger],
            slots: { ...slots, image: image.id },
        };
    }

    if (templateId === "blog-post") {
        // Byline + category top bar, serif headline down the left with a short rule
        // above it, and a cover image bleeding off the right and bottom edges.
        const logoImage = makeImageLayer("logoImage", "Logo", document.logoImage, { x: 56, y: 48, width: 36, height: 36 }, "contain", 0);
        const byline = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Byline", x: 104, y: 48, width: 340, height: 36, fontSize: 19, fontWeight: 600, lineHeight: 1, letterSpacing: -0.01, verticalAlign: "middle" },
            fontId,
            color,
        );
        const category = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Category", x: 900, y: 48, width: 244, height: 36, fontSize: 14, fontWeight: 600, lineHeight: 1, letterSpacing: 0.2, align: "right", verticalAlign: "middle", uppercase: true },
            fontId,
            tone.tertiary,
        );
        const rule = makeRule(56, 244, 64, tone.hairline);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 56, y: 273, width: 488, height: 181, fontSize: headlineSize, fontWeight: 600, lineHeight: 1.12, letterSpacing: headlineTracking },
            fontId,
            color,
        );
        const image = makeImageLayer("image", "Cover", document.image, { x: 600, y: 293, width: 600, height: 337 }, fields.imageFit, fields.imageRadius);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, logoImage, byline, category, rule, title],
            slots: { logoImage: logoImage.id, logo: byline.id, tag: category.id, title: title.id, image: image.id },
        };
    }

    if (templateId === "podcast-cover") {
        // Cover art centred on both axes: tracked show name on top, a square artwork
        // beside a title/guest block, and a host mark underneath.
        const showName = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Show", x: 0, y: 107, width: 1200, height: 20, fontSize: 16, fontWeight: 600, lineHeight: 1, letterSpacing: 0.32, align: "center", uppercase: true },
            fontId,
            tone.secondary,
        );
        const image = makeImageLayer("image", "Artwork", document.image, { x: 276, y: 155, width: 300, height: 300 }, fields.imageFit, fields.imageRadius);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Episode", x: 624, y: 159, width: 300, height: 199, fontSize: headlineSize, fontWeight: 740, lineHeight: 1.04, letterSpacing: headlineTracking },
            fontId,
            color,
        );
        const guestRule = makeRule(624, 378, 48, tone.hairline);
        const guest = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Guest", x: 624, y: 399, width: 300, height: 52, fontSize: 20, fontWeight: 400, lineHeight: 1.3, letterSpacing: 0, verticalAlign: "bottom" },
            fontId,
            tone.secondary,
        );
        const hostMark = makeImageLayer("logoImage", "Host mark", document.logoImage, { x: 582, y: 487, width: 36, height: 36 }, "contain", 0);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, showName, guestRule, title, guest, hostMark],
            slots: { logo: showName.id, image: image.id, title: title.id, tag: guest.id, logoImage: hostMark.id },
        };
    }

    if (templateId === "changelog") {
        // Release title over a ruled ledger. Each entry splits into a fixed keyword
        // column and a body, with hairlines separating the rows.
        const logoImage = makeImageLayer("logoImage", "Logo", document.logoImage, { x: 56, y: 56, width: 36, height: 36 }, "contain", 0);
        const product = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Product", x: 104, y: 56, width: 300, height: 36, fontSize: 19, fontWeight: 600, lineHeight: 1, letterSpacing: -0.01, verticalAlign: "middle" },
            fontId,
            color,
        );
        const footer = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Link", x: 900, y: 56, width: 244, height: 36, fontSize: 14, fontWeight: 600, lineHeight: 1, letterSpacing: 0.2, align: "right", verticalAlign: "middle", uppercase: true },
            fontId,
            tone.tertiary,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Release", x: 56, y: 128, width: 900, height: 60, fontSize: headlineSize, fontWeight: 660, lineHeight: 1.06, letterSpacing: headlineTracking },
            fontId,
            color,
        );

        const slots: Partial<Record<TemplateLayoutSlot, string>> = { logoImage: logoImage.id, logo: product.id, tag: footer.id, title: title.id };
        const ledger: Layer[] = [makeRule(56, 217, 1088, tone.hairline)];
        [
            { field: fields.detailOne, base: "detailOne" as TemplateLayoutSlot, label: "detailOneLabel" as TemplateLayoutSlot, top: 217 },
            { field: fields.detailTwo, base: "detailTwo" as TemplateLayoutSlot, label: "detailTwoLabel" as TemplateLayoutSlot, top: 336 },
            { field: fields.detailThree, base: "detailThree" as TemplateLayoutSlot, label: "detailThreeLabel" as TemplateLayoutSlot, top: 455 },
        ].forEach((row, i) => {
            const value = row.field.trim();
            if (!value) return;
            const { label, body } = splitPrefixedLine(value);
            const centerY = row.top + 45;
            const labelLayer = makeTextLayer(
                { slot: row.label, text: label, name: `Keyword ${i + 1}`, x: 56, y: centerY, width: 104, height: 28, fontSize: 15, fontWeight: 600, lineHeight: 1, letterSpacing: 0.16, uppercase: true },
                fontId,
                tone.tertiary,
            );
            const bodyLayer = makeTextLayer(
                { slot: row.base, text: body, name: `Entry ${i + 1}`, x: 188, y: centerY - 4, width: 900, height: 44, fontSize: 23, fontWeight: 400, lineHeight: 1.3, letterSpacing: 0 },
                fontId,
                color,
            );
            ledger.push(labelLayer, bodyLayer, makeRule(56, row.top + 119, 1088, tone.hairline));
            slots[row.label] = labelLayer.id;
            slots[row.base] = bodyLayer.id;
        });

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, product, footer, title, ...ledger],
            slots,
        };
    }

    if (templateId === "neon-grid") {
        // Brand lockup centred on the card: a large replaceable mark beside an
        // uppercase wordmark and a tracked tagline. The decorative blueprint grid and
        // corner glow are background paint the canvas model cannot reproduce, so a
        // detached Neon Grid keeps the gradient fill and the type, and drops those.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 270, y: 240, width: 150, height: 150 }, "contain", 0);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Wordmark", x: 460, y: 216, width: 470, height: 158, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.94, letterSpacing: headlineTracking, uppercase: true },
            fontId,
            color,
        );
        const tagline = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Tagline", x: 460, y: 398, width: 470, height: 20, fontSize: 15, fontWeight: 600, lineHeight: 1, letterSpacing: 0.32, uppercase: true },
            fontId,
            tone.tertiary,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, title, tagline],
            slots: { logoImage: logoImage.id, title: title.id, tag: tagline.id },
        };
    }

    if (templateId === "spotlight") {
        // The diagonal beam and the translucent device frame are background paint the
        // canvas model cannot express, so a detached Spotlight drops both and keeps the
        // gradient fill, the mark, the wordmark, the headline, the hairline and the shot.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 64, y: 64, width: 44, height: 44 }, "contain", 0);
        const brand = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Brand", x: 122, y: 66, width: 380, height: 40, fontSize: 21, fontWeight: 600, lineHeight: 1, letterSpacing: -0.01, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 64, y: 226, width: 560, height: 233, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.02, letterSpacing: headlineTracking, verticalAlign: "bottom", balance: true },
            fontId,
            color,
        );
        const rule = makeRule(64, 483, 56, tone.hairline);
        const tagline = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Support line", x: 64, y: 508, width: 452, height: 58, fontSize: 20, fontWeight: 400, lineHeight: 1.45, letterSpacing: 0 },
            fontId,
            tone.secondary,
        );
        const image = makeImageLayer("image", "Screenshot", document.image, { x: 694, y: 98, width: 580, height: 592 }, fields.imageFit, fields.imageRadius > 0 ? fields.imageRadius : 10);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, logoImage, brand, title, rule, tagline],
            slots: { logoImage: logoImage.id, logo: brand.id, title: title.id, tag: tagline.id, image: image.id },
        };
    }

    if (templateId === "grid-glow") {
        // The extra wide grid and the violet bloom are background paint the canvas model
        // cannot reproduce, so a detached Grid Glow keeps the gradient fill, the mark, the
        // headline block, and the screenshot, and drops both. The image box runs past the
        // fold; the canvas root clips it, so the shot still bleeds off.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 580, y: 44, width: 40, height: 40 }, "contain", 0);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 150, y: 116, width: 900, height: 200, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: headlineTracking, align: "center" },
            fontId,
            color,
        );
        const subhead = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Subhead", x: 290, y: 269, width: 620, height: 30, fontSize: 20, fontWeight: 400, lineHeight: 1.45, letterSpacing: -0.005, align: "center", verticalAlign: "middle" },
            fontId,
            tone.secondary,
        );
        const image = makeImageLayer("image", "Screenshot", document.image, { x: 83, y: 318, width: 1034, height: 646 }, fields.imageFit, fields.imageRadius > 0 ? fields.imageRadius : 18);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, logoImage, title, subhead],
            slots: { logoImage: logoImage.id, title: title.id, tag: subhead.id, image: image.id },
        };
    }

    if (templateId === "arc") {
        // The night vignette, the rose corner bloom, the horizon wash and the glowing arc
        // are background paint the canvas model cannot express, so a detached Aurora Arc
        // keeps the gradient fill, the mark, the wordmark, the headline and the domain line.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 520, y: 96, width: 46, height: 46 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 580, y: 96, width: 220, height: 46, fontSize: 19, fontWeight: 700, lineHeight: 1.1, letterSpacing: 0.01, verticalAlign: "middle", uppercase: true },
            fontId,
            tone.secondary,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 260, y: 207, width: 680, height: 250, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle" },
            fontId,
            color,
        );
        const domain = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Domain", x: 220, y: 522, width: 760, height: 30, fontSize: 30, fontWeight: 500, lineHeight: 1, letterSpacing: 0.01, align: "center" },
            fontId,
            tone.secondary,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, domain],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, tag: domain.id },
        };
    }

    if (templateId === "teal-grid") {
        // The wide grid, the plate behind the type and the teal bloom are background paint
        // the canvas model cannot reproduce, so a detached Teal Grid keeps the gradient
        // fill, the type and both images, and drops those plus the shell bezel.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 580, y: 46, width: 40, height: 40 }, "contain", 0);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 250, y: 132, width: 700, height: 140, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: headlineTracking, align: "center", balance: true },
            fontId,
            color,
        );
        const tagline = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Subheadline", x: 320, y: 292, width: 560, height: 28, fontSize: 18, fontWeight: 400, lineHeight: 1.45, letterSpacing: 0.005, align: "center" },
            fontId,
            tone.secondary,
        );
        const shellRadius = fields.imageRadius > 0 ? fields.imageRadius : 24;
        const image = makeImageLayer("image", "Screenshot", document.image, { x: 83, y: 364, width: 1034, height: 646 }, fields.imageFit, Math.max(4, shellRadius - 16));

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, title, tagline, image],
            slots: { logoImage: logoImage.id, title: title.id, tag: tagline.id, image: image.id },
        };
    }

    if (templateId === "mesh") {
        // The mesh glow, night veil and filament arc are background paint the canvas model
        // cannot reproduce, so a detached Color Mesh keeps the base gradient fill, the mark,
        // the wordmark and the type, and drops those.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 64, y: 56, width: 64, height: 64 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 148, y: 56, width: 300, height: 64, fontSize: 22, fontWeight: 700, lineHeight: 1.1, letterSpacing: 0.01, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 64, y: 354, width: 980, height: 172, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.02, letterSpacing: headlineTracking },
            fontId,
            color,
        );
        const tagline = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Subtext", x: 64, y: 548, width: 680, height: 26, fontSize: 22, fontWeight: 500, lineHeight: 1.2, letterSpacing: 0 },
            fontId,
            tone.secondary,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, tagline],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, tag: tagline.id },
        };
    }

    if (templateId === "dusk") {
        // Dusk's light is background paint the canvas model cannot express, so a detached
        // Dusk keeps the base gradient and the type on the left rail: mark, wordmark,
        // headline, and the tag line.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 64, y: 80, width: 33, height: 44 }, "contain", 0);
        const brand = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 109, y: 80, width: 220, height: 44, fontSize: 21, fontWeight: 700, lineHeight: 1.05, letterSpacing: 0.01, verticalAlign: "middle", uppercase: true },
            fontId,
            color,
        );
        const tagline = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Tagline", x: 64, y: 528, width: 620, height: 28, fontSize: 20, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0.005, verticalAlign: "top" },
            fontId,
            tone.secondary,
        );
        const titleBottom = (fields.tag || "").trim() ? 506 : 556;
        const titleHeight = Math.round(headlineSize * 1.04 * 3);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 64, y: titleBottom - titleHeight, width: 620, height: titleHeight, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: headlineTracking, verticalAlign: "bottom" },
            fontId,
            color,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, brand, title, tagline],
            slots: { logoImage: logoImage.id, logo: brand.id, title: title.id, tag: tagline.id },
        };
    }

    if (templateId === "spectrum") {
        // The rainbow strip, its spill, and the warm lower-left glow are background paint
        // the canvas model cannot reproduce, so a detached Spectrum keeps the gradient fill,
        // the mark, the headline, the tag, and the shot.
        const mark = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 578, y: 70, width: 44, height: 44 }, "contain", 0);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 170, y: 130, width: 860, height: 134, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: headlineTracking, align: "center" },
            fontId,
            color,
        );
        const tag = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Tagline", x: 240, y: 212, width: 720, height: 28, fontSize: 21, fontWeight: 400, lineHeight: 1.35, letterSpacing: 0, align: "center" },
            fontId,
            tone.secondary,
        );
        const image = makeImageLayer("image", "Screenshot", document.image, { x: 20, y: 300, width: 1160, height: 470 }, fields.imageFit, fields.imageRadius);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, mark, title, tag],
            slots: { logoImage: mark.id, title: title.id, tag: tag.id, image: image.id },
        };
    }

    if (templateId === "ticket") {
        // The maroon ticket is a notched SVG silhouette the canvas model cannot reproduce,
        // so a detached Notch Card keeps the purple gradient fill, the mark, the wordmark,
        // the headline and the domain line, and drops the panel.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 512, y: 70, width: 40, height: 53 }, "contain", 0);
        const brand = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 567, y: 70, width: 280, height: 53, fontSize: 27, fontWeight: 700, lineHeight: 1, letterSpacing: -0.01, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 190, y: 147, width: 820, height: 331, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.02, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );
        const domain = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Domain", x: 380, y: 502, width: 440, height: 28, fontSize: 28, fontWeight: 600, lineHeight: 1, letterSpacing: 0.005, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            tone.secondary,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, brand, title, domain],
            slots: { logoImage: logoImage.id, logo: brand.id, title: title.id, tag: domain.id },
        };
    }

    if (templateId === "deck") {
        // The green top glow and the two side deck frames are background paint, so a
        // detached Stacked Deck keeps the gradient fill, the mark, the headline, the tagline
        // and the screenshot. The shot sits on a plate that runs past the fold.
        const screenRadius = fields.imageRadius > 0 ? fields.imageRadius : 10;
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 578, y: 42, width: 44, height: 44 }, "contain", 0);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 130, y: 106, width: 940, height: 200, fontSize: headlineSize, fontWeight: 760, lineHeight: 1.02, letterSpacing: headlineTracking, align: "center", balance: true },
            fontId,
            color,
        );
        const tagline = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Tagline", x: 290, y: 224, width: 620, height: 56, fontSize: 19, fontWeight: 400, lineHeight: 1.45, letterSpacing: 0, align: "center" },
            fontId,
            tone.secondary,
        );
        const image = makeImageLayer("image", "Screenshot", document.image, { x: 126, y: 394, width: 948, height: 533 }, fields.imageFit, screenRadius);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, logoImage, title, tagline],
            slots: { logoImage: logoImage.id, title: title.id, tag: tagline.id, image: image.id },
        };
    }

    if (templateId === "bento") {
        // The rainbow panel and the card rectangles are background paint the canvas model
        // cannot reproduce, so a detached Stat Bento keeps the black gradient fill plus the
        // headline, the domain, and the three value/caption pairs as plain text layers.
        const RAIL_WIDTH = 497;
        const PAD = 44;
        const GAP = 24;
        const GRID_X = RAIL_WIDTH + PAD;
        const GRID_W = 1200 - GRID_X - PAD;
        const ROW_H = (630 - PAD * 2 - GAP) / 2;
        const NARROW_W = 209;
        const CARD_PAD_TOP = 39;
        const CARD_PAD_BOTTOM = 36;
        const CARD_PAD_X = 24;
        const CARD_GAP = 36;
        const RAIL_PAD_TOP = 48;
        const RAIL_PAD_RIGHT = 64;
        const RAIL_PAD_LEFT = 72;
        const RAIL_PAD_BOTTOM = 42;
        const RAIL_TEXT_W = RAIL_WIDTH - RAIL_PAD_LEFT - RAIL_PAD_RIGHT;

        const rows = [
            { field: fields.detailOne, base: "detailOne" as TemplateLayoutSlot, label: "detailOneLabel" as TemplateLayoutSlot },
            { field: fields.detailTwo, base: "detailTwo" as TemplateLayoutSlot, label: "detailTwoLabel" as TemplateLayoutSlot },
            { field: fields.detailThree, base: "detailThree" as TemplateLayoutSlot, label: "detailThreeLabel" as TemplateLayoutSlot },
        ];
        const shown = rows.filter((row) => row.field.trim());
        const half = Math.round((GRID_W - GAP) / 2);
        const boxes =
            shown.length >= 3
                ? [
                      { x: GRID_X, y: PAD, width: NARROW_W, height: ROW_H },
                      { x: GRID_X + NARROW_W + GAP, y: PAD, width: GRID_W - NARROW_W - GAP, height: ROW_H },
                      { x: GRID_X, y: PAD + ROW_H + GAP, width: GRID_W, height: ROW_H },
                  ]
                : shown.length === 2
                  ? [
                        { x: GRID_X, y: PAD, width: half, height: 630 - PAD * 2 },
                        { x: GRID_X + half + GAP, y: PAD, width: GRID_W - half - GAP, height: 630 - PAD * 2 },
                    ]
                  : shown.length === 1
                    ? [{ x: GRID_X, y: PAD, width: GRID_W, height: 630 - PAD * 2 }]
                    : [];

        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: RAIL_PAD_LEFT, y: RAIL_PAD_TOP, width: RAIL_TEXT_W, height: Math.round(headlineSize * 1.04 * 3), fontSize: headlineSize, fontWeight: 640, lineHeight: 1.04, letterSpacing: headlineTracking },
            fontId,
            color,
        );
        const brand = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Domain", x: RAIL_PAD_LEFT, y: 630 - RAIL_PAD_BOTTOM - 33, width: RAIL_TEXT_W, height: 33, fontSize: 30, fontWeight: 600, lineHeight: 1.1, letterSpacing: -0.015, verticalAlign: "bottom" },
            fontId,
            color,
        );

        const slots: Partial<Record<TemplateLayoutSlot, string>> = { title: title.id, logo: brand.id };
        const cards: Layer[] = [];
        shown.forEach((row, i) => {
            const box = boxes[i];
            if (!box) return;
            const { label, body } = splitPrefixedLine(row.field);
            const hasValue = Boolean(label);
            const pinned = hasValue && box.height <= 320;
            const valueSize = Math.round(
                Math.max(26, Math.min(72, (box.width - CARD_PAD_X * 2 - 8) / (Math.max((hasValue ? label : body).length, 2) * 0.6))),
            );
            const captionSize = Math.round(
                Math.max(15, Math.min(24, (box.width - CARD_PAD_X * 2) / (Math.max(body.length, 8) * 0.52))),
            );
            const valueHeight = Math.round(valueSize * 1.02);
            const captionHeight = Math.round(captionSize * 1.3);
            const centerY = box.y + box.height / 2;
            const valueY = pinned ? box.y + CARD_PAD_TOP : Math.round(centerY - (CARD_GAP + captionHeight) / 2 - valueHeight);
            const captionY = pinned ? Math.round(box.y + box.height - CARD_PAD_BOTTOM - captionHeight * 2) : Math.round(centerY + (valueHeight + CARD_GAP) / 2);

            const valueLayer = makeTextLayer(
                { slot: row.label, text: label, name: `Stat ${i + 1}`, x: box.x, y: valueY, width: box.width, height: valueHeight, fontSize: valueSize, fontWeight: 640, lineHeight: 1.02, letterSpacing: -0.04, align: "center", verticalAlign: pinned ? "top" : "bottom" },
                fontId,
                color,
            );
            const captionLayer = makeTextLayer(
                { slot: row.base, text: body, name: `Caption ${i + 1}`, x: box.x, y: captionY, width: box.width, height: captionHeight * 2, fontSize: captionSize, fontWeight: 600, lineHeight: 1.3, letterSpacing: 0.01, align: "center", verticalAlign: pinned ? "bottom" : "top" },
                fontId,
                hasValue ? hexToRgba(color, 0.68) : color,
            );

            cards.push(valueLayer, captionLayer);
            slots[row.label] = valueLayer.id;
            slots[row.base] = captionLayer.id;
        });

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [title, brand, ...cards],
            slots,
        };
    }

    if (templateId === "crossglow") {
        // The extra 40px grid and the two violet blooms are background paint the canvas
        // model cannot reproduce, so a detached Grid Bloom keeps the gradient fill, the
        // mark, the wordmark, the headline and the domain, and drops those.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 524, y: 96, width: 30, height: 40 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 554, y: 96, width: 132, height: 46, fontSize: 26, fontWeight: 700, lineHeight: 0.88, letterSpacing: -0.01, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 190, y: 152, width: 820, height: 350, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );
        const domain = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Domain", x: 0, y: 520, width: 1200, height: 32, fontSize: 32, fontWeight: 500, lineHeight: 1, letterSpacing: -0.005, align: "center", verticalAlign: "middle" },
            fontId,
            hexToRgba(color, 0.86),
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, domain],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, tag: domain.id },
        };
    }

    if (templateId === "horizon-bloom") {
        // The bloom and the 160px hairline grid are background paint the canvas model
        // cannot reproduce, so a detached Horizon Bloom keeps the gradient fill, the mark,
        // the wordmark and the headline, and drops those.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 497, y: 127, width: 42, height: 56 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 553, y: 127, width: 150, height: 56, fontSize: 36, fontWeight: 700, lineHeight: 0.85, letterSpacing: -0.01, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 150, y: 249, width: 900, height: 224, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.966, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id },
        };
    }

    if (templateId === "corner-flare") {
        // The three flare fields and the panel bezel are background paint the canvas model
        // cannot express, so a detached Corner Flare keeps the gradient fill, the mark, the
        // wordmark, the headline block and the shot inside the panel's inset, and drops
        // those. The rail centres the headline and its support line as one group, so both
        // boxes solve against the rail band rather than the canvas.
        const RAIL_TOP = 108;
        const RAIL_HEIGHT = 430;
        const TAG_GAP = 26;
        const support = (fields.tag || "").trim();
        const titleHeight = Math.round(headlineSize * 1.02 * 3);
        const supportHeight = support ? Math.round(22 * 1.45 * 2) : 0;
        const groupHeight = titleHeight + (support ? TAG_GAP + supportHeight : 0);
        const groupTop = Math.round(RAIL_TOP + (RAIL_HEIGHT - groupHeight) / 2);

        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 68, y: 62, width: 28, height: 38 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 108, y: 62, width: 240, height: 38, fontSize: 21, fontWeight: 600, lineHeight: 1.1, letterSpacing: -0.015, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 68, y: groupTop, width: 620, height: titleHeight, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.02, letterSpacing: headlineTracking, balance: true },
            fontId,
            color,
        );
        const image = makeImageLayer("image", "Screenshot", document.image, { x: 827.5, y: 89.5, width: 382.5, height: 550.5 }, fields.imageFit, fields.imageRadius > 0 ? fields.imageRadius : 8);

        const layers: Layer[] = [image, logoImage, wordmark, title];
        const slots: Partial<Record<TemplateLayoutSlot, string>> = { logoImage: logoImage.id, logo: wordmark.id, title: title.id, image: image.id };
        if (support) {
            const tag = makeTextLayer(
                { slot: "tag", text: support, name: "Support line", x: 68, y: groupTop + titleHeight + TAG_GAP, width: 520, height: supportHeight, fontSize: 22, fontWeight: 500, lineHeight: 1.45, letterSpacing: -0.005 },
                fontId,
                hexToRgba(color, 0.68),
            );
            layers.push(tag);
            slots.tag = tag.id;
        }

        return { background: fieldsToCanvasBackground(fields), layers, slots };
    }

    if (templateId === "solar-mesh") {
        // The four quadrant rings, the diagonal band and the hairline grid are background
        // paint the canvas model cannot reproduce, so a detached Solar Mesh keeps the
        // gradient fill, the mark, the wordmark, the headline and the domain line.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 497, y: 80, width: 42, height: 56 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 553, y: 80, width: 150, height: 56, fontSize: 36, fontWeight: 700, lineHeight: 0.85, letterSpacing: -0.01, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 190, y: 213, width: 820, height: 225, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.95, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );
        const domain = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Domain", x: 0, y: 524, width: 1200, height: 30, fontSize: 30, fontWeight: 600, lineHeight: 1, letterSpacing: -0.01, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, domain],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, tag: domain.id },
        };
    }

    if (templateId === "violet-rail") {
        // The violet floor pool, the seam light and the panel bezel are background paint
        // the canvas model cannot express, so a detached Violet Rail keeps the gradient
        // fill, the mark, the wordmark and the shot inside the panel's inset.
        const BOTTOM = 76;
        const titleHeight = Math.round(headlineSize * 1.04 * 2);
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 64, y: 72, width: 33, height: 44 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 115, y: 72, width: 150, height: 44, fontSize: 26, fontWeight: 700, lineHeight: 0.88, letterSpacing: -0.01, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 64, y: 630 - BOTTOM - titleHeight, width: 506, height: titleHeight, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: headlineTracking, verticalAlign: "bottom", balance: true },
            fontId,
            color,
        );
        const image = makeImageLayer("image", "Screenshot", document.image, { x: 658.5, y: 89.5, width: 592, height: 552 }, fields.imageFit, fields.imageRadius > 0 ? fields.imageRadius : 8);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, logoImage, wordmark, title],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, image: image.id },
        };
    }

    if (templateId === "tilt-plate") {
        // The tilted plate, its rim bands and the two corner pools are background paint
        // the canvas model cannot reproduce, so a detached Tilted Plate keeps the gradient
        // fill, the mark, the wordmark, the headline and the domain line.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 506, y: 99, width: 36, height: 48 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 554, y: 99, width: 140, height: 48, fontSize: 29, fontWeight: 700, lineHeight: 0.87, letterSpacing: -0.01, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 290, y: 108, width: 620, height: 430, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.98, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );
        const domain = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Domain", x: 0, y: 514, width: 1200, height: 40, fontSize: 40, fontWeight: 500, lineHeight: 1, letterSpacing: -0.005, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            hexToRgba(color, 0.86),
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, domain],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, tag: domain.id },
        };
    }

    if (templateId === "stat-rail") {
        // The panel fills, their hairline edge and the top glint are background paint the
        // canvas model cannot reproduce, so a detached Stat Rail keeps the background
        // fill, the mark, the wordmark, the headline and every numeral and caption as
        // plain text layers. The boxes follow the component's field exactly: four keep
        // the reference's bento, three grow a full width panel along the bottom, two
        // split the field into full height columns, one takes all of it.
        const GRID_X = 537.5;
        const GRID_Y = 48.5;
        const GRID_W = 614;
        const GRID_H = 541;
        const GUTTER = 25;
        const NARROW_W = 208;
        const WIDE_W = 381;
        const CARD_H = 258;
        const PAD_X = 64;
        const CARD_PAD_TOP = 28;
        const CARD_PAD_BOTTOM = 20;
        const CARD_PAD_X = 24;
        const VALUE_MAX = 87;
        const CAPTION_MAX = 21;
        const CAPTION_MIN = 13;
        const CARD_GAP = 28;

        const rows = [
            { field: fields.detailOne, base: "detailOne" as TemplateLayoutSlot, label: "detailOneLabel" as TemplateLayoutSlot },
            { field: fields.detailTwo, base: "detailTwo" as TemplateLayoutSlot, label: "detailTwoLabel" as TemplateLayoutSlot },
            { field: fields.detailThree, base: "detailThree" as TemplateLayoutSlot, label: "detailThreeLabel" as TemplateLayoutSlot },
            // The fourth stat rides in the tag field, the same way the template holds it.
            { field: fields.tag, base: "tag" as TemplateLayoutSlot, label: "tagLabel" as TemplateLayoutSlot },
        ];
        const shown = rows.filter((row) => row.field.trim());
        const half = Math.round((GRID_W - GUTTER) / 2);
        const boxes =
            shown.length >= 4
                ? [
                      { x: GRID_X, y: GRID_Y, width: NARROW_W, height: CARD_H },
                      { x: GRID_X + NARROW_W + GUTTER, y: GRID_Y, width: WIDE_W, height: CARD_H },
                      { x: GRID_X, y: GRID_Y + CARD_H + GUTTER, width: WIDE_W, height: CARD_H },
                      { x: GRID_X + WIDE_W + GUTTER, y: GRID_Y + CARD_H + GUTTER, width: NARROW_W, height: CARD_H },
                  ]
                : shown.length === 3
                  ? [
                        { x: GRID_X, y: GRID_Y, width: NARROW_W, height: CARD_H },
                        { x: GRID_X + NARROW_W + GUTTER, y: GRID_Y, width: WIDE_W, height: CARD_H },
                        { x: GRID_X, y: GRID_Y + CARD_H + GUTTER, width: GRID_W, height: CARD_H },
                    ]
                  : shown.length === 2
                    ? [
                          { x: GRID_X, y: GRID_Y, width: half, height: GRID_H },
                          { x: GRID_X + half + GUTTER, y: GRID_Y, width: GRID_W - half - GUTTER, height: GRID_H },
                      ]
                    : shown.length === 1
                      ? [{ x: GRID_X, y: GRID_Y, width: GRID_W, height: GRID_H }]
                      : [];

        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: PAD_X, y: 72, width: 33, height: 44 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 108, y: 72, width: 104, height: 48, fontSize: 28, fontWeight: 700, lineHeight: 0.86, letterSpacing: -0.01, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const titleHeight = Math.round(headlineSize * 0.95 * 2);
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: PAD_X, y: 630 - 72 - titleHeight, width: 440, height: titleHeight, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.95, letterSpacing: headlineTracking, verticalAlign: "bottom", balance: true },
            fontId,
            color,
        );

        const slots: Partial<Record<TemplateLayoutSlot, string>> = { logoImage: logoImage.id, logo: wordmark.id, title: title.id };
        const cards: Layer[] = [];
        shown.forEach((row, i) => {
            const box = boxes[i];
            if (!box) return;
            const { label, body } = splitPrefixedLine(row.field);
            const hasValue = Boolean(label);
            const valueSize = Math.round(
                Math.max(26, Math.min(VALUE_MAX, (box.width - CARD_PAD_X * 2) / (Math.max((hasValue ? label : body).length, 2) * 0.58))),
            );
            const captionSize = Math.round(
                Math.max(CAPTION_MIN, Math.min(CAPTION_MAX, (box.width - CARD_PAD_X * 2) / (Math.max(body.length, 6) * 0.66))),
            );
            const valueHeight = Math.round(valueSize);
            const captionLine = Math.round(captionSize * 1.3);
            const pinned = box.height <= CARD_H;
            const centerY = box.y + box.height / 2;
            const valueY = pinned ? box.y + CARD_PAD_TOP : Math.round(centerY - (CARD_GAP + captionLine) / 2 - valueHeight);
            const captionY = pinned
                ? hasValue
                    ? Math.round(box.y + box.height - CARD_PAD_BOTTOM - captionLine * 2)
                    : Math.round(centerY - captionLine)
                : hasValue
                  ? Math.round(centerY + (valueHeight + CARD_GAP) / 2)
                  : Math.round(centerY - captionLine);

            const valueLayer = makeTextLayer(
                { slot: row.label, text: label, name: `Stat ${i + 1}`, x: box.x, y: valueY, width: box.width, height: valueHeight, fontSize: valueSize, fontWeight: 400, lineHeight: 1, letterSpacing: -0.04, align: "center", verticalAlign: pinned ? "top" : "bottom" },
                fontId,
                color,
            );
            const captionLayer = makeTextLayer(
                { slot: row.base, text: body, name: `Caption ${i + 1}`, x: box.x, y: captionY, width: box.width, height: captionLine * 2, fontSize: captionSize, fontWeight: 600, lineHeight: 1.3, letterSpacing: 0.02, align: "center", uppercase: true, verticalAlign: pinned ? "bottom" : "top" },
                fontId,
                hasValue ? hexToRgba(color, 0.5) : color,
            );

            cards.push(valueLayer, captionLayer);
            slots[row.label] = valueLayer.id;
            slots[row.base] = captionLayer.id;
        });

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, ...cards],
            slots,
        };
    }

    if (templateId === "prism-frame") {
        // The rainbow band, the ink panel and its bezel are background paint the canvas
        // model cannot reproduce, so a detached Prism Frame keeps the gradient fill, the
        // mark, the wordmark and the shot inside the bezel's inset.
        const BOTTOM = 76;
        const titleHeight = Math.round(headlineSize * 0.95 * 2);
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 64, y: 80, width: 33, height: 44 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 108, y: 80, width: 112, height: 48, fontSize: 27, fontWeight: 700, lineHeight: 0.88, letterSpacing: -0.02, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 64, y: 630 - BOTTOM - titleHeight, width: 480, height: titleHeight, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.95, letterSpacing: headlineTracking, verticalAlign: "bottom", balance: true },
            fontId,
            color,
        );
        const image = makeImageLayer("image", "Screenshot", document.image, { x: 673, y: 64, width: 1106, height: 802 }, fields.imageFit, fields.imageRadius > 0 ? fields.imageRadius : 8);

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [image, logoImage, wordmark, title],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, image: image.id },
        };
    }

    if (templateId === "arch-glow") {
        // The arch and the hairline grid are background paint the canvas model cannot
        // reproduce, so a detached Arch Glow keeps the gradient fill plus the headline and
        // the tagline. The two are centred as one group inside the band, so an empty
        // tagline lets the headline hold the middle on its own.
        const BAND_TOP = 166;
        const BAND_HEIGHT = 630 - BAND_TOP - 174;
        const TAG_GAP = 40;
        const tagline = (fields.tag || "").trim();
        const titleHeight = Math.round(headlineSize * 0.98 * 2);
        const groupHeight = titleHeight + (tagline ? TAG_GAP + 26 : 0);
        const groupTop = Math.round(BAND_TOP + (BAND_HEIGHT - groupHeight) / 2);

        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 130, y: groupTop, width: 940, height: titleHeight, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.98, letterSpacing: headlineTracking, align: "center", balance: true },
            fontId,
            color,
        );

        const layers: Layer[] = [title];
        const slots: Partial<Record<TemplateLayoutSlot, string>> = { title: title.id };
        if (tagline) {
            const tag = makeTextLayer(
                { slot: "tag", text: tagline, name: "Tagline", x: 240, y: groupTop + titleHeight + TAG_GAP, width: 720, height: 26, fontSize: 26, fontWeight: 600, lineHeight: 1, letterSpacing: 0.18, align: "center", uppercase: true, verticalAlign: "middle", balance: true },
                fontId,
                hexToRgba(color, 0.68),
            );
            layers.push(tag);
            slots.tag = tag.id;
        }

        return { background: fieldsToCanvasBackground(fields), layers, slots };
    }

    if (templateId === "facet-field") {
        // The three opaque plates and the veil below y 200 are background paint the canvas
        // model cannot reproduce, so a detached Facet Field keeps the gradient fill, the mark,
        // the wordmark, the headline and the domain line.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 506, y: 99, width: 36, height: 48 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 554, y: 99, width: 140, height: 48, fontSize: 29, fontWeight: 700, lineHeight: 0.87, letterSpacing: -0.01, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 240, y: 156, width: 720, height: 362, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.98, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );
        const domain = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Domain", x: 0, y: 518, width: 1200, height: 40, fontSize: 40, fontWeight: 500, lineHeight: 1, letterSpacing: -0.005, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, domain],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, tag: domain.id },
        };
    }

    if (templateId === "cyan-rim") {
        // The rim lit disc, the tilted beam and the panel's edge light are background paint
        // the canvas model cannot express, so a detached Cyan Rim keeps the gradient fill,
        // the mark, the wordmark, the headline block and the shot. The support line hangs
        // off the headline's own box, so it and the hairline sit just under it.
        const RAIL_TOP = 92;
        const RAIL_HEIGHT = 630 - RAIL_TOP * 2;
        const TAG_GAP = 28;
        const support = (fields.tag || "").trim();
        const titleHeight = Math.round(headlineSize * 0.92 * 2);
        const titleTop = Math.round(RAIL_TOP + (RAIL_HEIGHT - titleHeight) / 2);

        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 68, y: 64, width: 24, height: 32 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 103, y: 64, width: 200, height: 32, fontSize: 20, fontWeight: 600, lineHeight: 1.1, letterSpacing: -0.015, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 68, y: RAIL_TOP, width: 600, height: RAIL_HEIGHT, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.92, letterSpacing: headlineTracking, verticalAlign: "middle", balance: true },
            fontId,
            color,
        );
        const image = makeImageLayer("image", "Screenshot", document.image, { x: 695.5, y: 65.5, width: 538.5, height: 598.5 }, fields.imageFit, fields.imageRadius > 0 ? fields.imageRadius : 26);

        const layers: Layer[] = [image, logoImage, wordmark, title];
        const slots: Partial<Record<TemplateLayoutSlot, string>> = { logoImage: logoImage.id, logo: wordmark.id, title: title.id, image: image.id };
        if (support) {
            const ruleY = titleTop + titleHeight + TAG_GAP;
            layers.push(makeRule(68, ruleY, 56, tone.hairline));
            const tag = makeTextLayer(
                { slot: "tag", text: support, name: "Support line", x: 68, y: ruleY + 21, width: 452, height: Math.round(20 * 1.45 * 2), fontSize: 20, fontWeight: 500, lineHeight: 1.45, letterSpacing: -0.005 },
                fontId,
                hexToRgba(color, 0.68),
            );
            layers.push(tag);
            slots.tag = tag.id;
        }

        return { background: fieldsToCanvasBackground(fields), layers, slots };
    }

    if (templateId === "light-column") {
        // The shaft of light and its spill are background paint the canvas model cannot
        // reproduce, so a detached Light Column keeps the gradient fill, the mark, the
        // wordmark, the headline and the domain line.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 517, y: 99, width: 36, height: 48 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 565, y: 99, width: 118, height: 52, fontSize: 30, fontWeight: 700, lineHeight: 0.87, letterSpacing: -0.03, uppercase: true, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 160, y: 192, width: 880, height: 262, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.9, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );
        const domain = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Domain", x: 0, y: 515, width: 1200, height: 38, fontSize: 38, fontWeight: 500, lineHeight: 1, letterSpacing: -0.01, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, domain],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, tag: domain.id },
        };
    }

    if (templateId === "soft-mesh") {
        // The blurred colour field is background paint the canvas model cannot reproduce,
        // so a detached Soft Mesh keeps the gradient fill, the mark, the wordmark, the
        // headline and the domain line.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 509, y: 80, width: 42, height: 56 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 565, y: 80, width: 126, height: 34, fontSize: 34, fontWeight: 700, lineHeight: 0.89, letterSpacing: -0.01, uppercase: true, verticalAlign: "top" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 130, y: 150, width: 940, height: 325, fontSize: headlineSize, fontWeight: 700, lineHeight: 0.95, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );
        const domain = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Domain", x: 0, y: 522, width: 1200, height: 28, fontSize: 28, fontWeight: 500, lineHeight: 1, letterSpacing: -0.01, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            hexToRgba(color, 0.95),
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, domain],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, tag: domain.id },
        };
    }

    if (templateId === "agile-startup") {
        // The reference's corner lighting is SVG/CSS paint, so detached mode
        // preserves the editable type and standard canvas background controls.
        const logoImage = makeImageLayer("logoImage", "Mark", document.logoImage, { x: 530, y: 112, width: 40, height: 40 }, "contain", 0);
        const wordmark = makeTextLayer(
            { slot: "logo", text: fields.logo, name: "Wordmark", x: 578, y: 112, width: 180, height: 40, fontSize: 26, fontWeight: 700, lineHeight: 1, letterSpacing: 0.02, verticalAlign: "middle" },
            fontId,
            color,
        );
        const title = makeTextLayer(
            { slot: "title", text: fields.title, name: "Headline", x: 190, y: 220, width: 820, height: 150, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.05, letterSpacing: headlineTracking, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            color,
        );
        const domain = makeTextLayer(
            { slot: "tag", text: fields.tag, name: "Domain", x: 0, y: 516, width: 1200, height: 34, fontSize: 28, fontWeight: 500, lineHeight: 1, letterSpacing: -0.01, align: "center", verticalAlign: "middle", balance: true },
            fontId,
            tone.secondary,
        );

        return {
            background: fieldsToCanvasBackground(fields),
            layers: [logoImage, wordmark, title, domain],
            slots: { logoImage: logoImage.id, logo: wordmark.id, title: title.id, tag: domain.id },
        };
    }

    return null;
};

/** Detaches a template into editable layers. Returns null if it has no preset. */
export const buildTemplateLayout = (document: TemplateDocument): TemplateLayout | null =>
    buildPresetLayers(document.templateId, document);

const findSlot = (layout: TemplateLayout, slot: TemplateLayoutSlot): Layer | undefined => {
    const layerId = layout.slots[slot];
    return layerId ? layout.layers.find((layer) => layer.id === layerId) : undefined;
};

/**
 * Writes the fields the user just changed into the detached layers. Geometry
 * (x/y/width/height/rotation/opacity) is never touched, so dragging an element
 * and then editing its copy keeps the placement.
 */
export const applyFieldsToLayout = (
    document: TemplateDocument,
    changedKeys: string[],
): TemplateDocument => {
    const layout = document.layout;
    if (!layout) return document;

    const fields = document.fields;
    const changed = new Set(changedKeys);
    let layers = layout.layers;
    const cloneLayer = (id: string) => {
        const index = layers.findIndex((layer) => layer.id === id);
        if (index === -1) return null;
        const copy = { ...layers[index] };
        layers = layers.map((layer, i) => (i === index ? copy : layer));
        return copy;
    };

    if (changed.has("textColor")) {
        layers = layers.map((layer) => {
            if (layer.kind === "text") {
                return { ...layer, color: recolourKeepingAlpha(layer.color, fields.textColor) };
            }
            if (layer.kind === "shape") {
                return {
                    ...layer,
                    fill: recolourKeepingAlpha(layer.fill, fields.textColor),
                    stroke: recolourKeepingAlpha(layer.stroke, fields.textColor),
                };
            }
            return layer;
        });
    }

    if (changed.has("fontId")) {
        layers = layers.map((layer) => (layer.kind === "text" ? { ...layer, fontId: fields.fontId } : layer));
    }

    if (changed.has("titleSize") || changed.has("titleTracking")) {
        const titleId = layout.slots.title;
        const title = titleId ? cloneLayer(titleId) : null;
        if (title && title.kind === "text") {
            if (changed.has("titleSize")) title.fontSize = fields.titleSize ?? getTemplateById(document.templateId).defaultTitleSize;
            if (changed.has("titleTracking")) title.letterSpacing = fields.titleTracking ?? getTemplateById(document.templateId).defaultTitleTracking;
        }
    }

    for (const slotKey of TEXT_SLOT_KEYS) {
        if (!changed.has(slotKey)) continue;
        const layer = findSlot(layout, slotKey);
        if (!layer || layer.kind !== "text") continue;
        const value = fields[slotKey as keyof TemplateFields] as string;
        const copy = cloneLayer(layer.id);
        if (!copy || copy.kind !== "text") continue;

        // Ledger templates registered a keyword layer beside this one, so the field
        // is split again the same way the preset built it. Otherwise the layer holds
        // the whole line.
        const labelKey = DETAIL_LABEL_SLOT[slotKey];
        const labelId = labelKey ? layout.slots[labelKey] : undefined;
        if (labelId) {
            const { label, body } = splitPrefixedLine(value);
            copy.text = body;
            const labelLayer = cloneLayer(labelId);
            if (labelLayer && labelLayer.kind === "text") labelLayer.text = label;
        } else {
            copy.text = value;
        }
    }

    if (changed.has("imageFit") || changed.has("imageRadius")) {
        const imageId = layout.slots.image;
        const image = imageId ? cloneLayer(imageId) : null;
        if (image && image.kind === "image") {
            if (changed.has("imageFit")) image.fit = fields.imageFit;
            if (changed.has("imageRadius")) image.radius = fields.imageRadius;
        }
    }

    if (changed.has("logoImage")) {
        const id = layout.slots.logoImage;
        const logo = id ? cloneLayer(id) : null;
        if (logo && logo.kind === "image") {
            logo.src = document.logoImage;
            logo.hidden = !document.logoImage;
        }
    }

    if (changed.has("image")) {
        const id = layout.slots.image;
        const shot = id ? cloneLayer(id) : null;
        if (shot && shot.kind === "image") {
            shot.src = document.image;
            shot.hidden = !document.image;
        }
    }

    const background = BACKGROUND_KEYS.some((key) => changed.has(key))
        ? fieldsToCanvasBackground(fields)
        : layout.background;

    return { ...document, layout: { ...layout, layers, background } };
};

/**
 * Wraps a detached template as a free document so the shared canvas renderer,
 * the interactive surface, and the exporter all treat it exactly like a card
 * built from scratch.
 */
export const templateLayoutToFreeDocument = (document: TemplateDocument): FreeDocument | null => {
    const layout = document.layout;
    if (!layout) return null;

    return {
        kind: "free",
        id: `${document.id}-layout`,
        name: document.name,
        width: 1200,
        height: 630,
        background: layout.background,
        layers: layout.layers,
    };
};

/** The distinct fonts a detached template draws, for the export embed step. */
export const layoutFontIds = (document: TemplateDocument): TemplateFontId[] => {
    const ids = new Set<TemplateFontId>();
    for (const layer of document.layout?.layers ?? []) {
        if (layer.kind === "text") ids.add(layer.fontId);
    }
    if (ids.size === 0) ids.add(document.fields.fontId);
    return Array.from(ids);
};
