"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowCounterClockwise,
    ArrowClockwise,
    CaretLeft,
    CheckCircle,
    Eye,
    FloppyDisk,
    ImageSquare,
    PencilSimple,
    UploadSimple,
} from "@phosphor-icons/react";
import CanvasStage from "./CanvasStage";
import TemplateRender from "./TemplateRender";
import ExportPanel from "./ExportPanel";
import ProjectsPanel from "./ProjectsPanel";
import BrandKitsPanel from "./BrandKitsPanel";
import PreviewDrawer from "./PreviewDrawer";
import TemplateGalleryPreview from "../TemplateGalleryPreview";
import {
    ColorInput,
    Field,
    FontSelect,
    PanelCollapseAll,
    PanelSection,
    PanelTabs,
    SegmentedControl,
    SliderField,
    TextInput,
} from "./fields";
import { PanelStateProvider } from "./panelState";
import {
    BACKGROUND_PRESETS,
    type GridOverlay,
} from "../templates/templateShared";
import {
    TEMPLATE_LIBRARY,
    getTemplateById,
    type TemplateId,
} from "../templates/templateRegistry";
import { getTemplateDefaultFontId, type TemplateFontId } from "../templates/fontCatalog";
import {
    applyBrandKitToTemplate,
    createId,
    createTemplateDocument,
    exportDesignImage,
    formatSavedAt,
    getTemplateSchema,
    loadBrandKits,
    loadProjects,
    saveBrandKits,
    saveProjects,
    slugify,
    upsertProject,
    useDocumentHistory,
    type BrandKit,
    type ExportFormat,
    type SavedProject,
    type TemplateDocument,
} from "../../lib/editor";

type Tab = "content" | "type" | "background" | "export" | "files" | "kits";

const TABS: { id: Tab; label: string }[] = [
    { id: "content", label: "Content" },
    { id: "type", label: "Type" },
    { id: "background", label: "Canvas" },
    { id: "export", label: "Export" },
    { id: "files", label: "Files" },
    { id: "kits", label: "Kits" },
];

const GRID_OPTIONS: { value: GridOverlay; label: string }[] = [
    { value: "none", label: "None" },
    { value: "grid", label: "Grid" },
    { value: "graph", label: "Graph" },
    { value: "dots", label: "Dots" },
];

const buildTemplateDocument = (templateId: TemplateId): TemplateDocument => {
    const template = getTemplateById(templateId);
    return createTemplateDocument(templateId, {
        title: template.defaults.title,
        textColor: template.defaults.textColor,
        tag: template.defaults.tag,
        logo: template.defaults.logo,
        detailOne: template.defaults.detailOne,
        detailTwo: template.defaults.detailTwo,
        detailThree: template.defaults.detailThree,
        image: template.defaults.image,
        imageFileName: template.defaults.imageFileName,
        fontId: getTemplateDefaultFontId(templateId),
        backgroundMode: template.defaults.backgroundMode,
        gradientStart: template.defaults.gradientStart,
        gradientEnd: template.defaults.gradientEnd,
        gradientAngle: template.defaults.gradientAngle,
        backgroundPresetId: template.defaults.backgroundPresetId,
        gridOverlay: template.defaults.gridOverlay,
        gridColor: template.defaults.gridColor,
        gridOpacity: template.defaults.gridOpacity,
        gridBlur: template.defaults.gridBlur,
    });
};

