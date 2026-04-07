# Primme Platform

Premium construction management platform connecting homeowners with elite service providers.

## Tech stack

- [Next.js 15](https://nextjs.org/)
- React 18
- TypeScript
- Tailwind CSS 3
- [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- Lucide Icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js App Router: marketing routes plus three role portals — **client** (homeowner), **provider** (service provider), and **affiliate** (partner). |
| `src/components/` | Shared UI and feature components; `src/components/ui/` holds shadcn-style primitives. |
| `src/lib/` | Utilities, helpers, and shared non-UI logic. |
| `src/context/` | React context providers (e.g. session). |

## Design system

UI tokens, typography, and component conventions are documented in [.agents/rules/design-system-rules.md](.agents/rules/design-system-rules.md). Follow those rules when adding or changing screens.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Development server (Turbopack, localhost:3000) |
| `build` | `npm run build` | Production build |
| `start` | `npm run start` | Run production server |
| `lint` | `npm run lint` | Typecheck (`tsc --noEmit`) and ESLint |
| `format` | `npm run format` | Format with Biome (`biome format --write`) |
