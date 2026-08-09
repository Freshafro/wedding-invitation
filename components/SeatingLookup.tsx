"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SEATING_MIN_QUERY_LENGTH, normalizeName, type SeatingEntry } from "@/lib/seating";

type Locale = "en" | "fr";

/**
 * Results are tagged with the query that produced them. Rendering compares that
 * tag against the current query, so a stale response can never be shown next to
 * a newer query, and the effect never has to synchronously clear state.
 */
type Outcome = {
  key: string;
  matches: SeatingEntry[];
  failed: boolean;
};

/**
 * The table label sits in a display-sized slot sized for "7". A word like
 * "Chrysanthemes" at that size overflows a phone, and a single word cannot wrap
 * on its own, so the size steps down with length and long words are allowed to
 * break mid-word as a last resort.
 */
function tableLabelClasses(label: string): string {
  const length = label.trim().length;

  if (length <= 3) return "text-7xl leading-none sm:text-8xl";
  if (length <= 6) return "text-5xl leading-tight sm:text-6xl";
  if (length <= 14) return "text-4xl leading-tight sm:text-5xl";
  return "text-3xl leading-snug sm:text-4xl";
}

export function SeatingLookup({ locale = "en" }: { locale?: Locale }) {
  const [query, setQuery] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [selected, setSelected] = useState<SeatingEntry | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const copy = useMemo(
    () => ({
      en: {
        kicker: "Find your seat",
        label: "Your name",
        hint: "Type the first few letters of your first or last name.",
        searching: "Searching...",
        noResults: "We could not find that name. Try your last name, or fewer letters.",
        error: "Could not search right now. Please ask a member of the wedding party.",
        pickYourName: "Tap your name:",
        tableLabel: "Your table",
        seatedAs: "Seated as",
        searchAgain: "Look up another name",
        helpNote: "Not finding your name? Please see a member of the wedding party.",
      },
      fr: {
        kicker: "Trouvez votre place",
        label: "Votre nom",
        hint: "Saisissez les premières lettres de votre prénom ou de votre nom.",
        searching: "Recherche...",
        noResults: "Nom introuvable. Essayez votre nom de famille, ou moins de lettres.",
        error: "Recherche impossible pour le moment. Veuillez voir un membre du cortège.",
        pickYourName: "Touchez votre nom :",
        tableLabel: "Votre table",
        seatedAs: "Au nom de",
        searchAgain: "Rechercher un autre nom",
        helpNote: "Vous ne trouvez pas votre nom ? Veuillez voir un membre du cortège.",
      },
    }),
    []
  );

  const t = copy[locale];
  const normalizedQuery = normalizeName(query);
  const isSearchable = normalizedQuery.length >= SEATING_MIN_QUERY_LENGTH;
  const current = outcome && outcome.key === normalizedQuery ? outcome : null;
  const isSearching = isSearchable && !selected && current === null;

  useEffect(() => {
    if (selected || !isSearchable) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/seating?q=${encodeURIComponent(normalizedQuery)}`, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        if (!response.ok) {
          setOutcome({ key: normalizedQuery, matches: [], failed: true });
          return;
        }

        const data = (await response.json()) as { matches?: SeatingEntry[] };
        setOutcome({ key: normalizedQuery, matches: data.matches ?? [], failed: false });
      } catch {
        if (!controller.signal.aborted) {
          setOutcome({ key: normalizedQuery, matches: [], failed: true });
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [normalizedQuery, isSearchable, selected]);

  const reset = () => {
    setSelected(null);
    setQuery("");
    setOutcome(null);
    inputRef.current?.focus();
  };

  if (selected) {
    return (
      <div className="space-y-6 rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-6 text-center shadow-[0_14px_36px_rgba(51,44,48,0.12)] sm:p-8">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.12em]">{t.seatedAs}</p>
          <p className="font-display text-2xl leading-tight sm:text-3xl">{selected.fullName}</p>
        </div>

        <div className="space-y-2 border-t border-[var(--border-muted)] pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.12em]">{t.tableLabel}</p>
          <p
            className={`font-display lining-nums tabular-nums [overflow-wrap:anywhere] ${tableLabelClasses(
              selected.tableNumber
            )}`}
          >
            {selected.tableNumber}
          </p>
          {selected.tableName ? (
            <p className="font-display text-xl leading-8 sm:text-2xl">{selected.tableName}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={reset}
          className="w-full cursor-pointer rounded-xl border border-[var(--border-muted)] bg-white px-4 py-3 text-base font-semibold text-[#332c30] transition hover:bg-[var(--surface-warm)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2"
        >
          {t.searchAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-6 shadow-[0_14px_36px_rgba(51,44,48,0.12)] sm:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.12em]">{t.kicker}</p>

      <label className="block space-y-1">
        <span className="block text-base font-medium">{t.label}</span>
        <input
          ref={inputRef}
          className="w-full rounded-xl border border-[var(--border-muted)] bg-white px-3 py-3 font-display text-xl leading-7 tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/35 focus-visible:ring-offset-1 focus:border-[#332c30]/50"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-describedby="seating-hint"
        />
        <span id="seating-hint" className="block text-sm leading-5 text-[#4a4146]">
          {isSearching ? t.searching : t.hint}
        </span>
      </label>

      <div aria-live="polite">
        {current && !current.failed && current.matches.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#4a4146]">{t.pickYourName}</p>
            <ul className="space-y-2">
              {current.matches.map((match) => (
                <li key={`${match.fullName}-${match.tableNumber}`}>
                  <button
                    type="button"
                    onClick={() => setSelected(match)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border-muted)] bg-white px-4 py-3 text-left font-display text-lg leading-7 transition hover:bg-[var(--surface-warm)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40"
                  >
                    <span className="min-w-0 flex-1">{match.fullName}</span>
                    <span aria-hidden className="shrink-0 text-[#5c5358]">
                      &rsaquo;
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {current && !current.failed && current.matches.length === 0 ? (
          <p className="text-sm leading-6 text-[#4a4146]">{t.noResults}</p>
        ) : null}

        {current?.failed ? <p className="text-sm leading-6 text-red-600">{t.error}</p> : null}
      </div>

      <p className="border-t border-[var(--border-muted)] pt-4 text-sm leading-6 text-[#4a4146]">
        {t.helpNote}
      </p>
    </div>
  );
}
