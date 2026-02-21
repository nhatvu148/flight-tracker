# Flight Tracker

Real-time flight tracking with AI-powered travel assistance. Built by an aerospace engineer.

## Quick Start

```bash
npm install
task dev          # Start web (3000) + api (5001)
```

## Architecture

Monorepo with npm workspaces + Turborepo:

- `apps/web` — Next.js 16 (App Router, Tailwind, Leaflet map)
- `apps/api` — Express API (flight data, caching, AI)
- `apps/mobile` — Vite SPA + Capacitor (iOS/Android)
- `packages/types` — Shared TypeScript types
- `packages/config` — Map layers, API config, constants
- `packages/utils` — Map helpers (angle snapping, bounds check)
- `packages/ui` — Shared React components
- `packages/api-client` — API client (fetch wrappers)

## Environment

Copy `.env.example` to `.env` and fill in your API keys.
