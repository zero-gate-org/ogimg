"use client";

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
}: {
    background: CanvasBackground;
    onChange: (patch: Partial<CanvasBackground>) => void;
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