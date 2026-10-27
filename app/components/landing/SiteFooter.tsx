import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GithubLogo } from "@phosphor-icons/react/ssr";
import { SITE_NAME, SITE_URL } from "../../lib/seo";
import { Reveal } from "./landingPrimitives";

const PRODUCT_LINKS = [
    { href: "/template-gallery", label: "Template gallery" },
    { href: "/studio", label: "Free canvas" },
    { href: "/tools/open-graph-meta-tag-generator", label: "Meta tag generator" },
    { href: "/changelog", label: "Changelog" },
];

const LEARN_LINKS = [
    { href: "/learn", label: "All guides" },
    { href: "/learn/what-is-an-open-graph-image", label: "What is an OG image?" },
    { href: "/learn/open-graph-image-size", label: "OG image size" },
    { href: "/learn/open-graph-meta-tags", label: "Meta tags" },
    { href: "/tools", label: "Tools and references" },
];

const PROJECT_LINKS = [
    { href: "/about", label: "About" },
    { href: "/compare", label: "Comparisons" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/cookies", label: "Cookies" },
];

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
    return (
        <nav aria-label={title} className="flex flex-col gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
            <ul className="flex flex-col gap-2">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

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
                <div className="shell py-10 md:py-12">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                        <div className="flex max-w-[30ch] flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Image src="/icon.png" alt="" width={24} height={24} />
                                <span className="font-pixel text-[15px] text-foreground">{SITE_NAME}</span>
                            </div>
                            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                                Rendering happens in your browser, on {SITE_URL.replace("https://", "")}
                            </p>
                            <a
                                href="https://github.com/GxAditya/ogimg"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <GithubLogo size={14} />
                                MIT licensed source
                            </a>
                        </div>

                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10 lg:gap-14">
                            <FooterColumn title="Product" links={PRODUCT_LINKS} />
                            <FooterColumn title="Learn" links={LEARN_LINKS} />
                            <FooterColumn title="Project" links={PROJECT_LINKS} />
                            <nav aria-label="Compare" className="flex flex-col gap-3">
                                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Compare
                                </p>
                                <ul className="flex flex-col gap-2">
                                    <li>
                                        <Link
                                            href="/compare/bannerbear"
                                            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            vs Bannerbear
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/compare/canva"
                                            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            vs Canva
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-2 border-t border-border pt-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} {SITE_NAME}. Built by GxAditya.
                        </p>
                        <p>Free to use. The source is MIT licensed.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
