"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks the rendered width of an element so a fixed size canvas can be scaled
 * to whatever space it actually has, on any viewport.
 */
export function useMeasuredWidth<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const measure = () => setWidth(node.clientWidth);
        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return { ref, width };
}