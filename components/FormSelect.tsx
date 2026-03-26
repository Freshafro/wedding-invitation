"use client";

import { useEffect, useId, useRef, useState } from "react";

export type FormSelectOption = {
  value: string;
  label: string;
};

export function FormSelect({
  value,
  onChange,
  options,
  disabled,
  className,
  "aria-invalid": ariaInvalid,
}: {
  value: string;
  onChange: (next: string) => void;
  options: FormSelectOption[];
  disabled?: boolean;
  className: string;
  "aria-invalid"?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? "";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={`${className} flex w-full min-h-[2.875rem] items-center justify-between gap-2 text-left ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => {
          if (!disabled) {
            setOpen((previous) => !previous);
          }
        }}
      >
        <span className={`min-w-0 flex-1 truncate ${displayLabel ? "" : "text-[#5c5358]/60"}`}>
          {displayLabel || "\u00a0"}
        </span>
        <span className="shrink-0 text-[#5c5358]" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[var(--border-muted)] bg-white py-1 font-display text-base leading-6 lining-nums shadow-[0_12px_28px_rgba(51,44,48,0.12)] tabular-nums tracking-wide"
        >
          {options.map((option) => (
            <li key={option.value === "" ? "__empty__" : option.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === option.value}
                className="w-full px-3 py-2.5 text-left transition hover:bg-[var(--surface-soft)] focus:bg-[var(--surface-soft)] focus:outline-none"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label || "\u00a0"}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
