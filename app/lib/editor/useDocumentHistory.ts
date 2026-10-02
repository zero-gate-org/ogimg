"use client";

import { useCallback, useMemo, useState } from "react";

const HISTORY_LIMIT = 80;
const MERGE_WINDOW_MS = 550;

interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
    mergeKey?: string;
    mergedAt: number;
}

export interface DocumentHistory<T> {
    document: T;
    /** Apply a change. `mergeKey` collapses rapid edits (typing, dragging) into one undo step. */
    update: (updater: (current: T) => T, mergeKey?: string) => void;
    /** Replace the document without touching history (project load, template switch). */
    replace: (next: T) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    reset: (next: T) => void;
}

export const useDocumentHistory = <T,>(initialDocument: T): DocumentHistory<T> => {
    const [history, setHistory] = useState<HistoryState<T>>({
        past: [],
        present: initialDocument,
        future: [],
        mergedAt: 0,
    });

    // Every update funnels through a setState callback, so rapid pointer moves
    // coalesce into one undo step without reading stale state.
    const update = useCallback((updater: (current: T) => T, mergeKey?: string) => {
        setHistory((current) => {
            const next = updater(current.present);
            if (next === current.present) {
                return current;
            }

            const now = Date.now();
            const canMerge =
                Boolean(mergeKey) &&
                current.mergeKey === mergeKey &&
                now - current.mergedAt < MERGE_WINDOW_MS &&
                current.past.length > 0;

            if (canMerge) {
                return {
                    past: current.past,
                    present: next,
                    future: [],
                    mergeKey,
                    mergedAt: now,
                };
            }

            return {
                past: [...current.past, current.present].slice(-HISTORY_LIMIT),
                present: next,
                future: [],
                mergeKey,
                mergedAt: now,
            };
        });
    }, []);

    const replace = useCallback((next: T) => {
        setHistory({ past: [], present: next, future: [], mergedAt: 0 });
    }, []);

    const reset = replace;

    const undo = useCallback(() => {
        setHistory((current) => {
            if (current.past.length === 0) return current;
            const previous = current.past[current.past.length - 1];
            return {
                past: current.past.slice(0, -1),
                present: previous,
                future: [current.present, ...current.future].slice(0, HISTORY_LIMIT),
                mergedAt: 0,
            };
        });
    }, []);

    const redo = useCallback(() => {
        setHistory((current) => {
            if (current.future.length === 0) return current;
            const [next, ...rest] = current.future;
            return {
                past: [...current.past, current.present].slice(-HISTORY_LIMIT),
                present: next,
                future: rest,
                mergedAt: 0,
            };
        });
    }, []);

    return useMemo(
        () => ({
            document: history.present,
            update,
            replace,
            reset,
            undo,
            redo,
            canUndo: history.past.length > 0,
            canRedo: history.future.length > 0,
        }),
        [history.present, history.past.length, history.future.length, update, replace, reset, undo, redo],
    );
};