"use client";

import { saveAs } from "file-saver";
import type { TemplateFontId } from "../../components/templates/fontCatalog";
import { slugify } from "./factories";
import type { ExportFormat } from "./types";

interface ExportFontSource {
    path: string;
    weight: string;
}

interface ExportFontDefinition {
    family: string;
    sources: ExportFontSource[];
}

export const EXPORT_FONT_FILES: Record<TemplateFontId, ExportFontDefinition> = {
    "geist-sans": {
        family: "Geist Sans",
        sources: [{ path: "/fonts/geist-sans/geist-sans-variable.woff2", weight: "100 900" }],
    },
    "geist-mono": {
        family: "Geist Mono",
        sources: [{ path: "/fonts/geist-mono/geist-mono-variable.woff2", weight: "100 900" }],
    },
    "geist-pixel-square": {
        family: "Geist Pixel Square",
        sources: [{ path: "/fonts/geist-pixel/geist-pixel-square.woff2", weight: "400" }],
    },
    "geist-pixel-grid": {
        family: "Geist Pixel Grid",
        sources: [{ path: "/fonts/geist-pixel/geist-pixel-grid.woff2", weight: "400" }],
    },
    "geist-pixel-circle": {
        family: "Geist Pixel Circle",
        sources: [{ path: "/fonts/geist-pixel/geist-pixel-circle.woff2", weight: "400" }],
    },
    "geist-pixel-triangle": {
        family: "Geist Pixel Triangle",
        sources: [{ path: "/fonts/geist-pixel/geist-pixel-triangle.woff2", weight: "400" }],
    },
    "geist-pixel-line": {
        family: "Geist Pixel Line",
        sources: [{ path: "/fonts/geist-pixel/geist-pixel-line.woff2", weight: "400" }],
    },
    inter: {
        family: "Inter",
        sources: [
            { path: "/fonts/inter/inter-400.woff2", weight: "400" },
            { path: "/fonts/inter/inter-600.woff2", weight: "600" },
            { path: "/fonts/inter/inter-700.woff2", weight: "700" },
        ],
    },
    poppins: {
        family: "Poppins",
        sources: [
            { path: "/fonts/poppins/poppins-400.woff2", weight: "400" },
            { path: "/fonts/poppins/poppins-600.woff2", weight: "600" },
            { path: "/fonts/poppins/poppins-700.woff2", weight: "700" },
        ],
    },
    "dm-sans": {
        family: "DM Sans",
        sources: [
            { path: "/fonts/dm-sans/dm-sans-400.woff2", weight: "400" },
            { path: "/fonts/dm-sans/dm-sans-600.woff2", weight: "600" },
            { path: "/fonts/dm-sans/dm-sans-700.woff2", weight: "700" },
        ],
    },
    "playfair-display": {
        family: "Playfair Display",
        sources: [
            { path: "/fonts/playfair-display/playfair-display-400.woff2", weight: "400" },
            { path: "/fonts/playfair-display/playfair-display-600.woff2", weight: "600" },
            { path: "/fonts/playfair-display/playfair-display-700.woff2", weight: "700" },
        ],
    },
    "space-grotesk": {
        family: "Space Grotesk",
        sources: [
            { path: "/fonts/space-grotesk/space-grotesk-400.woff2", weight: "400" },
            { path: "/fonts/space-grotesk/space-grotesk-600.woff2", weight: "600" },
            { path: "/fonts/space-grotesk/space-grotesk-700.woff2", weight: "700" },
        ],
    },
    montserrat: {
        family: "Montserrat",
        sources: [
            { path: "/fonts/montserrat/montserrat-400.woff2", weight: "400" },
            { path: "/fonts/montserrat/montserrat-600.woff2", weight: "600" },
            { path: "/fonts/montserrat/montserrat-700.woff2", weight: "700" },
        ],
    },
    lora: {
        family: "Lora",
        sources: [
            { path: "/fonts/lora/lora-400.woff2", weight: "400" },
            { path: "/fonts/lora/lora-600.woff2", weight: "600" },
            { path: "/fonts/lora/lora-700.woff2", weight: "700" },
        ],
    },
    outfit: {
        family: "Outfit",
        sources: [
            { path: "/fonts/outfit/outfit-400.woff2", weight: "400" },
            { path: "/fonts/outfit/outfit-600.woff2", weight: "600" },
            { path: "/fonts/outfit/outfit-700.woff2", weight: "700" },
        ],
    },
    manrope: {
        family: "Manrope",
        sources: [
            { path: "/fonts/manrope/manrope-400.woff2", weight: "400" },
            { path: "/fonts/manrope/manrope-600.woff2", weight: "600" },
            { path: "/fonts/manrope/manrope-700.woff2", weight: "700" },
        ],
    },
    sora: {
        family: "Sora",
        sources: [
            { path: "/fonts/sora/sora-400.woff2", weight: "400" },
            { path: "/fonts/sora/sora-600.woff2", weight: "600" },
            { path: "/fonts/sora/sora-700.woff2", weight: "700" },
        ],
    },
};

