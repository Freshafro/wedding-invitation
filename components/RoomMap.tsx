import {
  FLOOR_PLAN_FIXTURES,
  FLOOR_PLAN_TABLES,
  ROOM,
  describeTableLocation,
  findFloorPlanTable,
} from "@/lib/floorPlan";
import { normalizeName } from "@/lib/seating";

type Locale = "en" | "fr";

const COPY = {
  en: { heading: "Where that is", table: "Table" },
  fr: { heading: "Où se trouve la table", table: "Table" },
} as const;

const INK = "#332c30";
const MUTED = "#8c8288";

/**
 * Sizes and wraps a fixture's label to fit its box, which SVG text will not do on
 * its own. Advances are rough em averages for this serif stack; bold gets a wider
 * one, without which "Entrance" overflowed.
 */
function fitFixtureLabel(label: string, boxWidth: number, baseSize: number, bold = false) {
  const advance = bold ? 0.56 : 0.5;
  const usable = boxWidth * 0.9;
  const words = label.split(/\s+/);
  const longestWord = Math.max(...words.map((word) => word.length));

  // A single word cannot be broken, so it sets the ceiling on the font size.
  const fontSize = Math.min(baseSize, usable / (longestWord * advance));
  const maxChars = Math.max(1, Math.floor(usable / (fontSize * advance)));

  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);

  return { fontSize, lines };
}

export function RoomMap({
  activeTableId,
  activeTableNumber,
  locale = "en",
}: {
  activeTableId: string;
  activeTableNumber?: string;
  locale?: Locale;
}) {
  const activeTable = findFloorPlanTable(activeTableId, activeTableNumber);

  // Rather than draw a map with nothing highlighted, show none at all - the table
  // name above it still stands.
  if (!activeTable) {
    return null;
  }

  const t = COPY[locale];
  const activeKey = normalizeName(activeTable.id);

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.12em]">{t.heading}</p>

      <svg
        viewBox={`0 0 ${ROOM.width} ${ROOM.height}`}
        className="w-full rounded-2xl border border-[var(--border-muted)] bg-white"
        role="img"
        aria-label={`${t.table} ${activeTable.number}, ${activeTable.id}. ${describeTableLocation(
          activeTable,
          locale
        )}`}
      >
        {FLOOR_PLAN_FIXTURES.map((fixture) => {
          const isDanceFloor = fixture.variant === "dancefloor";
          const isEntrance = fixture.variant === "entrance";
          const label = locale === "fr" ? fixture.labelFr : fixture.labelEn;
          const { fontSize, lines } = fitFixtureLabel(
            label,
            fixture.width,
            fixture.variant === "stage" ? 3 : 2.7,
            isEntrance
          );
          const centreY = fixture.y + fixture.height / 2;
          const firstLineOffset = -((lines.length - 1) * fontSize * 0.58) / 2;

          return (
            <g key={fixture.id}>
              <rect
                x={fixture.x}
                y={fixture.y}
                width={fixture.width}
                height={fixture.height}
                rx={2}
                fill={isDanceFloor ? "transparent" : "var(--surface-soft)"}
                stroke={isEntrance ? INK : "var(--border-muted)"}
                strokeWidth={isEntrance ? 0.7 : 0.4}
                strokeDasharray={isDanceFloor ? "1.6 1.4" : undefined}
              />
              <text
                x={fixture.x + fixture.width / 2}
                y={centreY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={fontSize}
                fontWeight={isEntrance ? 700 : 400}
                fill={isEntrance ? INK : MUTED}
                style={{ fontFamily: "var(--font-cormorant-garamond), Georgia, serif" }}
              >
                {lines.map((line, index) => (
                  <tspan
                    key={line}
                    x={fixture.x + fixture.width / 2}
                    dy={index === 0 ? firstLineOffset : fontSize * 1.16}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {FLOOR_PLAN_TABLES.map((table) => {
          const isActive = normalizeName(table.id) === activeKey;
          return (
            <g key={table.number}>
              {isActive ? (
                <circle
                  cx={table.x}
                  cy={table.y}
                  r={ROOM.tableRadius + 1.8}
                  fill="none"
                  stroke={INK}
                  strokeWidth={0.5}
                  opacity={0.5}
                />
              ) : null}
              <circle
                cx={table.x}
                cy={table.y}
                r={ROOM.tableRadius}
                fill={isActive ? INK : "#ffffff"}
                stroke={isActive ? INK : "var(--border-muted)"}
                strokeWidth={isActive ? 0.6 : 0.4}
              />
              <text
                x={table.x}
                y={table.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={3}
                fontWeight={isActive ? 700 : 400}
                fill={isActive ? "#ffffff" : MUTED}
                style={{ fontFamily: "var(--font-cormorant-garamond), Georgia, serif" }}
              >
                {table.number}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="text-sm leading-6 text-[#4a4146]">
        <span className="font-semibold text-[#332c30]">
          {t.table} {activeTable.number} &middot; {activeTable.id}
        </span>{" "}
        &mdash; {describeTableLocation(activeTable, locale)}
      </p>
    </div>
  );
}
