import { Plus } from "@phosphor-icons/react/ssr";
import { HOME_FAQS } from "../../lib/faqs";

/**
 * Native details/summary rather than a stateful accordion.
 *
 * Every answer is in the server HTML, which keeps the copy available to search
 * engines, AI crawlers, and readers without JavaScript. The FAQPage schema on
 * the homepage is generated from the same HOME_FAQS list.
 */
export default function Faq() {
    return (
        <section id="faq" className="scroll-mt-20 py-20 md:py-28">
            <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-16">
                <div>
                    <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[40px]">
                        Questions people ask first
                    </h2>
                    <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-muted-foreground">
                        Still stuck? The repo has the template sources and the export pipeline.
                    </p>
                    <a
                        href="https://github.com/GxAditya/ogimg"
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-foreground link-underline"
                    >
                        Read the source
                    </a>
                </div>

                <div className="border-t border-border">
                    {HOME_FAQS.map((faq, index) => (
                        <details key={faq.question} className="group border-b border-border">
                            <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_1fr_auto] items-start gap-3 px-2 py-4 text-left transition-colors duration-200 hover:bg-surface-sunken">
                                <span className="pt-0.5 font-mono text-[11px] text-border-strong transition-colors duration-200 group-hover:text-foreground">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[15px] text-foreground/90 transition-colors duration-200 group-hover:text-foreground">
                                    {faq.question}
                                </span>
                                <Plus
                                    size={16}
                                    className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:text-foreground group-open:rotate-45"
                                />
                            </summary>
                            <p className="max-w-[62ch] pb-5 pl-[3.25rem] pr-4 text-[14px] leading-relaxed text-muted-foreground">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
