"use client";

import { Copy, FolderOpen, Trash } from "@phosphor-icons/react";
import { formatSavedAt, type SavedProject } from "../../lib/editor";
import FreeCanvasRender from "./FreeCanvasRender";
import TemplateRender from "./TemplateRender";
import { PanelEmptyState, PanelSection } from "./fields";

function ProjectThumb({ project }: { project: SavedProject }) {
    const width = project.document.kind === "free" ? project.document.width : 1200;
    const height = project.document.kind === "free" ? project.document.height : 630;

    return (
        <div
            className="relative w-full overflow-hidden border border-border bg-surface-sunken"
            style={{ aspectRatio: `${width} / ${height}` }}
        >
            <div
                className="origin-top-left"
                style={{ width, height, transform: `scale(${100 / width})`, transformOrigin: "top left" }}
            >
                {project.document.kind === "free" ? (
                    <FreeCanvasRender document={project.document} />
                ) : (
                    <TemplateRender document={project.document} />
                )}
            </div>
        </div>
    );
}

export default function ProjectsPanel({
    projects,
    onOpen,
    onDuplicate,
    onDelete,
    currentProjectId,
}: {
    projects: SavedProject[];
    onOpen: (project: SavedProject) => void;
    onDuplicate: (project: SavedProject) => void;
    onDelete: (project: SavedProject) => void;
    currentProjectId: string | null;
}) {
    return (
        <div>
            <PanelSection title="Saved projects" sectionKey="projects">
                {projects.length === 0 ? (
                    <PanelEmptyState
                        title="Nothing saved yet"
                        body="Saved work is stored in this browser. Use Save in the top bar to keep a card you can come back to."
                    />
                ) : (
                    <ul className="space-y-2">
                        {projects.map((project) => {
                            const isCurrent = project.id === currentProjectId;
                            const size =
                                project.document.kind === "free"
                                    ? `${project.document.width}x${project.document.height}`
                                    : "1200x630";

                            return (
                                <li key={project.id} className="border border-border bg-surface-sunken">
                                    <ProjectThumb project={project} />
                                    <div className="flex items-center gap-2 px-2.5 py-2">
                                        <button
                                            type="button"
                                            onClick={() => onOpen(project)}
                                            className="min-w-0 flex-1 text-left"
                                        >
                                            <span className="block truncate text-[12px] font-medium text-foreground">
                                                {project.name}
                                            </span>
                                            <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {project.mode} {size} {formatSavedAt(project.updatedAt)}
                                            </span>
                                        </button>
                                        {isCurrent ? (
                                            <span className="shrink-0 border border-brand px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brand">
                                                Open
                                            </span>
                                        ) : null}
                                        <button
                                            type="button"
                                            onClick={() => onDuplicate(project)}
                                            aria-label={`Duplicate ${project.name}`}
                                            title="Duplicate"
                                            className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(project)}
                                            aria-label={`Delete ${project.name}`}
                                            title="Delete"
                                            className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-destructive"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    <FolderOpen size={13} className="mt-0.5 shrink-0" />
                    Projects stay in local storage. Clearing site data removes them.
                </p>
            </PanelSection>
        </div>
    );
}