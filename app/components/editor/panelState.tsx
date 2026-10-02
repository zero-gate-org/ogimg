"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface PanelStateValue {
    /** Open or closed, keyed by section id. Unknown sections default to open. */
    isOpen: (key: string) => boolean;
    toggle: (key: string) => void;
    /** True when at least one section in this panel is closed. */
    hasCollapsed: boolean;
    collapseAll: () => void;
    expandAll: () => void;
    register: (key: string) => void;
}

const PanelStateContext = createContext<PanelStateValue | null>(null);

/**
 * One provider per panel, so the left and right panels collapse independently.
 *
 * Sections register their own key on mount, which is what lets "collapse all"
 * reach sections that are not currently rendered without the panel needing to
 * know anything about them.
 */
export function PanelStateProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const [keys, setKeys] = useState<string[]>([]);

    const register = useCallback((key: string) => {
        setKeys((current) => (current.includes(key) ? current : [...current, key]));
    }, []);

    const value = useMemo<PanelStateValue>(() => {
        const isOpen = (key: string) => open[key] ?? true;

        return {
            isOpen,
            register,
            toggle: (key) => setOpen((current) => ({ ...current, [key]: !isOpen(key) })),
            hasCollapsed: Object.values(open).some((value) => value === false),
            collapseAll: () => setOpen(Object.fromEntries(keys.map((key) => [key, false]))),
            expandAll: () => setOpen({}),
        };
    }, [open, keys, register]);

    return <PanelStateContext.Provider value={value}>{children}</PanelStateContext.Provider>;
}

export function usePanelState() {
    const context = useContext(PanelStateContext);

    if (!context) {
        throw new Error("usePanelState must be used inside a PanelStateProvider");
    }

    return context;
}

/** Registers a section id and reports whether it is open. */
export function usePanelSection(key: string) {
    const { register, isOpen, toggle } = usePanelState();

    useEffect(() => {
        register(key);
    }, [key, register]);

    return { isOpen: isOpen(key), toggle: () => toggle(key) };
}