"use client";

import type { ChangeEvent } from "react";
import {
    AlignCenterHorizontal,
    AlignCenterVertical,
    AlignLeft,
    AlignRight,
    AlignTop,
    ArrowsOutCardinal,
    Trash,
} from "@phosphor-icons/react";
import type { TemplateFontId } from "../templates/fontCatalog";
import type { ImageLayer, Layer, ShapeLayer, TextLayer } from "../../lib/editor/types";
import {
    ColorInput,
    Field,
    FontSelect,
    IconButton,
    NumberInput,
    PanelSection,
    SegmentedControl,
    SelectInput,
    SliderField,
    TextInput,
    Toggle,
} from "./fields";
import { contrastHint } from "./FreeCanvasRender";

const TEXT_SWATCHES = ["#FAFAFA", "#E5E7EB", "#94A3B8", "#111827", "#C9F24D", "#F97316", "#38BDF8", "#F43F5E"] as const;
const SHAPE_SWATCHES = ["#FAFAFA", "#C9F24D", "#38BDF8", "#F97316", "#F43F5E", "#A78BFA", "#111827", "#0B0B0D"] as const;

const WEIGHTS = [
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semibold" },
    { value: "700", label: "Bold" },
] as const;

const ALIGN_ICONS = {
    left: AlignLeft,
    center: AlignCenterHorizontal,
    right: AlignRight,
} as const;

export default function LayerPropertiesPanel({
    layer,
    documentSize,
    onChange,
    onDelete,
    onUploadReplacement,
}: {
    layer: Layer | null;
    documentSize: { width: number; height: number };
    onChange: (patch: Partial<Layer>) => void;
    onDelete: () => void;
    onUploadReplacement: (file: File) => void;
}) {
    if (!layer) {
        return (
            <PanelSection title="Layer" sectionKey="layer-empty">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                    Select a layer on the canvas or in the layer list to edit its position, typography, and
                    appearance.
                </p>
            </PanelSection>
        );
    }

    const contrast = layer.kind === "text" ? contrastHint(layer.color, "#0B0B0D") : null;

    return (
        <div>
            <PanelSection
                title="Position"
                sectionKey="layer-position"
                action={
                    <IconButton onClick={onDelete} label="Delete layer" className="hover:text-destructive">
                        <Trash size={14} />
                    </IconButton>
                }
            >
                <div className="grid grid-cols-2 gap-2">
                    <Field label="X" htmlFor="layer-x">
                        <NumberInput id="layer-x" value={layer.x} onChange={(x) => onChange({ x })} suffix="px" />
                    </Field>
                    <Field label="Y" htmlFor="layer-y">
                        <NumberInput id="layer-y" value={layer.y} onChange={(y) => onChange({ y })} suffix="px" />
                    </Field>
                    <Field label="Width" htmlFor="layer-w">
                        <NumberInput
                            id="layer-w"
                            value={Math.round(layer.width)}
                            min={8}
                            onChange={(width) => onChange({ width })}
                            suffix="px"
                        />
                    </Field>
                    <Field label="Height" htmlFor="layer-h">
                        <NumberInput
                            id="layer-h"
                            value={Math.round(layer.height)}
                            min={8}
                            onChange={(height) => onChange({ height })}
                            suffix="px"
                        />
                    </Field>
                </div>

                <Field label="Rotation" htmlFor="layer-rot">
                    <NumberInput
                        id="layer-rot"
                        value={layer.rotation}
                        onChange={(rotation) => onChange({ rotation })}
                        suffix="deg"
                    />
                </Field>

                <SliderField
                    id="layer-opacity"
                    label="Opacity"
                    value={Math.round(layer.opacity * 100)}
                    min={0}
                    max={100}
                    onChange={(value) => onChange({ opacity: value / 100 })}
                    display={`${Math.round(layer.opacity * 100)}%`}
                />

                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    <ArrowsOutCardinal size={12} />
                    Align to canvas
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    <IconButton onClick={() => onChange({ x: 0 })} label="Align to left edge">
                        <AlignLeft size={14} />
                    </IconButton>
                    <IconButton
                        onClick={() => onChange({ x: Math.round((documentSize.width - layer.width) / 2) })}
                        label="Centre horizontally"
                    >
                        <AlignCenterHorizontal size={14} />
                    </IconButton>
                    <IconButton
                        onClick={() => onChange({ x: documentSize.width - layer.width })}
                        label="Align to right edge"
                    >
                        <AlignRight size={14} />
                    </IconButton>
                    <IconButton onClick={() => onChange({ y: 0 })} label="Align to top edge">
                        <AlignTop size={14} />
                    </IconButton>
                    <IconButton
                        onClick={() => onChange({ y: Math.round((documentSize.height - layer.height) / 2) })}
                        label="Centre vertically"
                    >
                        <AlignCenterVertical size={14} />
                    </IconButton>
                </div>
            </PanelSection>

            {layer.kind === "text" ? <TextProperties layer={layer} onChange={onChange} contrast={contrast} /> : null}
            {layer.kind === "shape" ? <ShapeProperties layer={layer} onChange={onChange} /> : null}
            {layer.kind === "image" ? (
                <ImageProperties layer={layer} onChange={onChange} onUploadReplacement={onUploadReplacement} />
            ) : null}
        </div>
    );
}

