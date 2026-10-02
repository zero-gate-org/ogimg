"use client";

import { CaretDown } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { TEMPLATE_FONT_OPTIONS, type TemplateFontId } from "../templates/fontCatalog";
import { getTemplateFontFamily } from "../templates/fontCatalog";
import { usePanelSection, usePanelState } from "./panelState";

/**
 * Shared control primitives for the editor panels.
 * Every input keeps a visible label above it and a helper or error line below,
 * so no field relies on placeholder text as its label.
 */

export const inputClass =
    "w-full h-10 bg-surface-sunken border border-border px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none transition-colors";

const PANEL_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Collapsible group inside an editor panel.
 *
 * Every group registers itself with the panel, which is what lets the panel
 * offer collapse all without knowing what the groups contain. Groups start open
 * so nothing is hidden on first load.
 */
export function PanelSection({
    title,
    sectionKey,
    action,
    children,
}: {
    title: string;
    /** Stable id used by the panel level collapse all control. */
    sectionKey: string;
    action?: ReactNode;
    children: ReactNode;
}) {
    const { isOpen, toggle } = usePanelSection(sectionKey);
    const reduce = useReducedMotion();

    return (
        <section className="border-t border-border first:border-t-0">
            <div className="flex items-center gap-1 px-4 py-2.5">
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={isOpen}
                    className="flex min-w-0 flex-1 items-center justify-between gap-2 py-0.5 text-left transition-colors hover:text-foreground"
                >
                    <span className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {title}
                    </span>
                    <CaretDown
                        size={13}
                        className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>
                {action}
            </div>

            <AnimatePresence initial={false}>
                {isOpen ? (
                    <motion.div
                        key="body"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: PANEL_EASE }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-5 pt-1">{children}</div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </section>
    );
}

/** Panel level control that closes or opens every group in the panel at once. */
export function PanelCollapseAll() {
    const { hasCollapsed, collapseAll, expandAll } = usePanelState();
    const label = hasCollapsed ? "Expand all" : "Collapse all";

    return (
        <button
            type="button"
            onClick={hasCollapsed ? expandAll : collapseAll}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
            <CaretDown
                size={11}
                className={`transition-transform duration-200 ${hasCollapsed ? "" : "rotate-180"}`}
            />
            {label}
        </button>
    );
}

export function Field({
    label,
    hint,
    htmlFor,
    children,
}: {
    label: string;
    hint?: string;
    htmlFor?: string;
    children: ReactNode;
}) {
    return (
        <div className="mb-4 last:mb-0">
            <label
                htmlFor={htmlFor}
                className="mb-1.5 block text-[12px] font-medium text-foreground/85"
            >
                {label}
            </label>
            {children}
            {hint ? <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{hint}</p> : null}
        </div>
    );
}

export function TextInput({
    id,
    value,
    onChange,
    placeholder,
    multiline = false,
    rows = 3,
}: {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
}) {
    const shared = {
        id,
        value,
        placeholder,
        className: inputClass,
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange(event.target.value),
    };

    return multiline ? (
        <textarea {...shared} rows={rows} className={`${inputClass} h-auto py-2 leading-relaxed resize-y`} />
    ) : (
        <input {...shared} type="text" />
    );
}

export function NumberInput({
    id,
    value,
    onChange,
    min,
    max,
    step = 1,
    suffix,
}: {
    id?: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
}) {
    return (
        <div className="relative">
            <input
                id={id}
                type="number"
                value={Number.isFinite(value) ? value : 0}
                min={min}
                max={max}
                step={step}
                onChange={(event) => {
                    const next = Number(event.target.value);
                    if (!Number.isNaN(next)) onChange(next);
                }}
                className={`${inputClass} ${suffix ? "pr-9" : ""} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
            {suffix ? (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-muted-foreground">
                    {suffix}
                </span>
            ) : null}
        </div>
    );
}

export function ColorInput({
    id,
    value,
    onChange,
    swatches,
}: {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    swatches?: readonly string[];
}) {
    const normalized = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";

    return (
        <div className="flex items-center gap-2">
            <input
                id={id}
                type="color"
                value={normalized}
                onChange={(event) => onChange(event.target.value)}
                className="h-10 w-10 shrink-0 border border-border bg-surface-sunken"
                aria-label="Pick a colour"
            />
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={`${inputClass} font-mono uppercase`}
                aria-label="Colour hex value"
                spellCheck={false}
            />
            {swatches ? (
                <div className="grid shrink-0 grid-cols-2 gap-1">
                    {swatches.map((swatch) => (
                        <button
                            key={swatch}
                            type="button"
                            onClick={() => onChange(swatch)}
                            style={{ background: swatch }}
                            className={`h-4 w-4 border transition-transform hover:scale-110 ${
                                value.toLowerCase() === swatch.toLowerCase() ? "border-foreground" : "border-border"
                            }`}
                            aria-label={`Use ${swatch}`}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export function SelectInput<T extends string>({
    id,
    value,
    options,
    onChange,
}: {
    id?: string;
    value: T;
    options: readonly { value: T; label: string }[];
    onChange: (value: T) => void;
}) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value as T)}
                className={`${inputClass} appearance-none pr-8`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <CaretDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
        </div>
    );
}

export function SegmentedControl<T extends string>({
    value,
    options,
    onChange,
    ariaLabel,
    renderOption,
    className = "",
}: {
    value: T;
    options: readonly { value: T; label: ReactNode; title?: string }[];
    onChange: (value: T) => void;
    ariaLabel: string;
    renderOption?: (option: { value: T; label: ReactNode; title?: string }) => ReactNode;
    className?: string;
}) {
    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={`flex border border-border bg-surface-sunken p-0.5 ${className}`}
        >
            {options.map((option) => {
                const active = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        title={option.title}
                        aria-pressed={active}
                        onClick={() => onChange(option.value)}
                        className={`flex flex-1 items-center justify-center gap-1 px-2 py-1.5 text-[12px] font-medium transition-colors ${
                            active
                                ? "bg-brand text-brand-ink"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {renderOption ? renderOption(option) : option.label}
                    </button>
                );
            })}
        </div>
    );
}

