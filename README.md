## Wedding RSVP MVP

Simple Next.js website for collecting wedding RSVP responses and saving them to Google Sheets.

## Features

- Public RSVP form
- Invitation-code based access control per household
- Server-side validation
- Honeypot spam protection + basic rate limiting
- Google Sheets integration for response tracking

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in `.env.local`:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (replace line breaks with `\n`)
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SHEET_RANGE` (default `RSVP!A:I`)
   - `GOOGLE_INVITES_RANGE` (default `Invites!A:D`)
   - `GOOGLE_SEATING_RANGE` (default `Seating!A:C`)
   - `NEXT_PUBLIC_SITE_URL` (absolute site URL, used for link-preview images)

## Google Sheets Preparation

1. Create an `Invites` tab with columns:
   - `inviteCode` (unique, e.g. `BOUM001`)
   - `householdName`
   - `maxGuestsAllowed` (total number allowed in party, e.g. 1 or 2)
   - `email` (optional)
2. Create a `Seating` tab with columns (one row per **person**, not per household):
   - `fullName` (e.g. `Christella Emerusenge`) — accents and hyphens are fine, guests do not have to type them
   - `tableNumber` (e.g. `7`) — shown large on screen; can be text like `Head Table`
   - `tableName` (optional, e.g. `Table des Roses`) — shown under the number
   A header row is detected and skipped. Rows missing a name or table number are
   ignored, so a half-filled sheet sends the guest to a host instead of showing a
   blank table.
3. Create an `RSVP` tab with columns:
   - `submittedAt`
   - `inviteCode`
   - `householdName`
   - `fullName`
   - `attendance`
   - `guestCount`
   - `additionalGuestNames`
   - `dietaryNotes`
   - `maxGuestsAllowed`
4. Create a Google Cloud service account with Sheets API enabled.
5. Share the sheet with your service account email with Editor access.
6. Email each guest a personalized link like:
   - `https://your-domain.com/?code=BOUM001`

## Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy on Vercel and set the same environment variables in the project settings.

## API Contract

`POST /api/rsvp`

Expected payload:

- `inviteCode` (required, from invitation link/email)
- `fullName` (required)
- `attendance` (`yes` or `no`)
- `guestCount` (integer; `0` when attendance is `no`)
- `additionalGuestNames` (required when `guestCount > 1`; array of names)
- `dietaryNotes` (optional)
- `website` (hidden honeypot, must be empty)
