"use client";

import { ArrowClockwise, ImageSquare, Trash } from "@phosphor-icons/react";
import {
    BACKGROUND_PRESETS,
    type GridOverlay,
} from "../templates/templateShared";
import type { CanvasBackground } from "../../lib/editor/types";
import { ColorInput, Field, PanelSection, SegmentedControl, SliderField, Toggle } from "./fields";

const GRID_OPTIONS: { value: GridOverlay; label: string }[] = [
    { value: "none", label: "None" },
    { value: "grid", label: "Grid" },
    { value: "graph", label: "Graph" },
    { value: "dots", label: "Dots" },
];

const GRADIENT_DIRECTIONS = [
    { label: "Up", angle: 0 },
    { label: "Up right", angle: 45 },
    { label: "Right", angle: 90 },
    { label: "Down right", angle: 135 },
    { label: "Down", angle: 180 },
    { label: "Down left", angle: 225 },
    { label: "Left", angle: 270 },
    { label: "Up left", angle: 315 },
] as const;

export default function BackgroundPanel({
    background,
    onChange,
    onUploadImage,
    isUploading = false,
}: {
    background: CanvasBackground;
    onChange: (patch: Partial<CanvasBackground>) => void;
    onUploadImage?: (file: File) => void;
    isUploading?: boolean;
}) {
    return (
        <div>
            <PanelSection title="Background" sectionKey="bg-fill">
                <Field label="Fill type">
                    <SegmentedControl
                        ariaLabel="Background fill type"
                        value={background.mode}
                        options={[
                            { value: "solid", label: "Solid" },
                            { value: "gradient", label: "Gradient" },
                            { value: "preset", label: "Preset" },
                            { value: "image", label: "Image" },
                        ]}
                        onChange={(mode) => onChange({ mode })}
                    />
                </Field>

                {background.mode === "solid" ? (
                    <Field label="Colour" htmlFor="bg-color">
                        <ColorInput
                            id="bg-color"
                            value={background.color}
                            onChange={(color) => onChange({ color })}
                        />
                    </Field>
                ) : null}

                {background.mode === "gradient" ? (
                    <>
                        <Field label="Start" htmlFor="bg-start">
                            <ColorInput
                                id="bg-start"
                                value={background.gradientStart}
                                onChange={(gradientStart) => onChange({ gradientStart })}
                            />
                        </Field>
                        <Field label="End" htmlFor="bg-end">
                            <ColorInput
                                id="bg-end"
                                value={background.gradientEnd}
                                onChange={(gradientEnd) => onChange({ gradientEnd })}
                            />
                        </Field>
                        <SliderField
                            id="bg-angle"
                            label="Angle"
                            value={background.gradientAngle}
                            min={0}
                            max={360}
                            onChange={(gradientAngle) => onChange({ gradientAngle })}
                            display={`${background.gradientAngle}°`}
                        />
                    </>
                ) : null}

                {background.mode === "image" ? (
                    <div>
                        {background.imageSrc ? (
                            <>
                                <div className="relative overflow-hidden border border-border">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={background.imageSrc}
                                        alt=""
                                        className="block h-28 w-full"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onChange({ imageSrc: "", imageName: "", imageScrim: 0 })
                                        }
                                        className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 border border-border bg-surface px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-border-strong"
                                    >
                                        <Trash size={12} />
                                        Remove
                                    </button>
                                </div>
                                <p className="mt-1.5 truncate text-[11px] text-muted-foreground">
                                    {background.imageName}
                                </p>

                                <label
                                    className={`mt-3 inline-flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 border border-border bg-surface text-[12px] font-medium text-foreground transition-colors hover:border-border-strong ${
                                        isUploading ? "pointer-events-none opacity-50" : ""
                                    }`}
                                >
                                    <ArrowClockwise size={13} />
                                    {isUploading ? "Reading" : "Replace image"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        disabled={isUploading}
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            if (file) onUploadImage?.(file);
                                            event.target.value = "";
                                        }}
                                    />
                                </label>

                                <div className="mt-4 space-y-3.5">
                                    <Field label="Fit">
                                        <SegmentedControl
                                            ariaLabel="Canvas image fit"
                                            value={background.imageFit}
                                            options={[
                                                { value: "cover", label: "Cover" },
                                                { value: "contain", label: "Contain" },
                                                { value: "fill", label: "Stretch" },
                                            ]}
                                            onChange={(imageFit) => onChange({ imageFit })}
                                        />
                                    </Field>
                                    <SliderField
                                        id="bg-image-opacity"
                                        label="Opacity"
                                        value={Math.round(background.imageOpacity * 100)}
                                        min={0}
                                        max={100}
                                        onChange={(value) => onChange({ imageOpacity: value / 100 })}
                                        display={`${Math.round(background.imageOpacity * 100)}%`}
                                    />
                                    <SliderField
                                        id="bg-image-scrim"
                                        label="Scrim"
                                        value={Math.round(background.imageScrim * 100)}
                                        min={0}
                                        max={90}
                                        onChange={(value) => onChange({ imageScrim: value / 100 })}
                                        display={`${Math.round(background.imageScrim * 100)}%`}
                                    />
                                    <Field label="Scrim colour" htmlFor="bg-image-scrim-color">
                                        <ColorInput
                                            id="bg-image-scrim-color"
                                            value={background.color}
                                            onChange={(color) => onChange({ color })}
                                        />
                                    </Field>
                                </div>

                                <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                                    The scrim sits over the photo using the colour above, so it doubles as
                                    the fill behind a contained image.
                                </p>
                            </>
                        ) : (
                            <label
                                className={`flex cursor-pointer flex-col items-center gap-2 border border-dashed border-border px-4 py-8 text-center transition-colors hover:border-border-strong ${
                                    isUploading ? "pointer-events-none opacity-50" : ""
                                }`}
                            >
                                <ImageSquare size={20} className="text-muted-foreground" />
                                <span className="text-[12px] font-medium text-foreground">
                                    {isUploading ? "Reading" : "Upload a canvas image"}
                                </span>
                                <span className="max-w-[30ch] text-[11px] leading-relaxed text-muted-foreground">
                                    Use a photo or texture as the card background. Text layers sit on top
                                    of it.
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    disabled={isUploading}
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) onUploadImage?.(file);
                                        event.target.value = "";
                                    }}
                                />
                            </label>
                        )}
                    </div>
                ) : null}

                {background.mode === "preset" ? (
                    <div>
                        <p className="mb-2 text-[12px] font-medium text-foreground/85">Preset</p>
                        <div className="grid grid-cols-2 gap-2">
                            {BACKGROUND_PRESETS.map((preset) => {
                                const active = background.presetId === preset.id;
                                return (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => onChange({ presetId: preset.id })}
                                        aria-pressed={active}
                                        className={`border p-1.5 text-left transition-colors ${
                                            active ? "border-brand" : "border-border hover:border-border-strong"
                                        }`}
                                    >
                                        <span
                                            className="block h-12 w-full border border-white/10"
                                            style={{ background: preset.background }}
                                        />
                                        <span className="mt-1.5 block truncate text-[11px] text-muted-foreground">
                                            {preset.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </PanelSection>

            <PanelSection title="Pattern overlay" sectionKey="bg-overlay">
                <Field label="Pattern">
                    <SegmentedControl
                        ariaLabel="Grid overlay pattern"
                        value={background.overlay}
                        options={GRID_OPTIONS}
                        onChange={(overlay) => onChange({ overlay })}
                    />
                </Field>

                {background.overlay !== "none" ? (
                    <>
                        <Field label="Colour" htmlFor="overlay-color">
                            <ColorInput
                                id="overlay-color"
                                value={background.overlayColor}
                                onChange={(overlayColor) => onChange({ overlayColor })}
                            />
                        </Field>
                        <SliderField
                            id="overlay-opacity"
                            label="Opacity"
                            value={Math.round(background.overlayOpacity * 100)}
                            min={0}
                            max={100}
                            onChange={(value) => onChange({ overlayOpacity: value / 100 })}
                            display={`${Math.round(background.overlayOpacity * 100)}%`}
                        />
                        <SliderField
                            id="overlay-blur"
                            label="Softness"
                            value={background.overlayBlur}
                            min={0}
                            max={4}
                            step={0.1}
                            onChange={(overlayBlur) => onChange({ overlayBlur })}
                            display={`${background.overlayBlur.toFixed(1)}px`}
                        />
                    </>
                ) : null}
            </PanelSection>

            <PanelSection title="Texture" sectionKey="bg-texture">
                <Toggle
                    id="bg-noise"
                    checked={background.noise}
                    onChange={(noise) => onChange({ noise })}
                    label="Film grain"
                />
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    Keeps flat gradients from banding on large exports.
                </p>
                <div className="mt-4 grid grid-cols-4 gap-1.5">
                    {GRADIENT_DIRECTIONS.map((direction) => (
                        <button
                            key={direction.angle}
                            type="button"
                            onClick={() => onChange({ gradientAngle: direction.angle })}
                            aria-label={`Gradient angle ${direction.label}`}
                            title={direction.label}
                            className={`flex h-8 items-center justify-center border text-[10px] font-mono transition-colors ${
                                background.gradientAngle === direction.angle
                                    ? "border-brand bg-brand text-brand-ink"
                                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
                            }`}
                        >
                            {direction.angle}
                        </button>
                    ))}
                </div>
            </PanelSection>
        </div>
    );
}