export function Toggle({
    checked,
    onChange,
    label,
    id,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    id?: string;
}) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex w-full items-center justify-between gap-3 py-1 text-left"
        >
            <span className="text-[12px] font-medium text-foreground/85">{label}</span>
            <span
                className={`relative h-4 w-7 shrink-0 border transition-colors ${
                    checked ? "border-brand bg-brand" : "border-border-strong bg-surface-sunken"
                }`}
            >
                <span
                    className={`absolute top-[1px] h-[14px] w-[14px] transition-transform ${
                        checked ? "translate-x-[15px] bg-brand-ink" : "translate-x-[1px] bg-muted-foreground"
                    }`}
                />
            </span>
        </button>
    );
}

export function SliderField({
    id,
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    display,
}: {
    id?: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    display?: string;
}) {
    return (
        <Field label={label} htmlFor={id}>
            <div className="flex items-center gap-3">
                <input
                    id={id}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(event) => onChange(Number(event.target.value))}
                    className="h-4 flex-1"
                />
                <span className="w-14 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
                    {display ?? value}
                </span>
            </div>
        </Field>
    );
}

export function FontSelect({
    id,
    value,
    onChange,
}: {
    id?: string;
    value: TemplateFontId;
    onChange: (value: TemplateFontId) => void;
}) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value as TemplateFontId)}
                className={`${inputClass} appearance-none pr-8`}
                style={{ fontFamily: getTemplateFontFamily(value) }}
            >
                {TEMPLATE_FONT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id} style={{ fontFamily: option.fontFamily }}>
                        {option.label}
                    </option>
                ))}
            </select>
            <CaretDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
        </div>
    );
}

/**
 * Panel tab strip. Tabs wrap onto a second row instead of scrolling sideways,
 * so the rail never needs a horizontal scrollbar.
 */
export function PanelTabs<T extends string>({
    tabs,
    value,
    onChange,
    ariaLabel,
}: {
    tabs: readonly { id: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
    ariaLabel: string;
}) {
    return (
        <div role="tablist" aria-label={ariaLabel} className="flex shrink-0 flex-wrap border-b border-border">
            {tabs.map((tab) => {
                const active = tab.id === value;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(tab.id)}
                        className={`min-w-[86px] flex-1 basis-[30%] border-b-2 px-2 py-2.5 text-[11px] font-medium transition-colors ${
                            active
                                ? "border-brand text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

export function PanelEmptyState({
    title,
    body,
    action,
}: {
    title: string;
    body: string;
    action?: ReactNode;
}) {
    return (
        <div className="border border-dashed border-border px-4 py-6 text-center">
            <p className="text-[13px] font-medium text-foreground">{title}</p>
            <p className="mx-auto mt-1.5 max-w-[36ch] text-[12px] leading-relaxed text-muted-foreground">
                {body}
            </p>
            {action ? <div className="mt-3 flex justify-center">{action}</div> : null}
        </div>
    );
}

export function PrimaryButton({
    children,
    onClick,
    disabled,
    type = "button",
    className = "",
    title,
}: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit";
    className?: string;
    title?: string;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`inline-flex h-10 items-center justify-center gap-2 bg-brand px-4 text-[13px] font-semibold text-brand-ink transition-colors hover:bg-brand-strong active:translate-y-px disabled:cursor-not-allowed disabled:bg-border-strong disabled:text-muted-foreground ${className}`}
        >
            {children}
        </button>
    );
}

export function GhostButton({
    children,
    onClick,
    disabled,
    className = "",
    title,
    type = "button",
}: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    title?: string;
    type?: "button" | "submit";
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`inline-flex h-10 items-center justify-center gap-2 border border-border bg-surface px-3 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-raised active:translate-y-px disabled:cursor-not-allowed disabled:text-muted-foreground ${className}`}
        >
            {children}
        </button>
    );
}

export function IconButton({
    children,
    onClick,
    label,
    active = false,
    disabled = false,
    className = "",
}: {
    children: ReactNode;
    onClick?: () => void;
    label: string;
    active?: boolean;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={`inline-flex h-8 w-8 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground ${
                active
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
            } ${className}`}
        >
            {children}
        </button>
    );
}