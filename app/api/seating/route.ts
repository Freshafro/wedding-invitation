import { NextRequest, NextResponse } from "next/server";
import { getSeatingRoster } from "@/lib/googleSheets";
import { normalizeName, searchSeating, SEATING_MIN_QUERY_LENGTH } from "@/lib/seating";

export const runtime = "nodejs";

/**
 * Deliberately not rate limited the way /api/rsvp is. Guests arrive on the venue
 * wifi, so they share one public IP: an x-forwarded-for limiter would read the
 * whole room as a single client and lock everyone out after the first scan.
 * The roster cache in getSeatingRoster keeps the Sheets API load flat instead.
 */
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") ?? "";

    if (normalizeName(query).length < SEATING_MIN_QUERY_LENGTH) {
      return NextResponse.json({ matches: [] }, { status: 200 });
    }

    const roster = await getSeatingRoster();
    const matches = searchSeating(query, roster);

    return NextResponse.json(
      { matches },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Seating lookup failed", error);
    return NextResponse.json({ error: "Unable to look up seating right now." }, { status: 500 });
  }
}
