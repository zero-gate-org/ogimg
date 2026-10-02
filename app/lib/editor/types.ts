import type { TemplateFontId } from "../../components/templates/fontCatalog";
import type { TemplateId } from "../../components/templates/templateRegistry";
import type {
    BackgroundPresetId,
    GridOverlay,
} from "../../components/templates/templateShared";

export type TextAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "middle" | "bottom";
export type ShapeKind = "rect" | "ellipse" | "line";
export type ImageFit = "cover" | "contain" | "fill";
export type BackgroundMode = "solid" | "gradient" | "preset" | "image";
export type LayerKind = "text" | "shape" | "image";

export interface BaseLayer {
    id: string;
    kind: LayerKind;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    locked: boolean;
    hidden: boolean;
}

export interface TextLayer extends BaseLayer {
    kind: "text";
    text: string;
    fontId: TemplateFontId;
    fontSize: number;
    fontWeight: number;
    italic: boolean;
    lineHeight: number;
    letterSpacing: number;
    align: TextAlign;
    verticalAlign: VerticalAlign;
    color: string;
    uppercase: boolean;
    shadow: boolean;
}

export interface ShapeLayer extends BaseLayer {
    kind: "shape";
    shape: ShapeKind;
    fillEnabled: boolean;
    fill: string;
    strokeEnabled: boolean;
    stroke: string;
    strokeWidth: number;
    radius: number;
}

export interface ImageLayer extends BaseLayer {
    kind: "image";
    src: string;
    alt: string;
    fit: ImageFit;
    radius: number;
}

export type Layer = TextLayer | ShapeLayer | ImageLayer;

export interface CanvasBackground {
    mode: BackgroundMode;
    color: string;
    gradientStart: string;
    gradientEnd: string;
    gradientAngle: number;
    presetId: BackgroundPresetId;
    /** Uploaded canvas image as a data URL. Empty means the slot is unused. */
    imageSrc: string;
    imageName: string;
    imageFit: ImageFit;
    imageOpacity: number;
    /** Reuses `color`, so type stays readable over a photo. 0 to 1. */
    imageScrim: number;
    overlay: GridOverlay;
    overlayColor: string;
    overlayOpacity: number;
    overlayBlur: number;
    noise: boolean;
}

export interface FreeDocument {
    kind: "free";
    id: string;
    name: string;
    width: number;
    height: number;
    background: CanvasBackground;
    layers: Layer[];
}

export interface TemplateFields {
    title: string;
    textColor: string;
    tag: string;
    logo: string;
    detailOne: string;
    detailTwo: string;
    detailThree: string;
    fontId: TemplateFontId;
    titleSize: number | null;
    /** Null means "use the template baseline". */
    titleTracking: number | null;
    imageFit: ImageFit;
    imageRadius: number;
    backgroundMode: "Gradient" | "Solid Color" | "Background";
    gradientStart: string;
    gradientEnd: string;
    gradientAngle: number;
    backgroundPresetId: BackgroundPresetId;
    gridOverlay: GridOverlay;
    gridColor: string;
    gridOpacity: number;
    gridBlur: number;
}

export interface TemplateDocument {
    kind: "template";
    id: string;
    name: string;
    templateId: TemplateId;
    fields: TemplateFields;
    logoImage: string;
    logoImageName: string;
    image: string;
    imageName: string;
}

export type EditorDocument = FreeDocument | TemplateDocument;

export type ExportFormat = "png" | "jpeg" | "webp";

export interface SavedProject {
    id: string;
    name: string;
    mode: EditorDocument["kind"];
    updatedAt: number;
    document: EditorDocument;
}

export interface BrandKit {
    id: string;
    name: string;
    logoImage: string;
    logoImageName: string;
    textColor: string;
    fontId: TemplateFontId;
    backgroundMode: "Gradient" | "Solid Color" | "Background";
    gradientStart: string;
    gradientEnd: string;
    gradientAngle: number;
    backgroundPresetId: BackgroundPresetId;
    gridOverlay: GridOverlay;
    gridColor: string;
    gridOpacity: number;
}