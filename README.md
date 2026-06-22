# Peak Recovery Massage

A full Next.js marketing site for Peak Recovery Massage with a built-in online scheduling flow for Vercel deployments.

## Tech stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Neon serverless Postgres support for durable appointment storage

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000`.

## Booking storage

The scheduler has two modes:

- **Preview mode**: no database required; bookings are stored temporarily in memory for demos.
- **Database mode**: add `DATABASE_URL` for persistent appointment storage.

To enable persistent bookings locally, copy the environment example and add a Postgres connection string:

```bash
cp .env.example .env.local
```

## Business content

The easiest places to update the brand copy, contact details, and service positioning are:

- `src/lib/site-content.ts`
- `src/lib/scheduling.ts`

## Deploy on Vercel

1. Import the repository into Vercel.
2. Add `DATABASE_URL` in the project environment settings.
3. Deploy the site.
