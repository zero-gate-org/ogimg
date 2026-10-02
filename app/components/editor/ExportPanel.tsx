"use client";

import { CheckCircle, DownloadSimple, WarningCircle } from "@phosphor-icons/react";
import { SIZE_PRESETS, clampDimension, matchSizePreset } from "../../lib/editor/platforms";
import type { ExportFormat } from "../../lib/editor/types";
import { Field, NumberInput, PanelSection, PrimaryButton, SegmentedControl, SliderField } from "./fields";

const FORMAT_NOTES: Record<ExportFormat, string> = {
    png: "Lossless. Best for sharp type, logos, and gradients.",
    jpeg: "Smaller files for photo heavy cards. Flattens onto white.",
    webp: "Smallest size with good quality, if the platform supports it.",
};

const SCALE_LABELS: Record<string, string> = {
    "1": "1x",
    "2": "2x",
    "3": "3x",
};

export default function ExportPanel({
    width,
    height,
    onResize,
    format,
    onFormatChange,
    scale,
    onScaleChange,
    onExport,
    isExporting,
    error,
    onDismissError,
    showSizes = true,
}: {
    width: number;
    height: number;
    onResize: (width: number, height: number) => void;
    format: ExportFormat;
    onFormatChange: (format: ExportFormat) => void;
    scale: number;
    onScaleChange: (scale: number) => void;
    onExport: () => void;
    isExporting: boolean;
    error: string | null;
    onDismissError: () => void;
    showSizes?: boolean;
}) {
    const matched = matchSizePreset(width, height);
    const outputWidth = width * scale;
    const outputHeight = height * scale;

    return (
        <div>
            {showSizes ? (
            <PanelSection title="Canvas size" sectionKey="export-size">
                <div className="grid grid-cols-2 gap-2">
                    <Field label="Width" htmlFor="export-width">
                        <NumberInput
                            id="export-width"
                            value={width}
                            min={64}
                            max={3000}
                            onChange={(next) => onResize(clampDimension(next), height)}
                            suffix="px"
                        />
                    </Field>
                    <Field label="Height" htmlFor="export-height">
                        <NumberInput
                            id="export-height"
                            value={height}
                            min={64}
                            max={3000}
                            onChange={(next) => onResize(width, clampDimension(next))}
                            suffix="px"
                        />
                    </Field>
                </div>

                <p className="mb-2 text-[12px] font-medium text-foreground/85">Platform presets</p>
                <div className="space-y-1">
                    {SIZE_PRESETS.map((preset) => {
                        const active = matched?.id === preset.id;
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => onResize(preset.width, preset.height)}
                                className={`flex w-full items-baseline justify-between gap-3 border px-2.5 py-2 text-left transition-colors ${
                                    active
                                        ? "border-brand bg-brand/10"
                                        : "border-border hover:border-border-strong"
                                }`}
                            >
                                <span className="text-[12px] font-medium text-foreground">{preset.label}</span>
                                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                                    {preset.width}x{preset.height}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    {matched ? matched.hint : "Custom size. Platforms crop anything outside their own ratio."}
                </p>
            </PanelSection>
            ) : null}

            <PanelSection title="Output" sectionKey="export-output">
                <Field label="Format">
                    <SegmentedControl
                        ariaLabel="Export format"
                        value={format}
                        options={[
                            { value: "png", label: "PNG" },
                            { value: "jpeg", label: "JPEG" },
                            { value: "webp", label: "WebP" },
                        ]}
                        onChange={onFormatChange}
                    />
                </Field>
                <p className="-mt-2 mb-4 text-[11px] leading-relaxed text-muted-foreground">
                    {FORMAT_NOTES[format]}
                </p>

                <SliderField
                    id="export-scale"
                    label="Resolution"
                    value={scale}
                    min={1}
                    max={3}
                    step={1}
                    onChange={onScaleChange}
                    display={SCALE_LABELS[String(scale)] ?? `${scale}x`}
                />

                <div className="mb-4 border border-border bg-surface-sunken px-3 py-2">
                    <p className="font-mono text-[11px] text-muted-foreground">
                        {outputWidth} x {outputHeight} px
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {format.toUpperCase()} {outputWidth * outputHeight >= 4_000_000 ? "large file" : "web ready"}
                    </p>
                </div>

                <PrimaryButton onClick={onExport} disabled={isExporting} className="w-full">
                    <DownloadSimple size={15} weight="bold" />
                    {isExporting ? "Rendering" : "Download image"}
                </PrimaryButton>

                {error ? (
                    <div className="mt-3 flex items-start gap-2 border border-destructive/60 bg-destructive/10 px-3 py-2">
                        <WarningCircle size={15} className="mt-0.5 shrink-0 text-destructive" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[12px] leading-relaxed text-destructive">{error}</p>
                            <button
                                type="button"
                                onClick={onDismissError}
                                className="mt-1.5 text-[11px] font-medium text-destructive underline underline-offset-2"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                ) : null}

                <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    <CheckCircle size={13} className="mt-0.5 shrink-0" />
                    Rendering happens in this tab. Nothing is uploaded.
                </p>
            </PanelSection>
        </div>
    );
}