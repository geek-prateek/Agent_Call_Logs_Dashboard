# Bolna AI — Next.js + Supabase Call Dashboard

This repository is a ready-to-deploy Next.js project that receives call webhooks, stores them in Supabase, and displays them in a dashboard with a modal to view recording (MP3) and structured transcript.

## Features
- `/api/webhook` — POST endpoint for Bolna webhooks (inserts/upserts calls to Supabase).
- Dashboard at `/` listing calls (phone, duration, status: `completed` | `failed`, timestamp, cost).
- Modal popup (Conversation Data) with audio player and transcript rendered as role-based messages.
- Supabase schema SQL included.

## Quickstart (local)

1. Clone or extract this project.

2. Install:
```bash
npm install
```

3. Create a Supabase project at https://app.supabase.com and get:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

4. Run the SQL migration (Supabase SQL editor) — file: `supabase/schema.sql`

5. Create `.env.local` in project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://<your>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://<your>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BOLNA_SECRET=optional_hmac_secret_if_you_use_one
```

6. Start dev server:
```bash
npm run dev
```
Open http://localhost:3000

7. Test webhook:
```bash
curl -X POST http://localhost:3000/api/webhook \
 -H "Content-Type: application/json" \
 -d '{
  "call_id":"test-1",
  "phone_number":"+911234567890",
  "duration":45,
  "status":"completed",
  "recording_url":"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "transcript":[{"role":"assistant","text":"Hello, this is a test."},{"role":"user","text":"Hi"}],
  "activity_logs":[{"event":"tts_played","ts":"2025-10-01T10:00:00Z"}],
  "cost":0.05
 }'
```

## Deploy to Vercel
- Push to GitHub and import repository in Vercel.
- Add environment variables in Vercel dashboard (same as `.env.local`).
- Deploy. Use the Vercel URL + `/api/webhook` as Bolna webhook URL.

## Notes & Next steps
- This setup uses Supabase for persistence — no data loss on Vercel.
- For production, enable HMAC signature validation (BOLNA_SECRET) and secure the dashboard with auth.
- Activity logs are only used when status is `completed`.

