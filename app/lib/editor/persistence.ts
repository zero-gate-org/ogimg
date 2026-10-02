"use client";

import type { BrandKit, EditorDocument, SavedProject } from "./types";
import { createId } from "./factories";

const PROJECTS_KEY = "ogimg:projects:v1";
const KITS_KEY = "ogimg:brand-kits:v1";
const STUDIO_DRAFT_KEY = "ogimg:studio-draft:v1";

const readJson = <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;

    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
};

const writeJson = (key: string, value: unknown) => {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage can be full or blocked (private mode). The editor keeps working
        // in memory, so a failed write is intentionally silent.
    }
};

export const loadProjects = (): SavedProject[] => {
    const projects = readJson<SavedProject[]>(PROJECTS_KEY, []);
    if (!Array.isArray(projects)) return [];
    return projects
        .filter((project) => project && typeof project.id === "string" && project.document)
        .sort((a, b) => b.updatedAt - a.updatedAt);
};

export const saveProjects = (projects: SavedProject[]) => writeJson(PROJECTS_KEY, projects);

export const upsertProject = (project: SavedProject): SavedProject[] => {
    const existing = loadProjects().filter((entry) => entry.id !== project.id);
    return [project, ...existing].sort((a, b) => b.updatedAt - a.updatedAt);
};

export const deleteProject = (projectId: string): SavedProject[] =>
    loadProjects().filter((project) => project.id !== projectId);

export const loadBrandKits = (): BrandKit[] => {
    const kits = readJson<BrandKit[]>(KITS_KEY, []);
    if (!Array.isArray(kits)) return [];
    return kits.filter((kit) => kit && typeof kit.id === "string");
};

export const saveBrandKits = (kits: BrandKit[]) => writeJson(KITS_KEY, kits);

export const createBrandKit = (kit: Omit<BrandKit, "id">): BrandKit => ({
    ...kit,
    id: createId("kit"),
});

export const loadStudioDraft = (): EditorDocument | null => {
    const draft = readJson<EditorDocument | null>(STUDIO_DRAFT_KEY, null);
    if (!draft || draft.kind !== "free") return null;
    return draft;
};

export const saveStudioDraft = (document: EditorDocument | null) => {
    if (document === null) {
        if (typeof window !== "undefined") window.localStorage.removeItem(STUDIO_DRAFT_KEY);
        return;
    }

    writeJson(STUDIO_DRAFT_KEY, document);
};

export const formatSavedAt = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.round(diff / 60000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
};