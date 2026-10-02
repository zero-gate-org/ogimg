"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "@phosphor-icons/react";

const FAQS = [
    {
        question: "Do I need design skills?",
        answer:
            "No. Templates handle layout if you want a finished look in under a minute, and the free canvas is there when you want exact control.",
    },
    {
        question: "What is the difference between a template and the free canvas?",
        answer:
            "A template fixes the layout and exposes the controls that matter for that design. The canvas has no fixed layout: you place every element and set every value yourself.",
    },
    {
        question: "What formats and sizes can I export?",
        answer:
            "PNG, JPEG, and WebP at 1x, 2x, or 3x. Canvas sizes include Open Graph, LinkedIn, Product Hunt, YouTube thumbnails, square posts, and stories, plus custom dimensions.",
    },
    {
        question: "Can I use my own fonts?",
        answer:
            "The bundled set covers sixteen families, including the Geist pixel faces. They are self-hosted and embedded into the exported file, so the image renders the same on any machine.",
    },
    {
        question: "Is it really free?",
        answer:
            "Yes. There is no account, no watermark, and no paid tier. Everything runs in your browser tab.",
    },
    {
        question: "Do you store my uploads or my text?",
        answer:
            "Nothing is sent anywhere. Images, copy, and projects stay in your browser. Clearing site data removes saved projects and brand kits.",
    },
];

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const reduce = useReducedMotion();

    return (
        <section id="faq" className="scroll-mt-20 border-b border-border py-20 md:py-28">
            <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-16">
                <div>
                    <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[40px]">
                        Questions people ask first
                    </h2>
                    <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-muted-foreground">
                        Still stuck? The repo has the template sources and the export pipeline.
                    </p>
                </div>

                <ul className="border-t border-border">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <li key={faq.question} className="border-b border-border">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-start justify-between gap-4 py-4 text-left"
                                >
                                    <span className="text-[15px] font-medium text-foreground">
                                        {faq.question}
                                    </span>
                                    <Plus
                                        size={16}
                                        className={`mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                                            isOpen ? "rotate-45" : ""
                                        }`}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen ? (
                                        <motion.div
                                            initial={reduce ? false : { height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={reduce ? undefined : { height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <p className="max-w-[62ch] pb-5 text-[14px] leading-relaxed text-muted-foreground">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}