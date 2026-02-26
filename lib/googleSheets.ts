import { google } from "googleapis";
import type { RsvpInput } from "@/lib/validation";

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

export async function appendRsvpRow(data: RsvpInput, invite: InviteRecord): Promise<void> {
  const spreadsheetId = getEnv("GOOGLE_SHEET_ID");
  const range = process.env.GOOGLE_SHEET_RANGE ?? "RSVP!A:I";

  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
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
