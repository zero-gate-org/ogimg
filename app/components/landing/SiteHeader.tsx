"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

const LINKS = [
    { href: "/template-gallery", label: "Templates" },
    { href: "/learn", label: "Guides" },
    { href: "/tools", label: "Tools" },
    { href: "/compare", label: "Compare" },
    { href: "/changelog", label: "Changelog" },
];

export default function SiteHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    // An IntersectionObserver on a top-of-page sentinel replaces a scroll
    // listener, so the header state only changes when the page moves past the
    // fold boundary instead of on every scroll frame.
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting), {
            threshold: 0,
        });

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    return (
        <header
            className={`sticky top-0 z-40 border-b bg-background transition-colors duration-200 ${
                isScrolled ? "border-border" : "border-transparent"
            }`}
        >
            <div ref={sentinelRef} aria-hidden="true" className="absolute inset-x-0 top-0 h-px" />
            <div className="shell flex h-16 items-center justify-between gap-6">
                <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="ogimg.in home">
                    <Image src="/icon.png" alt="" width={26} height={26} />
                    <span className="font-pixel text-[17px] tracking-[-0.02em] text-foreground">ogimg.in</span>
                </Link>

                <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
                    {LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="link-underline text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        href="/studio"
                        className="pressable hidden h-9 items-center rounded-full bg-brand px-4 text-[13px] font-semibold text-brand-ink hover:bg-brand-strong md:inline-flex"
                    >
                        Make a poster
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-border-strong lg:hidden"
                    >
                        {isOpen ? <X size={16} /> : <List size={16} />}
                    </button>
                </div>
            </div>

            {/* The menu is always mounted through AnimatePresence so it animates
                in with height and fades out faster than it fades in. */}
            <AnimatePresence initial={false}>
                {isOpen ? (
                    <motion.nav
                        aria-label="Mobile"
                        initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={
                            reduce
                                ? { duration: 0.15 }
                                : {
                                      height: { duration: 0.28, ease: [0.24, 1, 0.32, 1] },
                                      opacity: { duration: 0.2, ease: "easeOut" },
                                  }
                        }
                        className="overflow-hidden border-t border-border bg-background lg:hidden"
                    >
                        <ul className="shell flex flex-col py-2">
                            {LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block py-2.5 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="py-3 md:hidden">
                                <Link
                                    href="/studio"
                                    onClick={() => setIsOpen(false)}
                                    className="pressable flex h-11 items-center justify-center rounded-full bg-brand px-5 text-[14px] font-semibold text-brand-ink"
                                >
                                    Make a poster
                                </Link>
                            </li>
                        </ul>
                    </motion.nav>
                ) : null}
            </AnimatePresence>
        </header>
    );
}
