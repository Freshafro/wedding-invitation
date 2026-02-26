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

## Google Sheets Preparation

1. Create an `Invites` tab with columns:
   - `inviteCode` (unique, e.g. `BOUM001`)
   - `householdName`
   - `maxGuestsAllowed` (total number allowed in party, e.g. 1 or 2)
   - `email` (optional)
2. Create an `RSVP` tab with columns:
   - `submittedAt`
   - `inviteCode`
   - `householdName`
   - `fullName`
   - `attendance`
   - `guestCount`
   - `additionalGuestNames`
   - `dietaryNotes`
   - `maxGuestsAllowed`
3. Create a Google Cloud service account with Sheets API enabled.
4. Share the sheet with your service account email with Editor access.
5. Email each guest a personalized link like:
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
