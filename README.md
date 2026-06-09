# Wondr Frontend

Next.js application that powers the Wondr marketing dashboard. This repo includes the UI, authentication flows, and API client used to communicate with the backend service.

## Prerequisites
- Node.js 18 or later and npm
- Clerk account for auth keys
- Running instance of the Wondr backend (FastAPI) on http://localhost:8000

## Directory Overview
```
wondr-frontend/
├── app/           # Next.js App Router pages and layouts
├── components/    # Shared UI components
├── lib/           # API client and utilities
└── middleware.ts  # Clerk authentication middleware
```

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your own values (see below).
3. Make sure the backend service is running locally (port 8000 by default).
4. Start the development server
   ```bash
   npm run dev
   ```
5. Visit http://localhost:3000 to use the app. The site automatically reloads as you edit files.

## Environment Variables
All required variables are documented in [`.env.example`](.env.example). Copy it to
`.env.local` and fill in your own values:
```bash
cp .env.example .env.local
```
- `.env.local` is git-ignored — never commit it or any file containing real secrets.
- Production values are configured in the hosting provider (e.g. Vercel project settings), not in a committed file.
- Keep `NEXT_PUBLIC_API_URL` in sync with the backend host/port.
- Get the Clerk keys from the [Clerk dashboard](https://dashboard.clerk.com); only the `NEXT_PUBLIC_*` publishable key is safe to expose in the browser — keep `CLERK_SECRET_KEY` private.

## Available Scripts
- `npm run dev` – start the Next.js dev server on port 3000.
- `npm run build` – create a production build.
- `npm run start` – serve the production build.
- `npm run lint` – run ESLint checks.

## Features
- ✅ Next.js 15 with TypeScript
- ✅ Clerk authentication (sign-in, sign-up)
- ✅ Protected routes via middleware
- ✅ Dashboard and landing experiences
- ✅ Tailwind CSS styling
- ✅ API client for communicating with the backend

## Development Workflow
1. Start the FastAPI backend from the `wondr-backend` repository.
2. Run the frontend dev server with `npm run dev`.
3. Sign up or sign in via the Clerk-powered UI.
4. Explore protected routes after authentication.

## Related Repository
- Backend service: `wondr-backend` (FastAPI). Keep this running for API requests.

## License
MIT