function TextProperties({
    layer,
    onChange,
    contrast,
}: {
    layer: TextLayer;
    onChange: (patch: Partial<Layer>) => void;
    contrast: number | null;
}) {
    return (
        <>
            <PanelSection title="Text" sectionKey="layer-text">
                <Field label="Content" htmlFor="layer-text">
                    <TextInput
                        id="layer-text"
                        value={layer.text}
                        onChange={(text) => onChange({ text } as Partial<Layer>)}
                        multiline
                        rows={4}
                        placeholder="Write the copy that ships"
                    />
                </Field>

                <Field label="Font" htmlFor="layer-font">
                    <FontSelect
                        id="layer-font"
                        value={layer.fontId}
                        onChange={(fontId: TemplateFontId) => onChange({ fontId } as Partial<Layer>)}
                    />
                </Field>

                <div className="grid grid-cols-2 gap-2">
                    <Field label="Size" htmlFor="layer-font-size">
                        <NumberInput
                            id="layer-font-size"
                            value={layer.fontSize}
                            min={8}
                            max={400}
                            onChange={(fontSize) => onChange({ fontSize } as Partial<Layer>)}
                            suffix="px"
                        />
                    </Field>
                    <Field label="Weight" htmlFor="layer-weight">
                        <SelectInput
                            id="layer-weight"
                            value={String(layer.fontWeight)}
                            options={WEIGHTS}
                            onChange={(value) => onChange({ fontWeight: Number(value) } as Partial<Layer>)}
                        />
                    </Field>
                    <Field label="Line height" htmlFor="layer-lh">
                        <NumberInput
                            id="layer-lh"
                            value={layer.lineHeight}
                            step={0.01}
                            onChange={(lineHeight) => onChange({ lineHeight } as Partial<Layer>)}
                        />
                    </Field>
                    <Field label="Tracking" htmlFor="layer-ls">
                        <NumberInput
                            id="layer-ls"
                            value={layer.letterSpacing}
                            step={0.005}
                            onChange={(letterSpacing) => onChange({ letterSpacing } as Partial<Layer>)}
                            suffix="em"
                        />
                    </Field>
                </div>

                <Field label="Horizontal align">
                    <SegmentedControl
                        ariaLabel="Text alignment"
                        value={layer.align}
                        options={[
                            { value: "left", label: "", title: "Align left" },
                            { value: "center", label: "", title: "Align centre" },
                            { value: "right", label: "", title: "Align right" },
                        ]}
                        onChange={(align) => onChange({ align } as Partial<Layer>)}
                        renderOption={(option) => {
                            const Icon = ALIGN_ICONS[option.value as keyof typeof ALIGN_ICONS];
                            return <Icon size={14} />;
                        }}
                    />
                </Field>

                <Field label="Vertical align">
                    <SegmentedControl
                        ariaLabel="Vertical alignment"
                        value={layer.verticalAlign}
                        options={[
                            { value: "top", label: "Top" },
                            { value: "middle", label: "Middle" },
                            { value: "bottom", label: "Bottom" },
                        ]}
                        onChange={(verticalAlign) => onChange({ verticalAlign } as Partial<Layer>)}
                    />
                </Field>

                <div className="space-y-2">
                    <Toggle
                        id="layer-uppercase"
                        checked={layer.uppercase}
                        onChange={(uppercase) => onChange({ uppercase } as Partial<Layer>)}
                        label="Uppercase"
                    />
                    <Toggle
                        id="layer-italic"
                        checked={layer.italic}
                        onChange={(italic) => onChange({ italic } as Partial<Layer>)}
                        label="Italic"
                    />
                    <Toggle
                        id="layer-shadow"
                        checked={layer.shadow}
                        onChange={(shadow) => onChange({ shadow } as Partial<Layer>)}
                        label="Text shadow"
                    />
                </div>
            </PanelSection>

            <PanelSection title="Colour" sectionKey="layer-colour">
                <Field
                    label="Text colour"
                    htmlFor="layer-color"
                    hint={
                        contrast === null
                            ? undefined
                            : contrast >= 4.5
                              ? `Contrast ${contrast}:1 passes AA against a dark card.`
                              : `Contrast ${contrast}:1 is under AA against a dark card.`
                    }
                >
                    <ColorInput
                        id="layer-color"
                        value={layer.color}
                        onChange={(color) => onChange({ color } as Partial<Layer>)}
                        swatches={TEXT_SWATCHES}
                    />
                </Field>
            </PanelSection>
        </>
    );
}

