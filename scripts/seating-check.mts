import { parseSeatingRows, searchSeating } from "../lib/seating.ts";

let pass = 0;
let total = 0;

function check(label: string, actual: unknown, expected: unknown) {
  total += 1;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) {
    console.log(`        actual:   ${JSON.stringify(actual)}`);
    console.log(`        expected: ${JSON.stringify(expected)}`);
  }
}

console.log("-- parseSeatingRows --");

check(
  "header row is skipped",
  parseSeatingRows([
    ["fullName", "tableNumber", "tableName"],
    ["Christella Emerusenge", "1", "Head Table"],
  ]),
  [{ fullName: "Christella Emerusenge", tableNumber: "1", tableName: "Head Table" }]
);

check(
  "French header is skipped",
  parseSeatingRows([
    ["Nom complet", "Table", ""],
    ["Joze Tuyisenge", "3", ""],
  ]),
  [{ fullName: "Joze Tuyisenge", tableNumber: "3", tableName: undefined }]
);

check(
  "no header is fine",
  parseSeatingRows([["Georges Anthony Boum", "1", ""]]),
  [{ fullName: "Georges Anthony Boum", tableNumber: "1", tableName: undefined }]
);

check(
  "row with no table number is dropped",
  parseSeatingRows([
    ["Unassigned Guest", "", ""],
    ["Seated Guest", "4", ""],
  ]),
  [{ fullName: "Seated Guest", tableNumber: "4", tableName: undefined }]
);

check("row with no name is dropped", parseSeatingRows([["", "4", "Roses"]]), []);

check("blank trailing rows are dropped", parseSeatingRows([[], [""], ["  ", "  "]]), []);

check(
  "whitespace is trimmed",
  parseSeatingRows([["  Marie-Ange Kabila  ", "  7  ", "  Table des Roses  "]]),
  [{ fullName: "Marie-Ange Kabila", tableNumber: "7", tableName: "Table des Roses" }]
);

check(
  "short rows (missing columns) are handled",
  parseSeatingRows([["Solo Name", "9"]]),
  [{ fullName: "Solo Name", tableNumber: "9", tableName: undefined }]
);

check(
  "non-numeric table label is allowed",
  parseSeatingRows([["Rosa Marie Ngo Um", "Head Table", ""]]),
  [{ fullName: "Rosa Marie Ngo Um", tableNumber: "Head Table", tableName: undefined }]
);

check("empty sheet yields empty roster", parseSeatingRows([]), []);

console.log("\n-- end-to-end: parse then search --");
const roster = parseSeatingRows([
  ["fullName", "tableNumber", "tableName"],
  ["Christella Emerusenge", "1", "Head Table"],
  ["Georges Anthony Boum", "1", "Head Table"],
  ["Marie-Ange Kabila", "7", "Table des Roses"],
  ["Not Seated Yet", "", ""],
]);

check("roster size after header + incomplete row removed", roster.length, 3);
check(
  "typo'd accented search finds the right guest and table",
  searchSeating("cristella", roster).map(
    (entry: { fullName: string; tableNumber: string }) => `${entry.fullName} -> ${entry.tableNumber}`
  ),
  ["Christella Emerusenge -> 1"]
);
check(
  "guest without a table is never returned",
  searchSeating("not seated", roster),
  []
);
check(
  "table name is carried through",
  searchSeating("marie ange", roster)[0]?.tableName,
  "Table des Roses"
);

console.log(`\n${pass}/${total} checks passed`);
if (pass !== total) process.exitCode = 1;
