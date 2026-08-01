import { google } from "googleapis";
import type { RsvpInput } from "@/lib/validation";
import { parseSeatingRows, type SeatingEntry } from "@/lib/seating";

export type InviteRecord = {
  inviteCode: string;
  householdName: string;
  maxGuestsAllowed: number;
  email?: string;
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getAuthClient() {
  const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  const auth = getAuthClient();
  return google.sheets({
    version: "v4",
    auth,
  });
}

export async function getInviteByCode(inviteCode: string): Promise<InviteRecord | null> {
  const spreadsheetId = getEnv("GOOGLE_SHEET_ID");
  const range = process.env.GOOGLE_INVITES_RANGE ?? "Invites!A:D";

  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const normalizedCode = inviteCode.trim().toUpperCase();
  const rows = response.data.values ?? [];

  for (const row of rows) {
    const [rowCode = "", householdName = "", maxGuestsRaw = "", email = ""] = row;
    if (String(rowCode).trim().toUpperCase() !== normalizedCode) {
      continue;
    }

    const maxGuestsAllowed = Number(maxGuestsRaw);
    if (!Number.isFinite(maxGuestsAllowed) || maxGuestsAllowed < 1) {
      return null;
    }

    return {
      inviteCode: normalizedCode,
      householdName: String(householdName).trim(),
      maxGuestsAllowed: Math.floor(maxGuestsAllowed),
      email: String(email).trim() || undefined,
    };
  }

  return null;
}

const SEATING_CACHE_TTL_MS = 60_000;

let seatingCache: { entries: SeatingEntry[]; fetchedAt: number } | null = null;
let seatingInFlight: Promise<SeatingEntry[]> | null = null;

async function fetchSeatingRoster(): Promise<SeatingEntry[]> {
  const spreadsheetId = getEnv("GOOGLE_SHEET_ID");
  const range = process.env.GOOGLE_SEATING_RANGE ?? "Seating!A:C";

  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

  return parseSeatingRows(response.data.values ?? []);
}

/**
 * Cached because ~150 guests scan within the same few minutes on arrival. Without
 * this every scan would be a Sheets API call, which is both slow at the door and
 * a good way to hit the per-minute read quota. In-flight requests share one fetch
 * so a cold start under load doesn't fan out into dozens of identical calls.
 */
export async function getSeatingRoster(): Promise<SeatingEntry[]> {
  if (seatingCache && Date.now() - seatingCache.fetchedAt < SEATING_CACHE_TTL_MS) {
    return seatingCache.entries;
  }

  if (seatingInFlight) {
    return seatingInFlight;
  }

  seatingInFlight = fetchSeatingRoster()
    .then((entries) => {
      seatingCache = { entries, fetchedAt: Date.now() };
      return entries;
    })
    .finally(() => {
      seatingInFlight = null;
    });

  try {
    return await seatingInFlight;
  } catch (error) {
    // Serve stale data rather than failing a guest standing at the entrance.
    if (seatingCache) {
      return seatingCache.entries;
    }
    throw error;
  }
}

export async function appendRsvpRow(data: RsvpInput, invite: InviteRecord): Promise<void> {
  const spreadsheetId = getEnv("GOOGLE_SHEET_ID");
  const range = process.env.GOOGLE_SHEET_RANGE ?? "RSVP!A:I";

  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          invite.inviteCode,
          invite.householdName,
          data.fullName,
          data.attendance,
          data.guestCount,
          data.additionalGuestNames.join(" | "),
          data.dietaryNotes,
          invite.maxGuestsAllowed,
        ],
      ],
    },
  });
}
