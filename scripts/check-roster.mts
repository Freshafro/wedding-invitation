/**
 * Health check for the live Seating tab.
 *
 * Answers the question that matters on the day: can every guest in the sheet
 * actually find themselves by typing their own name? Run with:
 *   npm run check:roster
 *
 * Prints names only for rows that need attention, never the whole guest list.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { normalizeName, parseSeatingRows, searchSeating, type SeatingEntry } from "../lib/seating.ts";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

for (const line of fs.readFileSync(path.join(projectDir, ".env"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (!match) continue;
  let value = match[2].trim();
  if (value.length > 1 && /^(".*"|'.*')$/.test(value)) {
    value = value.slice(1, -1);
  }
  process.env[match[1]] ??= value;
}

const { google } = require("googleapis");

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const range = process.env.GOOGLE_SEATING_RANGE ?? "Seating!A:C";
const response = await google
  .sheets({ version: "v4", auth })
  .spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID, range });

const rawRows: unknown[][] = response.data.values ?? [];
const roster: SeatingEntry[] = parseSeatingRows(rawRows);

const nonEmptyRows = rawRows.filter((row) =>
  row.some((cell) => String(cell ?? "").trim() !== "")
).length;

console.log(`Range:          ${range}`);
console.log(`Rows with data: ${nonEmptyRows}`);
console.log(`Guests loaded:  ${roster.length}`);

const skipped = nonEmptyRows - roster.length;
if (skipped > 0) {
  console.log(`\n${skipped} row(s) ignored (header row, or missing a name / table number).`);
  rawRows
    .filter((row) => {
      const name = String(row?.[0] ?? "").trim();
      const table = String(row?.[1] ?? "").trim();
      return name !== "" && table === "";
    })
    .forEach((row) => console.log(`   no table yet: ${String(row[0]).trim()}`));
}

if (roster.length === 0) {
  console.log("\nNothing to check yet - add some rows and run this again.");
  process.exit(0);
}

// Duplicate names: both are returned, so the guest picks - but worth knowing.
const byName = new Map<string, SeatingEntry[]>();
for (const entry of roster) {
  const key = normalizeName(entry.fullName);
  byName.set(key, [...(byName.get(key) ?? []), entry]);
}
const duplicates = [...byName.values()].filter((group) => group.length > 1);

// The critical check: typing your own full name must surface you.
const unfindable: SeatingEntry[] = [];
const notTop: Array<{ entry: SeatingEntry; top: string }> = [];
for (const entry of roster) {
  const results = searchSeating(entry.fullName, roster);
  const hit = results.find((result) => normalizeName(result.fullName) === normalizeName(entry.fullName));
  if (!hit) {
    unfindable.push(entry);
  } else if (normalizeName(results[0].fullName) !== normalizeName(entry.fullName)) {
    notTop.push({ entry, top: results[0].fullName });
  }
}

// How many guests share a first name - they will see a short list, which is fine.
const firstNameCounts = new Map<string, number>();
for (const entry of roster) {
  const first = normalizeName(entry.fullName).split(" ")[0];
  firstNameCounts.set(first, (firstNameCounts.get(first) ?? 0) + 1);
}
const sharedFirstNames = [...firstNameCounts.values()].filter((count) => count > 1).length;

console.log("\n--- findability ---");
console.log(`Every guest finds themselves by full name: ${unfindable.length === 0 ? "YES" : "NO"}`);
if (unfindable.length > 0) {
  unfindable.forEach((entry) => console.log(`   NOT FOUND: ${entry.fullName}`));
}
if (notTop.length > 0) {
  console.log(`\n${notTop.length} guest(s) are found but not ranked first (still tappable in the list):`);
  notTop.forEach(({ entry, top }) => console.log(`   ${entry.fullName}  (top result: ${top})`));
}
if (duplicates.length > 0) {
  console.log(`\n${duplicates.length} duplicated name(s) - both rows show, guest picks:`);
  duplicates.forEach((group) =>
    console.log(`   ${group[0].fullName} -> tables ${group.map((entry) => entry.tableNumber).join(", ")}`)
  );
}

console.log(`\nFirst names shared by more than one guest: ${sharedFirstNames}`);
console.log(`Distinct tables: ${new Set(roster.map((entry) => entry.tableNumber)).size}`);

if (unfindable.length > 0) {
  process.exitCode = 1;
}
