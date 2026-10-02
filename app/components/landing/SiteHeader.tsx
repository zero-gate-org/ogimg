"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

const LINKS = [
    { href: "/template-gallery", label: "Templates" },
    { href: "/#preview", label: "Preview" },
    { href: "/#faq", label: "FAQ" },
    { href: "/changelog", label: "Changelog" },
];

export default function SiteHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

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
            className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
                isScrolled ? "border-border bg-background/88 backdrop-blur-md" : "border-transparent bg-background"
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
                            className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        href="/studio"
                        className="inline-flex h-9 items-center bg-brand px-4 text-[13px] font-semibold text-brand-ink transition-colors hover:bg-brand-strong active:translate-y-px"
                    >
                        Open the canvas
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        className="flex h-9 w-9 items-center justify-center border border-border text-foreground lg:hidden"
                    >
                        {isOpen ? <X size={16} /> : <List size={16} />}
                    </button>
                </div>
            </div>

            {isOpen ? (
                <nav aria-label="Mobile" className="border-t border-border bg-background lg:hidden">
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
                    </ul>
                </nav>
            ) : null}
        </header>
    );
}