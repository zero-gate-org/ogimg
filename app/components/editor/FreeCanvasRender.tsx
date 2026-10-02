"use client";

import { getTemplateFontFamily } from "../templates/fontCatalog";
import {
    getBackgroundFill,
    getBackgroundPresetById,
    getGridOverlayStyle,
    hexToRgba,
} from "../templates/templateShared";
import type { CanvasBackground, FreeDocument, ImageLayer, Layer, ShapeLayer, TextLayer } from "../../lib/editor/types";

export const NOISE_TEXTURE_URL =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.85'/%3E%3C/svg%3E\")";

export const getCanvasBackgroundStyle = (background: CanvasBackground): React.CSSProperties => ({
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    background:
        background.mode === "solid"
            ? background.color
            : background.mode === "preset"
              ? getBackgroundPresetById(background.presetId).background
              : background.mode === "image"
                ? // The solid colour doubles as the fill behind a contained
                  // image and as the scrim colour on top of it.
                  background.color
                : getBackgroundFill("Gradient", background.gradientStart, background.gradientEnd, background.gradientAngle),
    color: "#FAFAFA",
});

export function CanvasBackgroundEffects({ background }: { background: CanvasBackground }) {
    const overlayStyle = getGridOverlayStyle(
        background.overlay,
        background.overlayColor,
        background.overlayOpacity,
    );

    return (
        <>
            {/*
              The canvas image is a real <img>, not a CSS background, so the
              export pipeline already waits for it and inlines it as base64.
            */}
            {background.mode === "image" && background.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={background.imageSrc}
                    alt=""
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: background.imageFit,
                        objectPosition: "center",
                        opacity: background.imageOpacity,
                        display: "block",
                        pointerEvents: "none",
                    }}
                />
            ) : null}

            {background.mode === "image" && background.imageSrc && background.imageScrim > 0 ? (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: background.color,
                        opacity: background.imageScrim,
                        pointerEvents: "none",
                    }}
                />
            ) : null}

            {background.overlay !== "none" ? (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        ...overlayStyle,
                        filter: background.overlayBlur > 0 ? `blur(${background.overlayBlur}px)` : undefined,
                        transform: background.overlayBlur > 0 ? "scale(1.01)" : undefined,
                        transformOrigin: "center center",
                        mixBlendMode: "screen",
                        pointerEvents: "none",
                    }}
                />
            ) : null}

            {background.noise ? (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.12,
                        mixBlendMode: "soft-light",
                        backgroundImage: NOISE_TEXTURE_URL,
                        backgroundSize: "180px 180px",
                        pointerEvents: "none",
                    }}
                />
            ) : null}
        </>
    );
}

function TextLayerView({ layer }: { layer: TextLayer }) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent:
                    layer.verticalAlign === "middle"
                        ? "center"
                        : layer.verticalAlign === "bottom"
                          ? "flex-end"
                          : "flex-start",
                textAlign: layer.align,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
            }}
        >
            {layer.text.split("\n").map((line, index) => (
                <div
                    key={`${layer.id}-line-${index}`}
                    style={{
                        fontFamily: getTemplateFontFamily(layer.fontId),
                        fontSize: layer.fontSize,
                        fontWeight: layer.fontWeight,
                        fontStyle: layer.italic ? "italic" : "normal",
                        lineHeight: layer.lineHeight,
                        letterSpacing: `${layer.letterSpacing}em`,
                        color: layer.color,
                        textTransform: layer.uppercase ? "uppercase" : "none",
                        textShadow: layer.shadow ? "0 2px 10px rgba(0,0,0,0.45)" : undefined,
                    }}
                >
                    {line.length > 0 ? line : " "}
                </div>
            ))}
        </div>
    );
}

function ShapeLayerView({ layer }: { layer: ShapeLayer }) {
    if (layer.shape === "line") {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: Math.max(1, layer.strokeWidth),
                        background: layer.strokeEnabled ? layer.stroke : layer.fill,
                    }}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: layer.fillEnabled ? layer.fill : "transparent",
                borderRadius: layer.shape === "ellipse" ? "50%" : layer.radius,
                border:
                    layer.strokeEnabled && layer.shape === "rect"
                        ? `${layer.strokeWidth}px solid ${layer.stroke}`
                        : undefined,
            }}
        />
    );
}

function ImageLayerView({ layer }: { layer: ImageLayer }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={layer.src}
            alt={layer.alt}
            style={{
                width: "100%",
                height: "100%",
                objectFit: layer.fit,
                borderRadius: layer.radius,
                display: "block",
            }}
        />
    );
}

export function FreeCanvasLayers({ document }: { document: FreeDocument }) {
    return (
        <>
            {document.layers.map((layer) => {
                if (layer.hidden) return null;

                return (
                    <div
                        key={layer.id}
                        style={{
                            position: "absolute",
                            left: layer.x,
                            top: layer.y,
                            width: layer.width,
                            height: layer.height,
                            transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
                            opacity: layer.opacity,
                        }}
                    >
                        {layer.kind === "text" ? (
                            <TextLayerView layer={layer} />
                        ) : layer.kind === "shape" ? (
                            <ShapeLayerView layer={layer} />
                        ) : (
                            <ImageLayerView layer={layer} />
                        )}
                    </div>
                );
            })}
        </>
    );
}

/**
 * Renders a free document at its exact export size. Used by saved project
 * thumbnails and by the shared social preview, so every surface shows the same
 * pixels the exporter writes.
 */
export default function FreeCanvasRender({ document }: { document: FreeDocument }) {
    return (
        <div
            style={{
                ...getCanvasBackgroundStyle(document.background),
                width: document.width,
                height: document.height,
                fontFamily: getTemplateFontFamily("geist-sans"),
            }}
        >
            <CanvasBackgroundEffects background={document.background} />
            <FreeCanvasLayers document={document} />
        </div>
    );
}

export const layerLabel = (layer: Layer) => {
    if (layer.kind === "text") {
        const text = layer.text.trim().replace(/\s+/g, " ");
        return text.length > 0 ? text.slice(0, 28) : "Empty text";
    }
    return layer.name;
};

export const layerSubLabel = (layer: Layer) => {
    if (layer.kind === "text") return `${layer.fontSize}px`;
    if (layer.kind === "image") return "Image";
    return layer.shape === "line" ? "Line" : "Shape";
};

/** WCAG contrast ratio for a foreground hex on an assumed background hex. */
export const contrastHint = (foreground: string, background: string) => {
    const toLuminance = (hex: string) => {
        const clean = hex.replace("#", "");
        if (clean.length !== 6) return null;
        const channels = [0, 2, 4].map((index) => {
            const channel = parseInt(clean.slice(index, index + 2), 16) / 255;
            return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };

    const a = toLuminance(foreground);
    const b = toLuminance(background);
    if (a === null || b === null) return null;

    return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
};

export { hexToRgba };