export default function TemplateEditor({
    templateId,
    backHref = "/template-gallery",
}: {
    templateId: TemplateId;
    backHref?: string;
}) {
    const router = useRouter();
    const initialDocument = useMemo(() => buildTemplateDocument(templateId), [templateId]);
    const history = useDocumentHistory<TemplateDocument>(initialDocument);
    const document = history.document;
    const schema = getTemplateSchema(document.templateId);
    const template = getTemplateById(document.templateId);

    const canvasRef = useRef<HTMLDivElement | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState<Tab>("content");
    const [projects, setProjects] = useState<SavedProject[]>([]);
    const [kits, setKits] = useState<BrandKit[]>([]);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [format, setFormat] = useState<ExportFormat>("png");
    const [scale, setScale] = useState(2);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Saved projects and kits live in local storage, so they are read after the
    // first paint. Deferring by a frame keeps hydration stable and keeps this
    // effect from writing state synchronously during the commit.
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setProjects(loadProjects());
            setKits(loadBrandKits());
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    const updateDocument = history.update;

    const patchFields = useCallback(
        (patch: Partial<TemplateDocument["fields"]>, mergeKey?: string) => {
            updateDocument((current) => ({ ...current, fields: { ...current.fields, ...patch } }), mergeKey);
        },
        [updateDocument],
    );

    const switchTemplate = (nextId: TemplateId) => {
        history.replace({ ...buildTemplateDocument(nextId), name: getTemplateById(nextId).name });
        setCurrentProjectId(null);
        setTab("content");
        router.push(`/editor/${nextId}`);
    };

    const readFile = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") resolve(reader.result);
                else reject(new Error("Could not read that file"));
            };
            reader.onerror = () => reject(new Error("Could not read that file"));
            reader.readAsDataURL(file);
        });

    const handleLogoUpload = async (file: File) => {
        try {
            const src = await readFile(file);
            updateDocument((current) => ({ ...current, logoImage: src, logoImageName: file.name }));
        } catch (error) {
            setExportError(error instanceof Error ? error.message : "Could not read that file");
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            const src = await readFile(file);
            updateDocument((current) => ({ ...current, image: src, imageName: file.name }));
        } catch (error) {
            setExportError(error instanceof Error ? error.message : "Could not read that file");
        }
    };

    const saveProject = () => {
        setSaveState("saving");
        const project: SavedProject = {
            id: currentProjectId ?? createId("project"),
            name: document.name.trim() || template.name,
            mode: "template",
            updatedAt: Date.now(),
            document,
        };

        const next = upsertProject(project);
        saveProjects(next);
        setProjects(next);
        setCurrentProjectId(project.id);
        setLastSavedAt(project.updatedAt);
        window.setTimeout(() => setSaveState("idle"), 1200);
    };

    const handleExport = async () => {
        const node = canvasRef.current;
        if (!node) return;

        setIsExporting(true);
        setExportError(null);

        try {
            await exportDesignImage({
                sourceNode: node,
                width: 1200,
                height: 630,
                scale,
                format,
                quality: 0.95,
                fontIds: [document.fields.fontId],
                name: document.name || template.name,
            });
        } catch (error) {
            setExportError(
                error instanceof Error ? error.message : "The export failed. Try a smaller resolution.",
            );
        } finally {
            setIsExporting(false);
        }
    };

    // The shortcut listener needs the current save handler, so the handler is
    // held in a ref instead of being listed as a dependency of the effect.
    const saveProjectRef = useRef(saveProject);

    useEffect(() => {
        saveProjectRef.current = saveProject;
    });

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isTyping =
                target &&
                (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT");
            const modifier = event.metaKey || event.ctrlKey;

            if (modifier && event.key.toLowerCase() === "z" && !isTyping) {
                event.preventDefault();
                if (event.shiftKey) history.redo();
                else history.undo();
            }

            if (modifier && event.key.toLowerCase() === "s") {
                event.preventDefault();
                saveProjectRef.current();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [history]);

    return (
        <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
            <header className="grid h-14 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-surface px-3">
                <div className="flex min-w-0 items-center gap-2">
                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Image src="/icon.png" alt="" width={20} height={20} />
                        <span className="hidden font-pixel text-sm lg:inline">ogimg.in</span>
                    </Link>

                    <span className="hidden h-5 w-px bg-border sm:block" />

                    <Link
                        href={backHref}
                        className="hidden items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                    >
                        <CaretLeft size={14} />
                        Gallery
                    </Link>

                    <span className="hidden h-5 w-px bg-border md:block" />

                    <SegmentedControl
                        ariaLabel="Editor mode"
                        value="templates"
                        options={[
                            { value: "studio", label: "Free canvas" },
                            { value: "templates", label: "Templates" },
                        ]}
                        onChange={(value) => {
                            if (value === "studio") router.push("/studio");
                        }}
                        className="hidden md:flex"
                    />
                </div>

                <div className="flex min-w-0 justify-start md:justify-center">
                    <div className="flex min-w-0 items-center gap-1.5 px-2 py-1 transition-colors hover:bg-surface-raised focus-within:bg-surface-raised">
                        <PencilSimple size={12} className="shrink-0 text-muted-foreground" />
                        <input
                            type="text"
                            value={document.name}
                            aria-label="Design name"
                            title={document.name}
                            onChange={(event) =>
                                updateDocument((current) => ({ ...current, name: event.target.value }), "name")
                            }
                            className="min-w-0 w-full max-w-[220px] truncate border-0 bg-transparent p-0 text-[13px] font-medium text-foreground focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={history.undo}
                        disabled={!history.canUndo}
                        aria-label="Undo"
                        title="Undo (Ctrl+Z)"
                        className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowCounterClockwise size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={history.redo}
                        disabled={!history.canRedo}
                        aria-label="Redo"
                        title="Redo (Ctrl+Shift+Z)"
                        className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowClockwise size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="flex h-8 items-center gap-1.5 border border-border bg-surface px-2.5 text-[12px] font-medium text-foreground transition-colors hover:border-border-strong"
                    >
                        <Eye size={14} />
                        Preview
                    </button>

                    <button
                        type="button"
                        onClick={saveProject}
                        className="flex h-8 items-center gap-1.5 border border-border bg-surface px-2.5 text-[12px] font-medium text-foreground transition-colors hover:border-border-strong"
                    >
                        <FloppyDisk size={14} />
                        {saveState === "saving" ? "Saving" : saveState === "saved" ? "Saved" : "Save"}
                    </button>
                </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface lg:w-[228px] lg:border-b-0 lg:border-r">
                    <PanelStateProvider>
                    <div className="scroll-y min-h-0 flex-1">
                        <PanelSection
                            title="Templates"
                            sectionKey="gallery-list"
                            action={
                                <span className="pr-1 font-mono text-[11px] text-muted-foreground">
                                    {TEMPLATE_LIBRARY.length}
                                </span>
                            }
                        >
                        <ul className="space-y-1.5 pt-1">
                            {TEMPLATE_LIBRARY.map((entry) => {
                                const active = entry.id === document.templateId;
                                return (
                                    <li key={entry.id}>
                                        <button
                                            type="button"
                                            onClick={() => switchTemplate(entry.id)}
                                            aria-current={active}
                                            className={`block w-full border text-left transition-colors ${
                                                active
                                                    ? "border-brand"
                                                    : "border-border hover:border-border-strong"
                                            }`}
                                        >
                                            <TemplateGalleryPreview templateId={entry.id} />
                                            <span className="block border-t border-border px-2 py-1.5">
                                                <span className="block truncate text-[11px] font-medium text-foreground">
                                                    {entry.name}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        </PanelSection>
                    </div>
                    <div className="flex shrink-0 items-center justify-end border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
                        <PanelCollapseAll />
                    </div>
                    </PanelStateProvider>
                </aside>

                <main className="flex min-h-[42vh] min-w-0 flex-1 flex-col bg-surface-sunken">
                    <CanvasStage width={1200} height={630}>
                        <div ref={canvasRef} style={{ width: 1200, height: 630 }}>
                            <TemplateRender document={document} />
                        </div>
                    </CanvasStage>
                </main>

                <aside className="flex w-full shrink-0 flex-col border-t border-border bg-surface lg:w-[320px] lg:border-l lg:border-t-0">
                    <PanelStateProvider>
                    <PanelTabs tabs={TABS} value={tab} onChange={setTab} ariaLabel="Editor panels" />

                    <div className="scroll-y min-h-0 flex-1">
                        {tab === "content" ? (
                            <div>
                                <PanelSection title={template.name} sectionKey="tpl-content">
                                    <p className="text-[12px] leading-relaxed text-muted-foreground">
                                        {schema.imageHint}
                                    </p>
                                    <div className="mt-4 space-y-0">
                                        {schema.fields.map((field) => (
                                            <Field key={field.slot} label={field.label} htmlFor={`field-${field.slot}`}>
                                                <TextInput
                                                    id={`field-${field.slot}`}
                                                    value={document.fields[field.slot]}
                                                    onChange={(value) =>
                                                        patchFields(
                                                            { [field.slot]: value } as Partial<
                                                                TemplateDocument["fields"]
                                                            >,
                                                            `text-${field.slot}`,
                                                        )
                                                    }
                                                    placeholder={field.placeholder}
                                                    multiline={field.multiline}
                                                    rows={2}
                                                />
                                            </Field>
                                        ))}
                                    </div>
                                </PanelSection>

                                {schema.supportsLogoImage ? (
                                    <PanelSection title="Brand mark" sectionKey="tpl-logo">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={document.logoImage}
                                                alt=""
                                                className="h-10 w-10 border border-border bg-surface-sunken object-contain p-1"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[12px] text-foreground">
                                                    {document.logoImageName || "Default mark"}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => logoInputRef.current?.click()}
                                                    className="mt-1 inline-flex items-center gap-1.5 border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                                                >
                                                    <UploadSimple size={12} />
                                                    Replace
                                                </button>
                                                <input
                                                    ref={logoInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0];
                                                        if (file) handleLogoUpload(file);
                                                        event.target.value = "";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </PanelSection>
                                ) : null}

                                {schema.supportsImage ? (
                                    <PanelSection title="Image" sectionKey="tpl-image">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-surface-sunken text-muted-foreground">
                                                <ImageSquare size={16} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[12px] text-foreground">
                                                    {document.imageName || "No image"}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => imageInputRef.current?.click()}
                                                    className="mt-1 inline-flex items-center gap-1.5 border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                                                >
                                                    <UploadSimple size={12} />
                                                    Upload
                                                </button>
                                                <input
                                                    ref={imageInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0];
                                                        if (file) handleImageUpload(file);
                                                        event.target.value = "";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </PanelSection>
                                ) : null}
                            </div>
                        ) : null}

                        {tab === "type" ? (
                            <div>
                                <PanelSection title="Typography" sectionKey="tpl-type">
                                    <Field label="Font" htmlFor="template-font">
                                        <FontSelect
                                            id="template-font"
                                            value={document.fields.fontId}
                                            onChange={(fontId: TemplateFontId) => patchFields({ fontId })}
                                        />
                                    </Field>
                                    <Field
                                        label="Headline size"
                                        htmlFor="template-title-size"
                                        hint="Templates set their own baseline. Adjust it when your copy runs long."
                                    >
                                        <input
                                            id="template-title-size"
                                            type="range"
                                            min={18}
                                            max={96}
                                            value={document.fields.titleSize ?? 44}
                                            onChange={(event) =>
                                                patchFields({ titleSize: Number(event.target.value) }, "titleSize")
                                            }
                                            className="h-4 w-full"
                                        />
                                        <span className="mt-1 block text-right font-mono text-[11px] text-muted-foreground">
                                            {document.fields.titleSize ?? 44}px
                                        </span>
                                    </Field>
                                    <Field label="Headline tracking" htmlFor="template-title-tracking">
                                        <input
                                            id="template-title-tracking"
                                            type="range"
                                            min={-0.08}
                                            max={0.2}
                                            step={0.005}
                                            value={document.fields.titleTracking}
                                            onChange={(event) =>
                                                patchFields(
                                                    { titleTracking: Number(event.target.value) },
                                                    "titleTracking",
                                                )
                                            }
                                            className="h-4 w-full"
                                        />
                                        <span className="mt-1 block text-right font-mono text-[11px] text-muted-foreground">
                                            {document.fields.titleTracking.toFixed(3)}em
                                        </span>
                                    </Field>
                                    <Field label="Text colour" htmlFor="template-text-color">
                                        <ColorInput
                                            id="template-text-color"
                                            value={document.fields.textColor}
                                            onChange={(textColor) => patchFields({ textColor })}
                                        />
                                    </Field>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            patchFields({
                                                titleSize: null,
                                                titleTracking: 0,
                                                imageFit: "contain",
                                                imageRadius: 0,
                                            })
                                        }
                                        className="text-[12px] font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                                    >
                                        Reset type overrides
                                    </button>
                                </PanelSection>

                                {schema.supportsImage ? (
                                    <PanelSection title="Image treatment" sectionKey="tpl-image-fit">
                                        <Field label="Fit">
                                            <SegmentedControl
                                                ariaLabel="Image fit"
                                                value={document.fields.imageFit}
                                                options={[
                                                    { value: "cover", label: "Cover" },
                                                    { value: "contain", label: "Contain" },
                                                    { value: "fill", label: "Stretch" },
                                                ]}
                                                onChange={(imageFit) => patchFields({ imageFit })}
                                            />
                                        </Field>
                                        <Field label="Corner radius" htmlFor="template-image-radius">
                                            <input
                                                id="template-image-radius"
                                                type="range"
                                                min={0}
                                                max={80}
                                                value={document.fields.imageRadius}
                                                onChange={(event) =>
                                                    patchFields(
                                                        { imageRadius: Number(event.target.value) },
                                                        "imageRadius",
                                                    )
                                                }
                                                className="h-4 w-full"
                                            />
                                            <span className="mt-1 block text-right font-mono text-[11px] text-muted-foreground">
                                                {document.fields.imageRadius}px
                                            </span>
                                        </Field>
                                    </PanelSection>
                                ) : null}
                            </div>
                        ) : null}

                        {tab === "background" ? (
                            <div>
                                <PanelSection title="Fill" sectionKey="tpl-fill">
                                    <Field label="Type">
                                        <SegmentedControl
                                            ariaLabel="Background fill type"
                                            value={document.fields.backgroundMode}
                                            options={[
                                                { value: "Gradient", label: "Gradient" },
                                                { value: "Solid Color", label: "Solid" },
                                                { value: "Background", label: "Preset" },
                                            ]}
                                            onChange={(backgroundMode) => patchFields({ backgroundMode })}
                                        />
                                    </Field>

                                    {document.fields.backgroundMode === "Gradient" ? (
                                        <>
                                            <Field label="Start" htmlFor="template-bg-start">
                                                <ColorInput
                                                    id="template-bg-start"
                                                    value={document.fields.gradientStart}
                                                    onChange={(gradientStart) => patchFields({ gradientStart })}
                                                />
                                            </Field>
                                            <Field label="End" htmlFor="template-bg-end">
                                                <ColorInput
                                                    id="template-bg-end"
                                                    value={document.fields.gradientEnd}
                                                    onChange={(gradientEnd) => patchFields({ gradientEnd })}
                                                />
                                            </Field>
                                            <SliderField
                                                id="template-bg-angle"
                                                label="Angle"
                                                value={document.fields.gradientAngle}
                                                min={0}
                                                max={360}
                                                onChange={(gradientAngle) => patchFields({ gradientAngle })}
                                                display={`${document.fields.gradientAngle}°`}
                                            />
                                        </>
                                    ) : null}

                                    {document.fields.backgroundMode === "Solid Color" ? (
                                        <Field label="Colour" htmlFor="template-bg-solid">
                                            <ColorInput
                                                id="template-bg-solid"
                                                value={document.fields.gradientStart}
                                                onChange={(gradientStart) =>
                                                    patchFields({
                                                        gradientStart,
                                                        gradientEnd: gradientStart,
                                                    })
                                                }
                                            />
                                        </Field>
                                    ) : null}

                                    {document.fields.backgroundMode === "Background" ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {BACKGROUND_PRESETS.map((preset) => {
                                                const active =
                                                    document.fields.backgroundPresetId === preset.id;
                                                return (
                                                    <button
                                                        key={preset.id}
                                                        type="button"
                                                        onClick={() =>
                                                            patchFields({ backgroundPresetId: preset.id })
                                                        }
                                                        aria-pressed={active}
                                                        className={`border p-1.5 text-left transition-colors ${
                                                            active
                                                                ? "border-brand"
                                                                : "border-border hover:border-border-strong"
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
                                    ) : null}
                                </PanelSection>

                                <PanelSection title="Pattern overlay" sectionKey="tpl-overlay">
                                    <Field label="Pattern">
                                        <SegmentedControl
                                            ariaLabel="Grid overlay pattern"
                                            value={document.fields.gridOverlay}
                                            options={GRID_OPTIONS}
                                            onChange={(gridOverlay) => patchFields({ gridOverlay })}
                                        />
                                    </Field>

                                    {document.fields.gridOverlay !== "none" ? (
                                        <>
                                            <Field label="Colour" htmlFor="template-grid-color">
                                                <ColorInput
                                                    id="template-grid-color"
                                                    value={document.fields.gridColor}
                                                    onChange={(gridColor) => patchFields({ gridColor })}
                                                />
                                            </Field>
                                            <SliderField
                                                id="template-grid-opacity"
                                                label="Opacity"
                                                value={Math.round(document.fields.gridOpacity * 100)}
                                                min={0}
                                                max={100}
                                                onChange={(value) =>
                                                    patchFields({ gridOpacity: value / 100 })
                                                }
                                                display={`${Math.round(document.fields.gridOpacity * 100)}%`}
                                            />
                                            <SliderField
                                                id="template-grid-blur"
                                                label="Softness"
                                                value={document.fields.gridBlur}
                                                min={0}
                                                max={4}
                                                step={0.1}
                                                onChange={(gridBlur) => patchFields({ gridBlur })}
                                                display={`${document.fields.gridBlur.toFixed(1)}px`}
                                            />
                                        </>
                                    ) : null}
                                </PanelSection>
                            </div>
                        ) : null}

                        {tab === "export" ? (
                            <ExportPanel
                                width={1200}
                                height={630}
                                onResize={() => undefined}
                                format={format}
                                onFormatChange={setFormat}
                                scale={scale}
                                onScaleChange={setScale}
                                onExport={handleExport}
                                isExporting={isExporting}
                                error={exportError}
                                onDismissError={() => setExportError(null)}
                                showSizes={false}
                            />
                        ) : null}

                        {tab === "files" ? (
                            <div>
                                <ProjectsPanel
                                    projects={projects}
                                    onOpen={(project) => {
                                        if (project.document.kind !== "template") return;
                                        history.replace({ ...project.document, id: createId("doc") });
                                        setCurrentProjectId(project.id);
                                        setTab("content");
                                    }}
                                    onDuplicate={(project) => {
                                        const duplicated: SavedProject = {
                                            ...project,
                                            id: createId("project"),
                                            name: `${project.name} copy`,
                                            updatedAt: Date.now(),
                                        };
                                        const next = upsertProject(duplicated);
                                        saveProjects(next);
                                        setProjects(next);
                                    }}
                                    onDelete={(project) => {
                                        const next = loadProjects().filter((entry) => entry.id !== project.id);
                                        saveProjects(next);
                                        setProjects(next);
                                        if (project.id === currentProjectId) setCurrentProjectId(null);
                                    }}
                                    currentProjectId={currentProjectId}
                                />
                                {lastSavedAt ? (
                                    <p className="px-4 pb-4 font-mono text-[11px] text-muted-foreground">
                                        Saved {formatSavedAt(lastSavedAt)}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        {tab === "kits" ? (
                            <div>
                                <BrandKitsPanel
                                    kits={kits}
                                    onChange={(next) => {
                                        setKits(next);
                                        saveBrandKits(next);
                                    }}
                                    onApply={(kit) => updateDocument((current) => applyBrandKitToTemplate(current, kit))}
                                    onDelete={(kitId) => {
                                        const next = kits.filter((kit) => kit.id !== kitId);
                                        setKits(next);
                                        saveBrandKits(next);
                                    }}
                                />
                                <p className="flex items-start gap-1.5 px-4 pb-4 text-[11px] leading-relaxed text-muted-foreground">
                                    <CheckCircle size={13} className="mt-0.5 shrink-0" />
                                    Applying a kit rewrites type colour, font, and background on the current
                                    template.
                                </p>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
                        <PanelCollapseAll />
                        {saveState === "saved" ? (
                            <span className="font-mono text-brand">Saved to this browser</span>
                        ) : (
                            <>
                                <span className="truncate font-mono">{slugify(document.name) || template.name}</span>
                                <span className="ml-auto shrink-0 font-mono">1200 x 630</span>
                            </>
                        )}
                    </div>
                    </PanelStateProvider>
                </aside>
            </div>

            <PreviewDrawer
                design={document}
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
            />
        </div>
    );
}