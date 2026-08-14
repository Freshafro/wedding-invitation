// Relative rather than "@/lib/seating": scripts/ imports this under bare
// `node --experimental-strip-types`, which does not resolve tsconfig path aliases.
import { normalizeName } from "./seating.ts";

/**
 * The Grand Salon, traced from the venue's floor plan. Coordinates are unitless;
 * only relative positions matter. Orientation matches the printed plan and is not
 * rotated for the guest: head table along the top, DJ and buffets along the
 * bottom, entrance bottom-right.
 *
 * This is the only file to edit if the room is re-arranged.
 */

export type FloorPlanTable = {
  /** Must match column B of the Seating sheet, accents and case aside. */
  id: string;
  /** Column C of the sheet, and the number written on the venue's plan. */
  number: number;
  x: number;
  y: number;
};

export type FloorPlanFixture = {
  id: string;
  labelEn: string;
  labelFr: string;
  x: number;
  y: number;
  width: number;
  height: number;
  variant: "stage" | "dancefloor" | "service" | "entrance";
};

export const ROOM = {
  width: 100,
  height: 72,
  // Small because the room really is this tightly packed, which is why the
  // circles carry table numbers rather than country names.
  tableRadius: 3.1,
} as const;

/**
 *   LEFT BLOCK (bar side)            RIGHT BLOCK (entrance side)
 *     outer: 19 21 25 23              inner: 1 2 3 5
 *     mid:   15 14 20 24 22           mid:   7 6 8 9
 *     inner: 13 17 18 16              outer: 4 10 11 12
 *
 * Middle columns sit half a row off their neighbours. On the left that pairs the
 * middle and inner columns, with the outer column offset from both: it was moved
 * up toward the bar when the bottom row shifted, rather than gaining a table at
 * the far end.
 *
 * Positions come from a uniform grid rather than per-table tracing: the plan was
 * photographed at an angle, and eyeballed coordinates carried enough jitter to
 * look sloppy on screen.
 */
const COLUMN_PITCH = 8;
const ROW_PITCH = 8;
const STAGGER = ROW_PITCH / 2;
const FIRST_ROW_Y = 15.5;

const LEFT_BLOCK_X = [0, 1, 2].map((i) => 16.5 + i * COLUMN_PITCH);
const RIGHT_BLOCK_X = [0, 1, 2].map((i) => 70 + i * COLUMN_PITCH);

function row(index: number, staggered = false): number {
  return FIRST_ROW_Y + index * ROW_PITCH + (staggered ? STAGGER : 0);
}

export const FLOOR_PLAN_TABLES: FloorPlanTable[] = [
  // Right block, inner column.
  { number: 1, id: "Allemagne", x: RIGHT_BLOCK_X[0], y: row(0) },
  { number: 2, id: "Curaçao", x: RIGHT_BLOCK_X[0], y: row(1) },
  { number: 3, id: "Portugal", x: RIGHT_BLOCK_X[0], y: row(2) },
  { number: 5, id: "Suisse", x: RIGHT_BLOCK_X[0], y: row(3) },

  // Right block, middle column - staggered half a row down.
  { number: 7, id: "Belgique", x: RIGHT_BLOCK_X[1], y: row(0, true) },
  { number: 6, id: "France", x: RIGHT_BLOCK_X[1], y: row(1, true) },
  { number: 8, id: "Côte d'Ivoire", x: RIGHT_BLOCK_X[1], y: row(2, true) },
  { number: 9, id: "Panama", x: RIGHT_BLOCK_X[1], y: row(3, true) },

  // Right block, outer column.
  { number: 4, id: "Afrique du Sud", x: RIGHT_BLOCK_X[2], y: row(0) },
  { number: 10, id: "Australie", x: RIGHT_BLOCK_X[2], y: row(1) },
  { number: 11, id: "Pays-Bas", x: RIGHT_BLOCK_X[2], y: row(2) },
  { number: 12, id: "Norvège", x: RIGHT_BLOCK_X[2], y: row(3) },

  // Left block, inner column - shifted half a row down, onto the middle column's
  // line.
  { number: 13, id: "Cap-Vert", x: LEFT_BLOCK_X[2], y: row(0, true) },
  { number: 17, id: "Suède", x: LEFT_BLOCK_X[2], y: row(1, true) },
  { number: 18, id: "Espagne", x: LEFT_BLOCK_X[2], y: row(2, true) },
  { number: 16, id: "Sénégal", x: LEFT_BLOCK_X[2], y: row(3, true) },

  // Left block, middle column.
  { number: 15, id: "Japon", x: LEFT_BLOCK_X[1], y: row(0, true) },
  { number: 14, id: "Congo", x: LEFT_BLOCK_X[1], y: row(1, true) },
  { number: 20, id: "Autriche", x: LEFT_BLOCK_X[1], y: row(2, true) },
  { number: 24, id: "Angleterre", x: LEFT_BLOCK_X[1], y: row(3, true) },
  { number: 22, id: "Ghana", x: LEFT_BLOCK_X[1], y: row(4, true) },

  // Left block, outer column - moved one row up toward the bar.
  { number: 19, id: "Brésil", x: LEFT_BLOCK_X[0], y: row(1) },
  { number: 21, id: "Canada", x: LEFT_BLOCK_X[0], y: row(2) },
  { number: 25, id: "Haïti", x: LEFT_BLOCK_X[0], y: row(3) },
  { number: 23, id: "Corée du Sud", x: LEFT_BLOCK_X[0], y: row(4) },
];