function ShapeProperties({ layer, onChange }: { layer: ShapeLayer; onChange: (patch: Partial<Layer>) => void }) {
    return (
        <PanelSection title="Shape" sectionKey="layer-shape">
            <Field label="Form">
                <SegmentedControl
                    ariaLabel="Shape form"
                    value={layer.shape}
                    options={[
                        { value: "rect", label: "Rect" },
                        { value: "ellipse", label: "Circle" },
                        { value: "line", label: "Line" },
                    ]}
                    onChange={(shape) => onChange({ shape } as Partial<Layer>)}
                />
            </Field>

            {layer.shape !== "line" ? (
                <Toggle
                    id="shape-fill"
                    checked={layer.fillEnabled}
                    onChange={(fillEnabled) => onChange({ fillEnabled } as Partial<Layer>)}
                    label="Fill"
                />
            ) : null}

            {layer.fillEnabled || layer.shape === "line" ? (
                <div className="mt-3">
                    <Field
                        label={layer.shape === "line" ? "Line colour" : "Fill colour"}
                        htmlFor="shape-fill-color"
                    >
                        <ColorInput
                            id="shape-fill-color"
                            value={layer.fill}
                            onChange={(fill) => onChange({ fill } as Partial<Layer>)}
                            swatches={SHAPE_SWATCHES}
                        />
                    </Field>
                </div>
            ) : null}

            {layer.shape === "rect" ? (
                <Toggle
                    id="shape-stroke"
                    checked={layer.strokeEnabled}
                    onChange={(strokeEnabled) => onChange({ strokeEnabled } as Partial<Layer>)}
                    label="Border"
                />
            ) : null}

            {layer.strokeEnabled && layer.shape === "rect" ? (
                <div className="mt-3 space-y-3">
                    <Field label="Border colour" htmlFor="shape-stroke-color">
                        <ColorInput
                            id="shape-stroke-color"
                            value={layer.stroke}
                            onChange={(stroke) => onChange({ stroke } as Partial<Layer>)}
                        />
                    </Field>
                    <Field label="Border width" htmlFor="shape-stroke-width">
                        <NumberInput
                            id="shape-stroke-width"
                            value={layer.strokeWidth}
                            min={1}
                            max={80}
                            onChange={(strokeWidth) => onChange({ strokeWidth } as Partial<Layer>)}
                            suffix="px"
                        />
                    </Field>
                </div>
            ) : null}

            {layer.shape === "line" ? (
                <div className="mt-3">
                    <Field label="Thickness" htmlFor="shape-line-width">
                        <NumberInput
                            id="shape-line-width"
                            value={layer.strokeWidth}
                            min={1}
                            max={80}
                            onChange={(strokeWidth) => onChange({ strokeWidth } as Partial<Layer>)}
                            suffix="px"
                        />
                    </Field>
                </div>
            ) : null}

            {layer.shape === "rect" ? (
                <div className="mt-3">
                    <Field label="Corner radius" htmlFor="shape-radius">
                        <NumberInput
                            id="shape-radius"
                            value={layer.radius}
                            min={0}
                            max={400}
                            onChange={(radius) => onChange({ radius } as Partial<Layer>)}
                            suffix="px"
                        />
                    </Field>
                </div>
            ) : null}
        </PanelSection>
    );
}

function ImageProperties({
    layer,
    onChange,
    onUploadReplacement,
}: {
    layer: ImageLayer;
    onChange: (patch: Partial<Layer>) => void;
    onUploadReplacement: (file: File) => void;
}) {
    const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) onUploadReplacement(file);
        event.target.value = "";
    };

    return (
        <PanelSection title="Image" sectionKey="layer-image">
            <div className="mb-3 flex items-center gap-3 border border-border bg-surface-sunken p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={layer.src} alt="" className="h-12 w-12 shrink-0 border border-border object-cover" />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-foreground">{layer.name}</p>
                    <label className="mt-1 inline-block cursor-pointer border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground">
                        Replace file
                        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
                    </label>
                </div>
            </div>

            <Field label="Fit">
                <SegmentedControl
                    ariaLabel="Image fit"
                    value={layer.fit}
                    options={[
                        { value: "cover", label: "Cover" },
                        { value: "contain", label: "Contain" },
                        { value: "fill", label: "Stretch" },
                    ]}
                    onChange={(fit) => onChange({ fit } as Partial<Layer>)}
                />
            </Field>

            <Field label="Corner radius" htmlFor="image-radius">
                <NumberInput
                    id="image-radius"
                    value={layer.radius}
                    min={0}
                    max={400}
                    onChange={(radius) => onChange({ radius } as Partial<Layer>)}
                    suffix="px"
                />
            </Field>

            <Field
                label="Alt text"
                htmlFor="image-alt"
                hint="Describes the image for screen readers and for platforms that read your card."
            >
                <TextInput
                    id="image-alt"
                    value={layer.alt}
                    onChange={(alt) => onChange({ alt } as Partial<Layer>)}
                    placeholder="Product dashboard screenshot"
                />
            </Field>
        </PanelSection>
    );
}