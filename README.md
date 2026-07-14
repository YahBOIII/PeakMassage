# Peak Recovery Website

This repository contains a Next.js website for Peak Recovery with:

- Multi-page marketing site (Home, About, Services, Pricing, Contact, Book Now)
- Clean dark theme with black, white, blue, and silver accents
- SEO metadata, Open Graph tags, LocalBusiness schema, FAQ schema, sitemap, and robots.txt
- Scheduling MVP (services, availability, booking, cancellation, owner management)

## Development

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Environment variables

Copy `.env.example` to `.env` and fill in:

```bash
DATABASE_URL="******HOST:5432/DATABASE?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
OWNER_EMAIL="owner@example.com"
OWNER_PASSWORD="replace-with-strong-owner-password"
OWNER_NAME="Peak Recovery Owner"
OWNER_EMAILS="owner@example.com"
```

Notes:

- `OWNER_EMAILS` supports a comma-separated list; matching users are treated as `OWNER`.
- `OWNER_EMAIL` and `OWNER_PASSWORD` are used by the seed script to create/update an owner account.

## Prisma setup

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

For production deploys (e.g., Vercel):

```bash
npm run prisma:deploy
```

Seed behavior:

- Creates default active services for 60 and 75 minutes.
- Creates default weekday business hours (Mon-Fri, 09:00-17:00 UTC).
- Creates/updates the owner account when `OWNER_EMAIL` and `OWNER_PASSWORD` are set.

## Deployment

This app is deployed on [Vercel](https://vercel.com). Push to `main` to trigger a production deploy.

## Validation

```bash
npm run lint
npm run build
```