export const EXPORT_FONT_WEIGHTS = ["400", "600", "700"] as const;

const inlineFontCssCache = new Map<TemplateFontId, string>();

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = "";

    for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }

    return btoa(binary);
};

/** Pixel faces fall back to Geist Mono for punctuation, so both get embedded. */
const fontIdsToEmbed = (fontId: TemplateFontId): TemplateFontId[] =>
    fontId.startsWith("geist-pixel") ? [fontId, "geist-mono"] : [fontId];

export const waitForFonts = async (fontIds: TemplateFontId[]) => {
    const faces = new Set<string>();

    for (const fontId of fontIds) {
        const definition = EXPORT_FONT_FILES[fontId];
        if (!definition) continue;
        faces.add(definition.family);
    }

    await Promise.all(
        Array.from(faces).flatMap((family) =>
            EXPORT_FONT_WEIGHTS.map((weight) => document.fonts.load(`${weight} 16px "${family}"`)),
        ),
    );

    await document.fonts.ready;
};

const buildFontCss = async (fontIds: TemplateFontId[]) => {
    const rules: string[] = [];

    for (const fontId of fontIds) {
        const cached = inlineFontCssCache.get(fontId);
        if (cached) {
            rules.push(cached);
            continue;
        }

        const definition = EXPORT_FONT_FILES[fontId];
        if (!definition) continue;

        const fontRules: string[] = [];
        for (const source of definition.sources) {
            const url = new URL(source.path, window.location.origin).toString();
            const response = await fetch(url, { cache: "force-cache" });
            if (!response.ok) throw new Error(`Could not load font file: ${source.path}`);

            const base64 = arrayBufferToBase64(await response.arrayBuffer());
            fontRules.push(
                `@font-face{font-family:"${definition.family}";src:url("data:font/woff2;base64,${base64}") format("woff2");font-style:normal;font-weight:${source.weight};font-display:swap;}`,
            );
        }

        const css = fontRules.join("\n");
        inlineFontCssCache.set(fontId, css);
        rules.push(css);
    }

    return rules.join("\n");
};

const waitForImages = async (node: HTMLElement) => {
    const images = Array.from(node.querySelectorAll("img"));

    await Promise.all(
        images.map((image) => {
            if (image.complete) {
                return image.decode().catch(() => undefined);
            }

            return new Promise<void>((resolve) => {
                const done = () => resolve();
                image.addEventListener("load", done, { once: true });
                image.addEventListener("error", done, { once: true });
            });
        }),
    );
};

const inlineImages = async (node: HTMLElement) => {
    const images = Array.from(node.querySelectorAll("img"));

    await Promise.all(
        images.map(async (image) => {
            const src = image.src;
            if (!src || src.startsWith("data:")) return;

            try {
                const response = await fetch(src, { cache: "force-cache" });
                if (!response.ok) return;

                const blob = await response.blob();
                const reader = new FileReader();
                const dataUrl = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });

                image.src = dataUrl;
            } catch {
                // Keep the original src when a remote asset cannot be inlined.
            }
        }),
    );
};

const computedStyleText = (computed: CSSStyleDeclaration) => {
    const parts: string[] = [];
    for (let index = 0; index < computed.length; index += 1) {
        parts.push(`${computed[index]}:${computed.getPropertyValue(computed[index])}`);
    }
    return parts.join(";");
};

/**
 * The export pipeline serialises the canvas into an SVG <foreignObject>. External
 * stylesheets do not travel with the markup, so every computed declaration is
 * written onto the node itself before serialising.
 */
const inlineComputedStyles = (source: HTMLElement, target: HTMLElement) => {
    target.setAttribute("style", computedStyleText(window.getComputedStyle(source)));

    const sourceChildren = source.children;
    const targetChildren = target.children;

    for (let index = 0; index < sourceChildren.length; index += 1) {
        const sourceChild = sourceChildren[index];
        const targetChild = targetChildren[index];
        if (sourceChild instanceof HTMLElement && targetChild instanceof HTMLElement) {
            inlineComputedStyles(sourceChild, targetChild);
        }
    }
};

