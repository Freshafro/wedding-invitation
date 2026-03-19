export function SectionDivider() {
  return (
    <div className="my-10 flex items-center justify-center gap-3 py-0.5" aria-hidden>
      <span className="h-px w-16 bg-[var(--border-muted)]/70" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-muted)]" />
      <span className="h-px w-16 bg-[var(--border-muted)]/70" />
    </div>
  );
}
