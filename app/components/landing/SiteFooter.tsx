import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GithubLogo } from "@phosphor-icons/react/ssr";
import { SITE_NAME, SITE_URL } from "../../lib/seo";
import { Reveal } from "./landingPrimitives";

const RESOURCE_LINKS = [
    { href: "/template-gallery", label: "Template gallery" },
    { href: "/studio", label: "Free canvas" },
    { href: "/changelog", label: "Changelog" },
];

export default function SiteFooter() {
    return (
        <>
            {/* Closing CTA. The texture is the editor's own canvas grid — the
                surface this product exports from. */}
            <section className="canvas-grid border-b border-border bg-surface-sunken">
                <div className="shell flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end md:py-24">
                    <Reveal className="max-w-[46ch]">
                        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                            No account. No upload. No watermark.
                        </p>
                        <h2 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground md:text-[40px]">
                            Ship the link. The preview follows.
                        </h2>
                        <p className="mt-4 max-w-[44ch] text-[14px] leading-relaxed text-muted-foreground">
                            Start from a blank canvas or a template, and leave with a card that looks like it was
                            art-directed — because you did.
                        </p>
                    </Reveal>

                    <Reveal className="flex shrink-0 flex-wrap items-center gap-3">
                        <Link
                            href="/studio"
                            className="group pressable inline-flex h-11 items-center gap-2 bg-brand px-5 text-[14px] font-semibold text-brand-ink hover:bg-brand-strong"
                        >
                            Open the canvas
                            <ArrowRight
                                size={15}
                                weight="bold"
                                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                            />
                        </Link>
                        <Link
                            href="/template-gallery"
                            className="pressable inline-flex h-11 items-center border border-border bg-surface px-5 text-[14px] font-medium text-foreground hover:border-border-strong"
                        >
                            Browse templates
                        </Link>
                    </Reveal>
                </div>
            </section>

            <footer className="bg-background">
                <div className="shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <Image src="/icon.png" alt="" width={24} height={24} />
                        <span className="font-pixel text-[15px] text-foreground">{SITE_NAME}</span>
                    </div>

                    <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {RESOURCE_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a
                            href="https://github.com/GxAditya/ogimg"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <GithubLogo size={15} />
                            Source
                        </a>
                    </nav>

                    <p className="font-mono text-[11px] text-muted-foreground">
                        Rendering happens in your browser, on {SITE_URL.replace("https://", "")}
                    </p>
                </div>
            </footer>
        </>
    );
}