const inlinePseudoElements = (source: HTMLElement, target: HTMLElement) => {
    for (const pseudo of ["::before", "::after"] as const) {
        const computed = window.getComputedStyle(source, pseudo);
        const content = computed.getPropertyValue("content");
        if (!content || content === "none" || content === "normal") continue;

        const span = document.createElement("span");
        span.setAttribute("data-pseudo", pseudo);
        span.setAttribute("style", computedStyleText(computed));
        span.textContent = content.replace(/^["']|["']$/g, "");

        if (pseudo === "::before") {
            target.insertBefore(span, target.firstChild);
        } else {
            target.appendChild(span);
        }
    }

    const sourceChildren = source.children;
    const targetChildren = target.children;

    for (let index = 0; index < sourceChildren.length; index += 1) {
        const sourceChild = sourceChildren[index];
        const targetChild = targetChildren[index];
        if (sourceChild instanceof HTMLElement && targetChild instanceof HTMLElement) {
            inlinePseudoElements(sourceChild, targetChild);
        }
    }
};

const svgToCanvas = (svgDataUrl: string, width: number, height: number, scale: number) =>
    new Promise<HTMLCanvasElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width * scale;
            canvas.height = height * scale;
            const context = canvas.getContext("2d");
            if (!context) {
                reject(new Error("Canvas 2d context unavailable"));
                return;
            }
            context.scale(scale, scale);
            context.drawImage(image, 0, 0, width, height);
            resolve(canvas);
        };
        image.onerror = () => reject(new Error("Could not rasterise the design"));
        image.src = svgDataUrl;
    });

const canvasToBlob = (canvas: HTMLCanvasElement, format: ExportFormat, quality: number) =>
    new Promise<Blob>((resolve, reject) => {
        const mimeType = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("The browser could not encode this format"));
            },
            mimeType,
            format === "png" ? undefined : quality,
        );
    });

export interface ExportDesignOptions {
    sourceNode: HTMLElement;
    width: number;
    height: number;
    scale: number;
    format: ExportFormat;
    quality: number;
    fontIds: TemplateFontId[];
    name: string;
}

export const exportDesignImage = async ({
    sourceNode,
    width,
    height,
    scale,
    format,
    quality,
    fontIds,
    name,
}: ExportDesignOptions) => {
    const host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = [
        "position: fixed",
        "left: 0",
        "top: 0",
        `width: ${width}px`,
        `height: ${height}px`,
        "overflow: hidden",
        "pointer-events: none",
        "z-index: -2147483647",
        "contain: strict",
    ].join(";");

    const exportNode = sourceNode.cloneNode(true) as HTMLElement;
    exportNode.removeAttribute("id");
    exportNode.style.width = `${width}px`;
    exportNode.style.height = `${height}px`;
    exportNode.style.transform = "none";
    exportNode.style.margin = "0";
    exportNode.style.overflow = "hidden";
    exportNode.style.position = "relative";
    exportNode.style.background = window.getComputedStyle(sourceNode).background || exportNode.style.background;

    host.appendChild(exportNode);
    document.body.appendChild(host);

    try {
        await waitForFonts(Array.from(new Set(fontIds)));
        await waitForImages(exportNode);
        await inlineImages(exportNode);

        inlineComputedStyles(sourceNode, exportNode);
        inlinePseudoElements(sourceNode, exportNode);

        const fontCss = await buildFontCss(Array.from(new Set(fontIds.flatMap(fontIdsToEmbed))));

        exportNode.removeAttribute("class");
        Array.from(exportNode.querySelectorAll("*")).forEach((element) => element.removeAttribute("class"));

        const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <style type="text/css">
${fontCss}
    </style>
  </defs>
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;overflow:hidden;">
      ${new XMLSerializer().serializeToString(exportNode)}
    </div>
  </foreignObject>
</svg>`;

        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
        const canvas = await svgToCanvas(svgDataUrl, width, height, scale);

        let output = canvas;

        if (format === "jpeg") {
            // JPEG has no alpha channel, so flatten onto white first.
            const flattened = document.createElement("canvas");
            flattened.width = canvas.width;
            flattened.height = canvas.height;
            const context = flattened.getContext("2d");
            if (!context) throw new Error("Canvas 2d context unavailable");
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, flattened.width, flattened.height);
            context.drawImage(canvas, 0, 0);
            output = flattened;
        }

        const blob = await canvasToBlob(output, format, quality);
        saveAs(blob, `${slugify(name)}-${width}x${height}.${format === "jpeg" ? "jpg" : format}`);
    } finally {
        host.remove();
    }
};