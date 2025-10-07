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
2. Configure environment variables in `.env.local` (see below).
3. Make sure the backend service is running locally (port 8000 by default).
4. Start the development server
   ```bash
   npm run dev
   ```
5. Visit http://localhost:3000 to use the app. The site automatically reloads as you edit files.

## Environment Variables (`.env.local`)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_API_URL=http://localhost:8000
```
- Keep `NEXT_PUBLIC_API_URL` in sync with the backend host/port.
- Never commit real secrets; use `.env.local` for local overrides.

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
