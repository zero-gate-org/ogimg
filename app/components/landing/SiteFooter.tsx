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
            <section className="border-b border-border bg-surface">
                <div className="shell py-14 md:py-20">
                    <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div className="max-w-[44ch]">
                            <h2 className="text-2xl font-semibold leading-[1.12] tracking-[-0.03em] text-foreground md:text-[32px]">
                                Ship the link. The preview follows.
                            </h2>
                            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                                Free to use, no account, no upload. Start from a blank canvas or a template.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-3">
                            <Link
                                href="/studio"
                                className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-[14px] font-semibold text-brand-ink transition-colors hover:bg-brand-strong active:translate-y-px"
                            >
                                Open the canvas
                                <ArrowRight size={16} weight="bold" />
                            </Link>
                            <Link
                                href="/template-gallery"
                                className="inline-flex h-11 items-center border border-border px-5 text-[14px] font-medium text-foreground transition-colors hover:border-border-strong active:translate-y-px"
                            >
                                Browse templates
                            </Link>
                        </div>
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