# Flight Tracker v2 — Fresh Build Plan

> Rewrite from scratch using your current monorepo patterns (Han Nom Dict architecture).
> Carry over only the proven assets from the 2022 prototype.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Assets to Carry Over](#3-assets-to-carry-over)
4. [Tech Stack](#4-tech-stack)
5. [Phase 1 — MVP (Weeks 1-4)](#5-phase-1--mvp-weeks-14)
6. [Phase 2 — AI + Premium (Weeks 5-8)](#6-phase-2--ai--premium-weeks-58)
7. [Phase 3 — Mobile + 3D (Weeks 9-12)](#7-phase-3--mobile--3d-weeks-912)
8. [Phase 4 — Launch + Monetize (Weeks 13-16)](#8-phase-4--launch--monetize-weeks-1316)
9. [Data Sources & API Strategy](#9-data-sources--api-strategy)
10. [Monetization](#10-monetization)
11. [Marketing & Distribution](#11-marketing--distribution)
12. [Risk Mitigation](#12-risk-mitigation)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        flight-tracker/                          │
├──────────┬──────────┬──────────┬────────────────────────────────┤
│ apps/web │ apps/api │apps/mobile│         packages/             │
│ Next.js  │ Express  │ Vite SPA  │ types, ui, api-client,       │
│ 16       │ + Pg     │ + Cap     │ config, utils                │
└──────────┴──────────┴──────────┴────────────────────────────────┘
     │            │           │
     │       ┌────┴────┐      │
     │       │ PostgreSQL│     │    Vite alias bridge
     │       │ + Redis  │     │    (same pattern as Han Nom Dict)
     │       └────┬────┘      │
     │            │           │
     └────────────┴───────────┘
              ↓
     External APIs: FlightAware AeroAPI, OpenSky, Weather
```

**Core principle**: Web and mobile share 95% of source code via the Vite alias bridge pattern you already perfected in Han Nom Dict.

---

## 2. Monorepo Structure

```
flight-tracker/
├── package.json                 # npm workspaces + turbo
├── Taskfile.yml                 # task runner (same pattern as han-nom-dict)
├── turbo.json
├── .env                         # API keys (FLIGHTAWARE_KEY, MAPTILER_TOKEN, etc.)
├── apps/
│   ├── web/                     # Next.js 16 (App Router, i18n, SSR)
│   │   ├── package.json
│   │   ├── next.config.ts       # transpilePackages, next-intl
│   │   ├── capacitor.config.dev.ts
│   │   ├── capacitor.config.prod.ts
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   └── [locale]/
│   │   │   │       ├── page.tsx              # Landing / map view
│   │   │   │       ├── search/page.tsx       # Flight search
│   │   │   │       ├── flight/[id]/page.tsx  # Flight detail
│   │   │   │       ├── airports/page.tsx     # Airport browser
│   │   │   │       ├── airport/[code]/page.tsx
│   │   │   │       ├── airlines/page.tsx
│   │   │   │       ├── stats/page.tsx        # Personal travel stats
│   │   │   │       └── profile/page.tsx
│   │   │   ├── components/
│   │   │   │   ├── map/
│   │   │   │   │   ├── FlightMap.tsx         # Leaflet map (carry over logic)
│   │   │   │   │   ├── FlightMarkers.tsx     # Canvas markers (carry over)
│   │   │   │   │   ├── AirportMarkers.tsx    # Airport markers (carry over)
│   │   │   │   │   ├── MapControls.tsx       # Zoom, layers, fullscreen
│   │   │   │   │   └── Globe3D.tsx           # React Three Fiber (Phase 3)
│   │   │   │   ├── flight/
│   │   │   │   │   ├── FlightCard.tsx
│   │   │   │   │   ├── FlightDetail.tsx
│   │   │   │   │   └── FlightSearch.tsx
│   │   │   │   ├── ai/
│   │   │   │   │   ├── AIChatPanel.tsx       # AI assistant sidebar
│   │   │   │   │   └── DelayPredictor.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── Header.tsx
│   │   │   │       ├── Footer.tsx
│   │   │   │       └── ThemeToggle.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useFlights.ts             # TanStack Query for flights
│   │   │   │   ├── useAirports.ts
│   │   │   │   └── useMapState.ts            # Zustand map store
│   │   │   ├── lib/
│   │   │   │   ├── map-helpers.ts            # getClosest, drawOnEachWorld, layerMap
│   │   │   │   ├── config.ts
│   │   │   │   └── offline-storage.ts        # IndexedDB for offline flight data
│   │   │   └── stores/
│   │   │       └── map-store.ts              # Zustand: center, zoom, bounds, layer
│   │   ├── public/
│   │   │   ├── aircraft-icons/               # 25 SVGs from old project
│   │   │   └── landing.svg
│   │   └── messages/                         # i18n: en.json, vi.json, fr.json, zh.json
│   │
│   ├── api/                     # Express API server
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── flights.routes.ts         # proxy + cache FlightAware/OpenSky
│   │   │   │   ├── airports.routes.ts
│   │   │   │   ├── airlines.routes.ts
│   │   │   │   ├── weather.routes.ts
│   │   │   │   ├── ai.routes.ts              # AI assistant endpoint
│   │   │   │   └── user.routes.ts            # auth, saved flights, stats
│   │   │   ├── services/
│   │   │   │   ├── flightaware.service.ts    # FlightAware AeroAPI client
│   │   │   │   ├── opensky.service.ts        # OpenSky fallback
│   │   │   │   ├── weather.service.ts
│   │   │   │   ├── ai.service.ts             # Claude API integration
│   │   │   │   └── cache.service.ts          # Redis caching layer
│   │   │   └── db/
│   │   │       └── migrations/
│   │
│   └── mobile/                  # Vite SPA + Capacitor (same bridge as Han Nom Dict)
│       ├── package.json
│       ├── vite.config.ts       # Alias bridge: @/ → ../web/src/
│       ├── capacitor.config.ts  # webDir: 'dist', NO server.url
│       └── src/
│           ├── main.tsx         # BrowserRouter entry
│           ├── App.tsx          # Routes → @/app/[locale]/*/page
│           ├── shims/           # next/navigation, next-intl, next-auth, etc.
│           ├── stubs/           # Header → mobile nav, Footer → null
│           └── lib/             # offline-storage, data-layer overrides
│
└── packages/
    ├── types/                   # @flight-tracker/types
    │   └── src/
    │       ├── flight.ts        # FlightData, AirportData (carry over)
    │       ├── user.ts
    │       └── index.ts
    ├── ui/                      # @flight-tracker/ui (main: src/index.ts, NOT compiled)
    │   └── src/
    │       ├── FlightCard.tsx
    │       ├── AirportBadge.tsx
    │       └── index.ts
    ├── api-client/              # @flight-tracker/api-client (main: src/index.ts)
    │   └── src/
    │       ├── flights.ts
    │       ├── airports.ts
    │       └── index.ts
    ├── config/                  # @flight-tracker/config
    │   └── src/
    │       └── index.ts         # API URLs, map defaults, tile layer configs
    └── utils/                   # @flight-tracker/utils
        └── src/
            ├── map.ts           # getClosest, isInsideMapBound, angle helpers
            └── index.ts
```

---

## 3. Assets to Carry Over

From `/Users/nhatvu148/Work/my-apps/flight-tracker/`:

| Asset | Source | Destination | Changes needed |
|-------|--------|-------------|----------------|
| 25 aircraft SVGs | `public/aircrafts-type-1/` | `apps/web/public/aircraft-icons/` | None — copy as-is |
| `landing.svg` | `public/landing.svg` | `apps/web/public/` | None |
| `FlightData` interface | `components/types.ts` | `packages/types/src/flight.ts` | None |
| `AirportData` interface | `components/types.ts` | `packages/types/src/flight.ts` | None |
| `getClosest()` | `helpers/index.ts` | `packages/utils/src/map.ts` | None |
| `layerMap()` | `helpers/index.ts` | `packages/config/src/index.ts` | Swap `publicRuntimeConfig` → env vars |
| `drawAircraftOnEachWorld()` | `helpers/index.ts` | `apps/web/src/lib/map-helpers.ts` | Replace `declare const L` → proper import |
| `drawAirportsOnEachWorld()` | `helpers/index.ts` | `apps/web/src/lib/map-helpers.ts` | Same |
| Map event sync logic | `components/ZoomLevel.tsx` | `apps/web/src/hooks/useMapState.ts` | Replace Redux → Zustand |
| MapContainer config | `components/main.tsx` | `apps/web/src/components/map/FlightMap.tsx` | Replace Redux → Zustand |
| Canvas marker rendering | `components/Popup.tsx` | `apps/web/src/components/map/FlightMarkers.tsx` | Replace react-query v3 → TanStack v5 |

**Everything else is rewritten** using your modern stack.

---

## 4. Tech Stack

### Web (`apps/web`)
| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | SSR, SEO, your current expertise |
| Styling | Tailwind CSS + shadcn/ui | Consistent with Han Nom Dict |
| State | Zustand | Lightweight, replace Redux |
| Data fetching | TanStack Query v5 | Auto-cache, refetch intervals |
| Map (2D) | Leaflet + react-leaflet v4 | Proven in prototype, performant |
| Map (3D) | React Three Fiber | Phase 3 globe visualization |
| i18n | next-intl | 4 languages (en, vi, fr, zh) |
| Auth | NextAuth (Google OAuth) | Same pattern as Han Nom Dict |

### API (`apps/api`)
| Layer | Technology | Why |
|-------|-----------|-----|
| Server | Express + TypeScript | Your current stack |
| Database | PostgreSQL | Users, saved flights, historical data |
| Cache | Redis | Flight data cache (60s TTL), rate limit |
| AI | Claude API (Anthropic SDK) | AI assistant for travel queries |
| Real-time | WebSocket (ws) | Live flight position updates |
| Dev runner | tsx watch | Hot reload |

### Mobile (`apps/mobile`)
| Layer | Technology | Why |
|-------|-----------|-----|
| Build | Vite + React | SPA for Capacitor |
| Routing | react-router-dom v7 | Alias bridge shims next/navigation |
| i18n | i18next + react-i18next | Shimmed from next-intl |
| Offline | IndexedDB (idb) | Cache airports + recent flights |
| Native | Capacitor (iOS + Android) | Same pattern as Han Nom Dict |
| Push | @capacitor/push-notifications | Delay alerts, gate changes |

---

## 5. Phase 1 — MVP (Weeks 1-4)

**Goal**: Working flight map with search. Deployable web app.

### Week 1: Monorepo scaffold + Map
- [ ] Initialize monorepo (npm workspaces + turbo)
- [ ] Set up `apps/web` (Next.js 16, Tailwind, shadcn/ui, next-intl)
- [ ] Set up `apps/api` (Express, PostgreSQL, Redis)
- [ ] Set up `packages/` (types, config, utils, ui, api-client)
- [ ] Copy aircraft SVGs + types from old project
- [ ] Port `FlightMap.tsx` — Leaflet MapContainer with layer switcher
- [ ] Port `FlightMarkers.tsx` — canvas markers with directional icons
- [ ] Port `AirportMarkers.tsx` — green airport dots
- [ ] Port `map-helpers.ts` — getClosest, drawOnEachWorld, layerMap
- [ ] Zustand store for map state (center, zoom, bounds, layer)
- [ ] URL-encoded map state (`/map/51,-2/4`) with shareable links

### Week 2: Flight data pipeline
- [ ] `flightaware.service.ts` — FlightAware AeroAPI v3 integration
- [ ] `opensky.service.ts` — OpenSky Network fallback (free)
- [ ] `cache.service.ts` — Redis caching (flight positions: 30s TTL, airports: 24h TTL)
- [ ] `flights.routes.ts` — `GET /api/flights/live` (positions in bounding box)
- [ ] `flights.routes.ts` — `GET /api/flights/:id` (single flight detail)
- [ ] `airports.routes.ts` — `GET /api/airports` (full list, cached)
- [ ] `airports.routes.ts` — `GET /api/airports/:code` (single airport)
- [ ] Auto-refetch: TanStack Query polls `/api/flights/live` every 30s
- [ ] Flight markers update in real-time on map

### Week 3: Search + Flight detail
- [ ] `FlightSearch.tsx` — search by flight number, route, or airline
- [ ] Search auto-detect: "AA123" → flight number, "CDG" → airport, "Delta" → airline
- [ ] `/flight/[id]` page — departure, arrival, aircraft type, altitude, speed, status
- [ ] Flight path trail on map (great-circle arc from dep → arr)
- [ ] `/airports` page — browse/search airports with map pins
- [ ] `/airport/[code]` page — airport info, current departures/arrivals
- [ ] Header with nav: Map, Search, Airports, Airlines

### Week 3.5: Distance measurement tool
- [ ] **Aircraft → Airport distance**: when a flight is selected, clicking an airport shows distance + ETA based on current ground speed
- [ ] **Airport → Airport distance**: measure great-circle route distance between two airports
- [ ] **Aircraft → Aircraft distance**: separation distance between two selected flights (niche, for enthusiasts)
- [ ] Visual: dashed line on map between the two points with distance label (km/nm)
- [ ] Uses `L.latLng.distanceTo()` + `L.polyline` for the connecting line
- [ ] Priority: Aircraft→Airport first (highest user value), others later

### Week 4: Auth + saved flights
- [ ] NextAuth setup (Google OAuth, same as Han Nom Dict)
- [ ] DB schema: users, saved_flights, tracked_routes
- [ ] "Track this flight" button → saves to user profile
- [ ] `/profile` page — saved flights, tracked routes
- [ ] Basic push notification setup (web: service worker)
- [ ] Deploy: Vercel (web) + Railway/Fly.io (API) + Supabase (DB)
- [ ] **MVP LAUNCH**: Share on X, Reddit r/aviation, r/travel

---

## 6. Phase 2 — AI + Premium (Weeks 5-8)

**Goal**: AI assistant, delay predictions, Stripe payments.

### Week 5: AI assistant
- [ ] `ai.service.ts` — Claude API integration with system prompt
- [ ] `ai.routes.ts` — `POST /api/ai/chat` (SSE streaming response)
- [ ] `AIChatPanel.tsx` — slide-out sidebar chat panel
- [ ] Context-aware: panel knows which flight/airport user is viewing
- [ ] Example queries:
  - "When does my flight land?"
  - "Is there a delay risk for AA123?"
  - "Best coffee shop in CDG Terminal 2E?"
  - "What's the minimum connection time at LAX?"

### Week 6: Delay prediction + weather
- [ ] `weather.service.ts` — weather data for departure/arrival airports
- [ ] Weather overlay on map (rain, storms, visibility zones)
- [ ] Simple delay prediction model:
  - Historical on-time data (FlightAware stats)
  - Current weather at dep/arr
  - Time of day + day of week patterns
  - Output: "Low/Medium/High delay risk" with explanation
- [ ] `DelayPredictor.tsx` — visual indicator on flight detail page

### Week 7: AI flight cost estimation + Premium features + Stripe
- [ ] **AI-powered flight cost estimation** (unique differentiator — no competitor combines tracking + price AI):
  - [ ] Price data service: integrate Amadeus Self-Service API or Tequila (Kiwi.com) API for fare lookups
  - [ ] `price.service.ts` — query flight prices by route, date range, cabin class
  - [ ] `price.routes.ts` — `GET /api/prices/search` (route + dates), `GET /api/prices/trends` (historical)
  - [ ] Claude tool-use integration: AI can call price APIs as tools to answer user queries
  - [ ] `FlightPricePanel.tsx` — price trend chart (sparkline of last 30 days) on flight/route detail
  - [ ] AI assistant queries:
    - "Should I buy now or wait?" — analyze price trend + seasonality for a route
    - "Cheapest day to fly SFO→SGN in March?" — compare fares across dates
    - "Alternative routes that are cheaper?" — suggest nearby airports or indirect flights
    - "Is this flight price good?" — compare against historical average for the route
  - [ ] Price alerts: notify when fare drops below user-set threshold (premium feature)
  - [ ] Affiliate integration: "Book this flight" links to Skyscanner/Kiwi (revenue share)
- [ ] Stripe integration (same pattern as standard SaaS)
- [ ] Free tier: 3 tracked flights, 5 AI queries/day, 1 price check/day, ads
- [ ] Premium ($6.99/mo or $59/yr):
  - Unlimited tracking + AI queries
  - Unlimited price checks + price alerts
  - Delay predictions
  - Price alerts (via affiliate links)
  - Ad-free
  - SMS/push notifications
- [ ] Paywall UI: soft gate on premium features
- [ ] Webhook handler for subscription lifecycle

### Week 8: Notifications + polish
- [ ] Push notifications: delay alerts, gate changes, landing
- [ ] Email notifications (optional, Resend/SendGrid)
- [ ] SMS notifications (Twilio, premium only)
- [ ] Landing page: hero with map demo, feature grid, pricing table
- [ ] SEO: meta tags, OG images, structured data for flights
- [ ] Performance audit: Lighthouse 95+, map load < 2s

---

## 7. Phase 3 — Mobile + 3D (Weeks 9-12)

**Goal**: iOS/Android app + 3D globe visualization.

### Week 9: Mobile app (Vite alias bridge)
- [ ] Set up `apps/mobile` (Vite + Capacitor, same bridge as Han Nom Dict)
- [ ] Shims: next/navigation → react-router-dom, next-intl → i18next
- [ ] Mobile-specific: bottom tab nav, touch-optimized map controls
- [ ] Offline mode: cache airports + recent flight lookups in IndexedDB
- [ ] Push notifications via Capacitor plugin
- [ ] Test on iOS simulator + Android emulator

### Week 10: 3D globe
- [ ] `Globe3D.tsx` — React Three Fiber earth globe
- [ ] Plot flights as animated arcs on globe surface
- [ ] Aircraft models with proper 3D orientation (heading + pitch)
- [ ] Smooth transition: 2D map ↔ 3D globe toggle
- [ ] Color-coded altitude visualization
- [ ] Weather overlay (optional: turbulence zones)

### Week 11: Social + gamification
- [ ] Travel diary: auto-log flights from tracking history
- [ ] Annual "Year in Flights" summary (shareable card)
- [ ] Stats: miles flown, countries visited, airlines used, airports visited
- [ ] Share live tracking links (branded: `fly.yourapp.com/track/AA123`)
- [ ] `/stats` page with visual charts (distance, frequency, map of routes)

### Week 12: App Store launch
- [ ] iOS: App Store Connect, screenshots, description
- [ ] Android: Google Play Console, listing
- [ ] App Store Optimization (ASO): keywords, screenshots, preview video
- [ ] TestFlight beta with 50 users
- [ ] Fix critical bugs from beta feedback

---

## 8. Phase 4 — Launch + Monetize (Weeks 13-16)

**Goal**: Public launch, first paying customers, content marketing engine.

### Week 13: Product Hunt launch
- [ ] Product Hunt listing: "Flight Tracker with AI — built by an aerospace engineer"
- [ ] Demo video (90s): map → search flight → AI chat → delay prediction → 3D globe
- [ ] Lifetime deal for early adopters ($99 = forever premium)
- [ ] Reddit posts: r/travel, r/aviation, r/digitalnomad, r/SideProject
- [ ] Hacker News "Show HN" post

### Week 14: Content marketing
- [ ] Blog post: "I'm an aerospace engineer who built a flight tracker — here's why existing ones suck"
- [ ] YouTube video: "Building a Flight Tracker with AI" (pilot episode)
- [ ] Short-form: TikTok/Reels showing the 3D globe + AI assistant
- [ ] SEO articles:
  - "Best apps to track flights in 2026"
  - "How flight delay predictions actually work"
  - "Understanding aircraft types — a visual guide"

### Week 15: Affiliate + B2B foundations
- [ ] Affiliate links: Skyscanner, Booking.com, travel insurance
- [ ] "Book alternative flight" button when delays detected
- [ ] Airport lounge finder with affiliate booking
- [ ] B2B inquiry page: white-label widget for travel agencies
- [ ] API documentation for enterprise customers

### Week 16: Iterate + scale
- [ ] Analyze: conversion rates, churn, feature usage, AI query patterns
- [ ] Top user requests → prioritize next features
- [ ] A/B test: pricing, paywall placement, onboarding flow
- [ ] Target: 1,000 users, 50 paying customers
- [ ] Plan YouTube series: "Building a Flight Tracker" (10 episodes)

---

## 9. Data Sources & API Strategy

### Primary: FlightAware AeroAPI v3
- **Endpoint**: `https://aeroapi.flightaware.com/aeroapi/`
- **Pricing**: Pay-per-query (~$0.005/query for flight positions)
- **Data**: Live positions, flight details, historical, delay stats
- **Caching strategy**: Redis with 30s TTL for positions, 5min for details

### Fallback: OpenSky Network (free)
- **Endpoint**: `https://opensky-network.org/api/`
- **Pricing**: Free (rate-limited: 100 req/10s anonymous, 4000/10s authenticated)
- **Data**: Live positions only (no flight details, no delay stats)
- **Use case**: Free tier users, fallback when FlightAware quota exceeded

### Weather: OpenWeatherMap or WeatherAPI
- **Data**: Current conditions at airports, forecasts for delay prediction
- **Caching**: 15min TTL

### Static: OurAirports dataset
- **Source**: `ourairports.com/data/` (CSV, public domain)
- **Data**: 70K+ airports with lat/lng, name, IATA/ICAO, country
- **Import once** into PostgreSQL, update monthly

### Cost management
| Scenario | FlightAware queries/day | Monthly cost |
|----------|------------------------|--------------|
| 100 free users | ~5,000 | ~$750 |
| 500 free + 50 premium | ~15,000 | ~$2,250 |
| 2,000 free + 200 premium | ~40,000 | ~$6,000 |

**Mitigation**: Aggressive Redis caching, OpenSky for free tier, batch position updates (1 query returns all flights in viewport), only query when map is active.

---

## 10. Monetization

### Subscription tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 3 tracked flights, 5 AI queries/day, OpenSky data, ads |
| **Premium** | $6.99/mo or $59/yr | Unlimited tracking + AI, FlightAware data, delay predictions, push/SMS alerts, ad-free, offline mode |
| **Family** | $14.99/mo | 5 users, shared trips, group tracking |
| **Business** | $49/mo | API access (10K req/mo), team dashboard, bulk tracking |

### Additional revenue streams
- **Affiliate**: Flight bookings (Skyscanner 3-5%), hotels (Booking.com 4-7%), insurance ($20-50/sale), airport lounges
- **B2B white-label**: Travel agency widget ($99-499/mo)
- **Data licensing**: Anonymized travel patterns to airlines/airports
- **Lifetime deals**: $99 early-bird (cap at 200 seats)

### Revenue targets
| Period | Users | Paying | MRR | ARR |
|--------|-------|--------|-----|-----|
| Month 3 | 1,000 | 50 | $350 | $4.2K |
| Month 6 | 5,000 | 300 | $2.1K | $25K |
| Year 1 | 10,000 | 500 | $3.5K | $42K |
| Year 2 | 50,000 | 3,000 | $21K | $250K |

---

## 11. Marketing & Distribution

### Launch channels (ranked by expected ROI)

1. **Reddit** — r/travel (5M), r/aviation (800K), r/digitalnomad (2M), r/SideProject
   - Post: "I'm an aerospace engineer who built a flight tracker with AI. Here's the story."
   - Genuine, not spammy. Show the 3D globe + AI demo.

2. **X/Twitter** — Build in public from day 1
   - Daily progress tweets with screenshots/videos
   - Tag #buildinpublic, #indiehackers, #aviation
   - Thread: "Why I left aerospace to build a flight tracker (and what I know that FlightRadar24 doesn't)"

3. **YouTube (Vuporvita)** — 10-episode "Building a Flight Tracker" series
   - Ep 1: Why existing trackers suck (aerospace engineer's view)
   - Ep 2-4: Building the real-time map (Leaflet + WebSocket)
   - Ep 5-7: Adding AI (Claude API, delay prediction)
   - Ep 8-9: 3D globe with React Three Fiber
   - Ep 10: Launch day + revenue reveal

4. **Product Hunt** — Coordinated launch day
5. **Hacker News** — "Show HN" post
6. **TikTok/Reels** — Short demos of 3D globe, AI assistant, delay alerts

### SEO strategy
- Target keywords: "flight tracker", "live flight tracking", "flight delay prediction", "AI flight assistant"
- Blog posts targeting long-tail: "how to track a flight in real time", "best flight tracker app 2026"
- Each airport page = SEO-indexed (`/airport/CDG`, `/airport/LAX`)

---

## 12. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| FlightAware API costs exceed revenue | High | OpenSky free fallback, aggressive caching (30s TTL), viewport-only queries, free tier uses OpenSky only |
| FlightRadar24 competition | Medium | Differentiate with AI assistant + 3D globe + aerospace credibility. Don't compete on data — compete on UX + intelligence |
| Low conversion to paid | Medium | Soft paywall (show premium features grayed out), annual discount (30% off), lifetime early-bird deal |
| Leaflet perf with 10K+ markers | Low | Already solved: `leaflet-markers-canvas` renders 50K+ markers at 60fps |
| Mobile app rejection | Low | No private APIs used, standard Capacitor/WKWebView, follow Apple/Google guidelines |
| Data privacy concerns | Medium | Only use public ADS-B data, GDPR-compliant, transparent privacy policy, no military/private flight tracking |

---

## Quick Start Commands

```bash
# Create the monorepo
mkdir -p ~/Work/my-apps/flight-tracker
cd ~/Work/my-apps/flight-tracker

# Initialize
npm init -y
# Set up workspaces in package.json: ["apps/*", "packages/*"]

# Copy assets from old project
cp -r ~/Work/my-apps/flight-tracker-old/public/aircrafts-type-1/ apps/web/public/aircraft-icons/
cp ~/Work/my-apps/flight-tracker-old/public/landing.svg apps/web/public/

# Development
task dev              # Start web (3000) + api (5001)
task dev:web          # Web only
task dev:api          # API only

# Mobile
task build:mobile     # Vite build + cap sync
task ios              # Run in iOS simulator

# Deploy
task deploy:web       # Vercel
task deploy:api       # Railway/Fly.io
```

---

## Success Criteria

- [ ] **Week 4**: Working flight map with real-time data, deployed at a public URL
- [ ] **Week 8**: AI assistant + Stripe payments live, 10 beta users
- [ ] **Week 12**: iOS app in TestFlight, 3D globe working
- [ ] **Week 16**: 1,000 users, 50 paying customers, Product Hunt launched
- [ ] **Month 6**: $2K MRR, YouTube series started, 5K users
- [ ] **Year 1**: $3.5K MRR, mobile app in App Store + Play Store

---

*Last updated: 2026-02-20*
