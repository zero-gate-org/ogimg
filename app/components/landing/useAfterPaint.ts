"use client";

import { useEffect, useState } from "react";

/**
 * True once the first frame has painted.
 *
 * Landing animations are layered on only after that point, so the server markup
 * and the first client render match and the page stays readable without
 * JavaScript.
 */
export function useAfterPaint() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return ready;
}