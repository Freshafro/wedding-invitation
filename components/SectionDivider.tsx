export function SectionDivider({ textClassName = "" }: { textClassName?: string }) {
  return (
    <div className="my-10 flex items-center justify-center gap-3 py-0.5" aria-hidden>
      <span className="h-px w-24 bg-[var(--border-muted)]/70" />
      <span className={`${textClassName} px-2 text-2xl leading-none tracking-[0.08em] text-[var(--border-muted)]/90`}>
        G<span className="text-[0.8em]">&amp;</span>C
      </span>
      <span className="h-px w-24 bg-[var(--border-muted)]/70" />
    </div>
  );
}