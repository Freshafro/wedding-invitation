export type SeatingEntry = {
  fullName: string;
  tableNumber: string;
  tableName?: string;
};

export const SEATING_MIN_QUERY_LENGTH = 2;
export const SEATING_MAX_RESULTS = 8;

// Built from string literals rather than regex literals so this file stays pure
// ASCII. Combining marks are invisible in an editor and are easily mangled when
// a file is re-saved in another encoding.
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");
const IGNORABLE_PUNCTUATION = new RegExp("[\\u2018\\u2019\\u00b4'`.,]", "g");

/**
 * Folds a name down to something two people typing the same name on two phones
 * will agree on: no accents, no case, no punctuation, single spaces.
 * "Emerusenge-Boum" (with an accent) and "emerusenge boum" both become the same.
 */
export function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(IGNORABLE_PUNCTUATION, "")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(normalized: string): string[] {
  return normalized.length === 0 ? [] : normalized.split(" ");
}

/**
 * Edit distance, abandoned early once it exceeds `max`. Bounded because we only
 * ever care about "close enough to be a typo", never the true distance.
 */
function boundedEditDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) {
    return max + 1;
  }

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    let rowBest = i;

    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + substitutionCost
      );
      current.push(value);
      rowBest = Math.min(rowBest, value);
    }

    if (rowBest > max) {
      return max + 1;
    }
    previous = current;
  }

  return previous[b.length];
}

function typoBudget(token: string): number {
  if (token.length <= 3) return 0;
  if (token.length <= 6) return 1;
  return 2;
}

/**
 * Scores one roster entry against the query. Higher is better; null means "not a
 * match". The tiers are ordered so that confident matches always outrank fuzzy
 * ones, which keeps the guest's own name at the top of the list.
 */
function scoreEntry(queryNormalized: string, queryTokens: string[], entryNormalized: string): number | null {
  if (entryNormalized === queryNormalized) {
    return 1000;
  }

  if (entryNormalized.startsWith(queryNormalized)) {
    return 900 - Math.min(99, entryNormalized.length - queryNormalized.length);
  }

  const entryTokens = tokenize(entryNormalized);

  // Every typed word is the start of a different word in the name, in any order.
  // Handles "emer chris" -> "Christella Emerusenge".
  const availableForPrefix = [...entryTokens];
  const everyTokenPrefixes = queryTokens.every((queryToken) => {
    const index = availableForPrefix.findIndex((entryToken) => entryToken.startsWith(queryToken));
    if (index === -1) {
      return false;
    }
    availableForPrefix.splice(index, 1);
    return true;
  });
  if (everyTokenPrefixes) {
    return 800 - Math.min(99, entryNormalized.length - queryNormalized.length);
  }

  if (entryNormalized.includes(queryNormalized)) {
    return 700;
  }

  // Last resort: allow typos, scaled to word length so short words stay strict.
  const availableForFuzzy = [...entryTokens];
  let totalDistance = 0;
  const everyTokenFuzzy = queryTokens.every((queryToken) => {
    const budget = typoBudget(queryToken);
    if (budget === 0) {
      const index = availableForFuzzy.findIndex((entryToken) => entryToken.startsWith(queryToken));
      if (index === -1) {
        return false;
      }
      availableForFuzzy.splice(index, 1);
      return true;
    }

    let bestIndex = -1;
    let bestDistance = budget + 1;
    for (let i = 0; i < availableForFuzzy.length; i += 1) {
      const distance = boundedEditDistance(queryToken, availableForFuzzy[i], budget);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }

    if (bestIndex === -1 || bestDistance > budget) {
      return false;
    }
    availableForFuzzy.splice(bestIndex, 1);
    totalDistance += bestDistance;
    return true;
  });

  if (everyTokenFuzzy) {
    return 600 - totalDistance * 10;
  }

  return null;
}

const SEATING_HEADER_LABELS = new Set([
  "fullname",
  "full name",
  "name",
  "guest",
  "nom",
  "nom complet",
  "invite",
]);

/**
 * Turns raw sheet rows into roster entries. Kept here (rather than beside the
 * Sheets client) so it stays pure and directly testable.
 */
export function parseSeatingRows(rows: unknown[][]): SeatingEntry[] {
  return rows.reduce<SeatingEntry[]>((entries, row) => {
    const fullName = String(row?.[0] ?? "").trim();
    const tableNumber = String(row?.[1] ?? "").trim();
    const tableName = String(row?.[2] ?? "").trim();

    // A guest with no table yet is worse than no result at all: it would show an
    // empty table on screen instead of sending them to a host.
    if (!fullName || !tableNumber) {
      return entries;
    }

    if (entries.length === 0 && SEATING_HEADER_LABELS.has(normalizeName(fullName))) {
      return entries;
    }

    entries.push({ fullName, tableNumber, tableName: tableName || undefined });
    return entries;
  }, []);
}

export function searchSeating(
  query: string,
  roster: SeatingEntry[],
  limit: number = SEATING_MAX_RESULTS
): SeatingEntry[] {
  const queryNormalized = normalizeName(query);
  if (queryNormalized.length < SEATING_MIN_QUERY_LENGTH) {
    return [];
  }

  const queryTokens = tokenize(queryNormalized);

  return roster
    .map((entry) => ({ entry, score: scoreEntry(queryNormalized, queryTokens, normalizeName(entry.fullName)) }))
    .filter((scored): scored is { entry: SeatingEntry; score: number } => scored.score !== null)
    .sort((a, b) => b.score - a.score || a.entry.fullName.localeCompare(b.entry.fullName))
    .slice(0, limit)
    .map((scored) => scored.entry);
}
