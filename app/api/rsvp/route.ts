import { NextRequest, NextResponse } from "next/server";
import { appendRsvpRow, getInviteByCode } from "@/lib/googleSheets";
import { rsvpSchema } from "@/lib/validation";

export const runtime = "nodejs";

const REQUEST_WINDOW_MS = 15_000;
const requestTimes = new Map<string, number>();

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown-client";
}

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const lastRequestTime = requestTimes.get(clientKey);
  if (lastRequestTime && now - lastRequestTime < REQUEST_WINDOW_MS) {
    return true;
  }

  requestTimes.set(clientKey, now);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const clientKey = getClientKey(request);
    if (isRateLimited(clientKey)) {
      return NextResponse.json({ error: "Please wait a moment before sending another RSVP." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid RSVP data.", details: parsed.error.flatten() }, { status: 400 });
    }

    if (parsed.data.website.trim().length > 0) {
      return NextResponse.json({ error: "Invalid RSVP data." }, { status: 400 });
    }

    const invite = await getInviteByCode(parsed.data.inviteCode);
    if (!invite) {
      return NextResponse.json({ error: "Invitation code not found." }, { status: 400 });
    }

    if (parsed.data.guestCount > invite.maxGuestsAllowed) {
      return NextResponse.json(
        { error: `This invitation allows up to ${invite.maxGuestsAllowed} guest(s).` },
        { status: 400 }
      );
    }

    await appendRsvpRow(parsed.data, invite);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("RSVP submission failed", error);
    return NextResponse.json({ error: "Unable to save RSVP right now. Please try again later." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Missing invitation code." }, { status: 400 });
    }

    const invite = await getInviteByCode(code);
    if (!invite) {
      return NextResponse.json({ error: "Invitation code not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        inviteCode: invite.inviteCode,
        householdName: invite.householdName,
        maxGuestsAllowed: invite.maxGuestsAllowed,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Invite lookup failed", error);
    return NextResponse.json({ error: "Unable to validate invite code right now." }, { status: 500 });
  }
}