export const FLOOR_PLAN_FIXTURES: FloorPlanFixture[] = [
  {
    id: "stage",
    labelEn: "Head table",
    labelFr: "Table d'honneur",
    x: 37.4,
    y: 2.0,
    width: 29,
    height: 4.6,
    variant: "stage",
  },
  {
    id: "bar",
    labelEn: "Bar",
    labelFr: "Bar",
    x: 0,
    y: 8.5,
    width: 9.4,
    height: 13.8,
    variant: "service",
  },
  {
    id: "dancefloor",
    labelEn: "Dance floor",
    labelFr: "Piste de danse",
    x: 38,
    y: 12,
    width: 25,
    height: 46,
    variant: "dancefloor",
  },
  {
    id: "buffet-left",
    labelEn: "Buffet",
    labelFr: "Buffet",
    x: 15,
    y: 63,
    width: 21,
    height: 4.6,
    variant: "service",
  },
  {
    id: "dj",
    labelEn: "DJ",
    labelFr: "DJ",
    x: 42.1,
    y: 63,
    width: 18.6,
    height: 4.6,
    variant: "service",
  },
  {
    id: "buffet-right",
    labelEn: "Buffet",
    labelFr: "Buffet",
    x: 63,
    y: 63,
    width: 20,
    height: 4.6,
    variant: "service",
  },
  {
    id: "photobooth",
    labelEn: "Photo booth",
    labelFr: "Photo booth",
    x: 86,
    y: 46,
    width: 13,
    height: 13,
    variant: "service",
  },
  // Where the QR code is scanned, so it is drawn heavier than the rest.
  {
    id: "entrance",
    labelEn: "Entrance",
    labelFr: "Entrée",
    x: 85,
    y: 63,
    width: 14,
    height: 4.6,
    variant: "entrance",
  },
];

/**
 * The country (column B) is the primary key; the number (column C) is a fallback
 * so a country respelled in the sheet still lands on the right circle rather than
 * silently dropping the map.
 */
export function findFloorPlanTable(
  tableId: string,
  tableNumber?: string
): FloorPlanTable | null {
  const target = normalizeName(tableId);
  const byName = FLOOR_PLAN_TABLES.find((table) => normalizeName(table.id) === target);
  if (byName) {
    return byName;
  }

  const parsed = Number(String(tableNumber ?? "").trim());
  if (Number.isInteger(parsed)) {
    return FLOOR_PLAN_TABLES.find((table) => table.number === parsed) ?? null;
  }

  return null;
}

/**
 * Written for a guest standing at the entrance, which is where the QR code is.
 * Facing up the room, their left and right already match the map's. Depth is
 * phrased against the room so it composes with `side` without naming the entrance
 * twice for the tables sitting beside it.
 */
export function describeTableLocation(
  table: FloorPlanTable,
  locale: "en" | "fr"
): string {
  const side =
    table.x < 40
      ? {
          en: "on the left, across the dance floor",
          fr: "à gauche, de l'autre côté de la piste",
        }
      : { en: "on the right", fr: "à droite" };

  const depth =
    table.y < 26
      ? { en: "at the far end, by the head table", fr: "tout au fond, près de la table d'honneur" }
      : table.y > 42
        ? { en: "toward the entrance end of the room", fr: "vers l'entrée de la salle" }
        : { en: "about halfway up the room", fr: "à mi-chemin dans la salle" };

  return locale === "fr"
    ? `${capitalize(depth.fr)}, ${side.fr}.`
    : `${capitalize(depth.en)}, ${side.en}.`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
