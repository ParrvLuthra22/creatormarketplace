# CreatorLyff — Creator × Brand Marketplace

> Full-project audit written directly from source (`github.com/ParrvLuthra22/creatormarketplace`, branch `main` @ `58699d5`). Intended as a UI/feature/architecture reference for AI agents working on this codebase — every claim below is backed by a file path, not inferred from memory.

---

## Table of Contents
1. [What This Product Is](#1-what-this-product-is)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Design System](#4-design-system)
5. [Two Coexisting UI Generations — Read Before Touching Styles](#5-two-coexisting-ui-generations--read-before-touching-styles)
6. [Features](#6-features)
7. [Frontend Route Map](#7-frontend-route-map)
8. [Data Models (MongoDB / Mongoose)](#8-data-models-mongodb--mongoose)
9. [REST API Reference](#9-rest-api-reference)
10. [Real-Time Layer (Socket.io)](#10-real-time-layer-socketio)
11. [Environment Variables](#11-environment-variables)
12. [Deployment](#12-deployment)
13. [Known Inconsistencies & Rough Edges](#13-known-inconsistencies--rough-edges)

---

## 1. What This Product Is

CreatorLyff is a two-sided marketplace connecting **Brands** with **social media creators** for paid collaborations, positioned as a structured, self-serve alternative to cold-DM influencer outreach. The product is currently **pre-launch**: the pricing page markets paid tiers as "Coming soon / Join beta waitlist," the hero copy leans on stats like "10,000+ creators waitlisted," and the fully-built Razorpay payment integration is deliberately left unmounted in the backend (see [6.6](#66-payments--billing-built-but-intentionally-unmounted)). Free-tier discovery, proposals, and messaging are the live, working core.

- **Brands** sign up (email/password or OAuth), browse a creator directory, send structured proposals (title, budget, deliverables, deadline), message creators once connected, and run a lightweight campaign dashboard.
- **Creators** sign up with an Instagram handle, build a profile, connect Instagram/YouTube for auto-synced follower/engagement stats, receive and accept/decline proposals, chat with brands, and can earn a verification badge — either by self-requesting it or by being auto-flagged once their combined follower count crosses 100,000 (checked nightly by a cron job).
- An **admin API** (no frontend UI for it yet) lets platform staff view stats, manage users (suspend/promote/change plan), and review verification requests.

## 2. Tech Stack

**Frontend** (`frontend/`, `package.json` name `creatorsync3`)
- Next.js **16.2.4** (App Router), React **19.2.4**, TypeScript 5
- Tailwind CSS **4** (CSS-first `@theme inline` config, no `tailwind.config.js` — all tokens live in `app/globals.css`)
- **Framer Motion 12** — primary animation library for the marketing site and dashboards
- **GSAP 3.15** + `@gsap/react` — used selectively (orphaned `components/landing/*`, see §5)
- **Lenis** (`lenis` + `@studio-freight/lenis`) — smooth scroll, wired app-wide via `<ReactLenis root>` in the root layout
- **Zustand 5** — primary client auth/global state (`lib/auth.ts` → `useAuthStore`)
- **TanStack Query 5** — data fetching/caching (`lib/hooks/use*.ts`)
- **Axios** — HTTP client (`lib/api.ts`), `withCredentials: true` for the httpOnly auth cookie
- **socket.io-client 4.8** — real-time chat (`lib/socket.ts`)
- posthog-js, js-cookie, clsx + tailwind-merge (`cn()` helper), react-three-fiber/drei + three (installed, no usage found in any read file — likely unused or for a not-yet-built 3D element)

**Backend** (`backend/`, Node + Express, TypeScript, run via `tsx`)
- Express **4.18**, Mongoose **8** (MongoDB)
- **Passport.js** with **six** OAuth strategies: Google, Google-scoped-for-YouTube, Facebook (used for Instagram login), Twitter/X (via `twitter-api-v2`, manual OAuth2 PKCE, not Passport), LinkedIn (via `openid-client`, manual OIDC), Snapchat (via `openid-client`, manual OIDC) — all JWT-cookie based, no server sessions
- `jsonwebtoken` + `bcryptjs`, `helmet`, `express-rate-limit`, `cookie-parser`, `cors`
- **Socket.io 4.8** — full real-time chat server (`src/socket.ts`)
- **node-cron** — nightly (03:00 UTC) job that re-syncs every creator's Instagram/YouTube stats and auto-flags accounts for verification (`src/jobs/socialSync.ts`)
- Cloudinary + `multer-storage-cloudinary` (falls back to local disk `backend/uploads/` if unconfigured)
- Resend (email), posthog-node (server-side analytics), Razorpay SDK (installed, wired, currently unmounted)

## 3. Repository Structure

```
creatormarketplace/
├── AGENTS.md, CLAUDE.md            # agent instructions: "read node_modules/next/dist/docs before writing Next.js code — breaking changes"
├── BACKEND_DEPLOYMENT.md           # Vercel serverless deploy guide for the Express backend
├── RAILWAY_SETUP.md                # Railway env-var checklist (alternate backend host)
├── MONGODB_ATLAS_SETUP.md          # Mongo Atlas free-tier walkthrough
├── DEPLOYMENT_CHECKLIST.md         # Vercel / Railway / Render comparison checklist
├── package.json                    # root: `concurrently` runs frontend+backend dev servers together
│
├── frontend/
│   ├── app/                        # ~40 routed pages, see §7
│   ├── components/
│   │   ├── ui/                     # Button, Container, Marquee, RevealOnScroll, Accordion, Tabs, SplitText, Skeleton, NewsletterForm — the current design-system atoms
│   │   ├── sections/                # HeroSection, BrandMarquee, HowItWorks, CreatorShowcase, SplitCTA, StatsStrip, WaitlistCTA — the ACTIVE landing page, rendered by app/page.tsx
│   │   ├── dashboard/                # StatCard, TopBar, BrandSidebar, CreatorSidebar, MobileSidebar, CreateCampaignModal, Toast, Skeleton, ActivityFeed, DashCreatorCard — current dashboard chrome
│   │   ├── auth/                     # AuthBackground, AuthEmailForm, AuthSidePanel, SocialIcons, SocialLoginButton — current login/signup UI
│   │   ├── landing/                  # ORPHANED — Hero, Navigation, LandingPage, VideoGrid, CreatorCardFloat, SmoothScroll, HeroCreatorCard — zero imports anywhere else, see §5
│   │   └── (30+ flat files)          # LEGACY generation — Header, Hero, RouteGuard, AuthModal, ProtectedRoute, DashboardSidebar, CreatorSidebar, BrandProfile, ProposalInbox, etc. — still imported by legacy routes, see §5
│   ├── contexts/AuthContext.tsx     # LEGACY auth state (React Context) — see §5
│   ├── lib/
│   │   ├── auth.ts                  # CURRENT auth state (Zustand `useAuthStore`)
│   │   ├── api.ts                   # axios client + typed endpoint functions
│   │   ├── socket.ts                # socket.io-client hooks (useSocket, useTypingIndicator, useOnlineStatus, useUnreadCount)
│   │   ├── hooks/                   # useAuth, useChat, useCreators, useProfile, useProposals, useSocialSync, useUploads, useVerification, useDisableLenis
│   │   ├── CampaignModalContext.tsx, toast.ts, formatNumber.ts, utils.ts (cn helper)
│   │   └── brandData.ts, creator-mock-data.ts, creatorData.ts, mock-data.ts, data.ts  — LEGACY mock/dummy data files, still referenced by legacy routes
│   └── public/images/               # brand-placeholder.png, satyaki.png
│
└── backend/
    ├── src/
    │   ├── server.ts                 # Express entry point — see §6 for exact middleware/route order
    │   ├── socket.ts                  # Socket.io server (chat, typing, presence, reactions)
    │   ├── config/                    # env.ts, db.ts (Mongoose connect), passport.ts (6 OAuth strategies), cloudinary.ts, email.ts (Resend), posthog.ts, razorpay.ts (disabled)
    │   ├── jobs/socialSync.ts         # nightly node-cron job
    │   ├── services/                  # instagramService, youtubeService, socialStats, presenceService (in-memory online-user map), notificationService (throttled offline-chat emails)
    │   ├── middleware/                # auth.ts, adminAuth.ts, optionalAuth.ts, rateLimiter.ts (5 req/min on auth routes)
    │   ├── models/                    # User, CreatorProfile, BrandProfile, Proposal, Payment, Conversation, Message, VerificationRequest
    │   ├── routes/                    # auth, profile, proposals, chat, uploads, instagram, youtube, admin, verification, payments (built, NOT mounted in server.ts)
    │   └── utils/                     # jwt.ts, validation.ts, emailTemplates.ts
    ├── scripts/                       # check-public-creators.ts, seed-admin.ts (run via `npm run seed:admin`)
    ├── uploads/                       # local-disk fallback storage — has real committed sample files (profile photos etc.)
    ├── vercel.json                    # serverless deploy config (routes everything to dist/server.js)
    └── ecosystem.config.js            # PM2 cluster config for a persistent-server deploy (e.g. Railway/Render)
```

## 4. Design System

The **single source of truth** is `frontend/app/globals.css` — genuinely one coherent, well-commented design system (unlike some other files in this repo, see §5). It opens with an explicit animation-principles comment block:

```
Default ease: cubic-bezier(0.65, 0, 0.35, 1)  — "ease-out-quart", used everywhere
Stagger delays: 0.05s between siblings
Reveal duration: 0.8s text / 1.2s sections
prefers-reduced-motion is respected globally
```

### 4.1 Color tokens (`:root` in `globals.css`)

| Token | Value | Role |
|---|---|---|
| `--bg-primary` | `#0a0a0a` | Page/body background (near-black) |
| `--bg-secondary` | `#141414` | Card/section surfaces |
| `--bg-surface` | `#1c1c1c` | Elevated surfaces (inputs, hover states) |
| `--border` | `#262626` | Default hairline border |
| `--border-strong` | `#404040` | Emphasized border / dividers |
| `--text-primary` | `#fafafa` | Headings, primary copy |
| `--text-secondary` | `#a1a1a1` | Body copy |
| `--text-tertiary` | `#525252` | Meta labels, captions, mono-utility text |
| `--accent` | `#d4ff4f` | **Brand color — lime/chartreuse.** CTAs, links, focus rings, cursor dot, active states |
| `--accent-hover` | `#c2ed3d` | Accent hover state |
| `--success` | `#4ade80` | Positive trend indicators |
| `--warning` | `#fbbf24` | Negative/caution trend indicators |

All of these are re-exposed as Tailwind theme colors via `@theme inline` (e.g. `bg-(--bg-primary)`, `text-(--accent)` — Tailwind v4's arbitrary-CSS-variable syntax, used **everywhere** in components instead of static color classes).

### 4.2 Typography
Three real, correctly-loaded Google Fonts via `next/font/google` in `app/layout.tsx`:
- **Inter** (`--font-inter`) — sans body/display font, weights 400–700
- **Instrument Serif** (`--font-instrument-serif`) — italic serif, used exclusively as a single-word accent inside headlines (e.g. "Where brands meet their **next** favorite creator" — "next" in serif italic, often in `--accent` lime)
- **JetBrains Mono** (`--font-jetbrains-mono`) — the "mono-utility" label style: uppercase, letter-spaced, used for all eyebrow/meta labels

Custom type-scale utilities (defined via Tailwind v4 `@utility`, so they're first-class Tailwind classes): `text-hero` (clamp 3rem–10rem, used once per page as the big headline), `text-h1`/`text-h2`/`text-h3`, `text-body-lg`/`text-body`/`text-caption`, `text-mono-sm` (mono-utility label size). Section eyebrows follow a strict numbered convention: `"01 — INTRODUCING CREATORLYFF"`, `"02 — HOW IT WORKS"`, `"03 — FEATURED CREATORS"`, `"07 — GET STARTED"`, etc. — every marketing section is numbered, in mono font, uppercase, in `--text-tertiary`.

### 4.3 Motion & interaction language
- **Custom cursor** (`components/Cursor.tsx`, desktop/fine-pointer only): a 10px lime dot that lerps toward the real cursor at 0.15/frame; on hovering anything with `data-interactive`, an `<a>`, or a `<button>`, it expands into a 52px hollow white ring with `mix-blend-mode: difference`, optionally showing a mono-font label from a `data-cursor` attribute. Native cursor is hidden (`cursor: none`) on `(hover: hover) and (pointer: fine)`.
- **Magnetic buttons**: the primary `Button` atom (`components/ui/Button.tsx`) tracks mouse position over itself and translates up to 4px toward the cursor, snapping back on mouse-leave.
- **Reveal-on-scroll**: nearly every section wraps content in `<RevealOnScroll>` (Framer Motion `whileInView`, `opacity 0→1` + `y 32→0`, the shared ease-out-quart curve, `viewport={{ once: true, margin: "-80px" }}`).
- **Grain overlay**: an SVG `feTurbulence` filter at 5% opacity over the hero section for texture.
- **Live IST clock**: the hero shows a real-time `INDIA / HH:MM:SS` timestamp (`Asia/Kolkata`), ticking every second — a deliberate "this is a live product" signal.
- **Count-up numbers**: stat displays (`StatsStrip`, dashboard `StatCard`) animate from 0 to target with an eased `requestAnimationFrame` loop (~1.4–2.2s, ease-out-quart-ish `1 - (1-p)^n`).
- **Split-panel hover**: both `SplitCTA` (landing page "For Brands" / "For Creators") and `/login` (role picker) use the same pattern — two full-height/width panels that grow to 60%/shrink to 40% on hover, with a massive low-opacity serif watermark word in the background that skews on hover.
- Scrollbar is 4px, custom-colored; focus rings are always 2px solid `--accent` with 2px offset; a "skip to content" link is present for accessibility; `prefers-reduced-motion: reduce` collapses all animation durations to 0.01ms globally.

### 4.4 Layout conventions
- `Container` (`components/ui/Container.tsx`): `max-w-[1440px] mx-auto px-6 md:px-12` — the only layout-width primitive, used on every section.
- Cards: `rounded-xl`/`rounded-2xl`, `border border-(--border)`, `bg-(--bg-secondary)`, hover lifts via the shared `.card-hover` utility class (`translateY(-4px)` + border color shift).
- The global `<Navigation>` and `<Footer>` (rendered in root `layout.tsx` for every route) are hidden via direct DOM manipulation (`nav.style.display = "none"`) inside dashboard layouts, rather than route-group conditional rendering — called out explicitly in a `globals.css` comment as a deliberate choice "to avoid bundle-cache issues."

## 5. Two Coexisting UI Generations — Read Before Touching Styles

This codebase contains **two visually distinct, both-functional generations of the same product surfaces**. Every `@/` import in the frontend resolves (verified: 0 of 73 unique aliased imports are missing), so both generations render — they just look different and use different state management. An agent asked to "update the dashboard" or "fix the login page" needs to know which generation the target route belongs to.

| | **Current generation** | **Legacy generation** |
|---|---|---|
| Color system | CSS variables from `globals.css` (§4.1) — dark `#0a0a0a` + lime `#d4ff4f` | Hardcoded hex, inconsistent across files: `#FF4D00` (211 occurrences — bright red-orange), `#FF6B35`→`#FF6B9D` gradients, `#F4EFE6` cream backgrounds |
| Auth state | Zustand `useAuthStore` (`lib/auth.ts`) | React Context `useAuth` (`contexts/AuthContext.tsx`) — has its own parallel route-protection `useEffect` (redirects based on `BRAND_ONLY_ROUTES`/`CREATOR_ONLY_ROUTES` arrays) |
| Data fetching | TanStack Query hooks (`lib/hooks/use*.ts`) calling `lib/api.ts` | Direct calls to the same `lib/api.ts`, or legacy mock data (`lib/creatorData.ts`, `lib/mock-data.ts`, `lib/brandData.ts`) |
| Component set | `components/ui/*`, `components/sections/*`, `components/dashboard/*`, `components/auth/*` | `components/*` flat files: `Header`, `Hero` (a *third* Hero, distinct from both `sections/HeroSection` and `landing/Hero`), `RouteGuard`, `AuthModal`, `ProtectedRoute`, `DashboardSidebar`, `CreatorSidebar`, `BrandProfile`, `ProposalInbox`, `FilterBar`, `CreatorProfileModal`, `RecentProposals`, etc. |
| Example routes | `/`, `/discover`, `/login`, `/login/brand`, `/login/creator`, `/pricing`, `/onboarding`, `/dashboard/brand` (root overview), `/dashboard/brand/layout.tsx` | `/brand/profile`, `/brand/proposals`, `/creator/profile`, `/creator/proposals`, `/dashboard/page.tsx` (root `/dashboard`, unrouted by role) |

**It is not a clean split** — some routes *inside* the current `/dashboard/brand/*` and `/dashboard/creator/*` trees (e.g. `analytics`, `messages`, `proposals`, `profile`, `creators/[id]`) still import `contexts/AuthContext` rather than `lib/auth.ts`, so the legacy auth system is not confined to the legacy routes. Treat "which auth hook does this file import" as the reliable signal, not the URL.

There is also a **third, fully orphaned landing-page module**: `components/landing/*` (`LandingPage.tsx`, `Hero.tsx`, `Navigation.tsx`, `VideoGrid.tsx`, `CreatorCardFloat.tsx`, `SmoothScroll.tsx`, `HeroCreatorCard.tsx`) — a self-contained GSAP/ScrollTrigger-based design with a horizontal-scroll "how it works" section and a live-status indicator (`available`/`limited`/`unavailable`). Nothing outside that folder imports from it. It appears to be an earlier full redesign attempt that was superseded by `components/sections/*` but never deleted.

## 6. Features

### 6.1 Auth — email/password + 6 OAuth providers
- Email/password signup (bcrypt, 10 rounds) with mandatory `accountType` (`Brand`/`Creator`), Instagram handle required for creators at signup.
- Email verification and password reset: raw token emailed, SHA-256 hash stored server-side, 24h/1h expiry respectively.
- **OAuth**: Google (`passport-google-oauth20`), a *second* Google strategy scoped for `youtube.readonly` (separate `google-youtube` strategy so a user can grant YouTube access independently of basic login), Instagram (via `passport-facebook`, since Instagram Business auth goes through the Facebook Graph API), Twitter/X (manual OAuth2 PKCE via `twitter-api-v2`, not Passport — cookie-stored `state`/`codeVerifier`), LinkedIn (manual OIDC via `openid-client`), Snapchat (manual OIDC, custom-constructed `Issuer` since Snapchat isn't a standard discovery endpoint). Every strategy is registered defensively (`tryRegister` catches missing-credentials errors so the server doesn't crash if a provider's env vars are absent) and logs `✅`/`⚠️` at boot.
- New OAuth users get `accountType: 'Creator'` as a placeholder and are routed to `/onboarding` (`isNewUser` flag round-tripped through the callback redirect URL) to pick their real role.
- JWT in an httpOnly cookie, 7 days, `sameSite: 'none'` + `secure: true` in production (cross-site cookie, since frontend/backend are different origins), `sameSite: 'lax'` in dev.
- Meta/Facebook **Data Deletion Request** callback is implemented (`POST /api/instagram/deletion`) — HMAC-SHA256 signed-request verification, deletes the user's Instagram-linked data, returns the exact JSON shape Meta requires. This exists because the app is registered as a real Meta app requesting Instagram permissions.

### 6.2 Profiles
- `CreatorProfile` is the richest model in the schema: manual fields (bio, niches, pricing broken into `starting`/`reel`/`story`/`post`, availability, brandWork portfolio) **plus** a full cache of platform data pulled via OAuth: Instagram (follower/following/media counts, account type, recent media array with likes/comments), YouTube (subscriber/view/video counts, recent videos with per-video stats), and placeholder fields for Twitter/LinkedIn/Snapchat handles.
- `combinedFollowerCount` and `primaryPlatform` are computed server-side (`services/socialStats.ts`) by summing Instagram + YouTube + Twitter followers and picking whichever platform has the highest count.
- Public profile lookup by handle: `GET /api/profile/creator/by-handle/:handle` (case-insensitive regex match) — powers the `/c/[handle]` public profile route.
- The public creators list (`GET /api/profile/creators/public`) is **tiered by auth**: anonymous visitors get only profile pictures, authenticated users get full data — a deliberate "sign up to see more" gate baked into the API, not just the UI.

### 6.3 Creator Discovery
- `/discover` (marketing-facing) and `/dashboard/brand/discover` (post-auth) both hit the same tiered public-creators endpoint. The public `/discover` page shows a lock overlay + "Sign up to view creator details" on hover for anonymous visitors, linking to `/login/brand?mode=signup`.
- Niche filtering is client-side only (`NICHES` is a hardcoded array in the frontend; the backend stores `niches` as a free-text string array with no enum/validation).

### 6.4 Proposals
- Brand-only creation, creator-only accept/decline, one-way `pending → accepted/declined` status.
- `GET /api/proposals` enriches every proposal with both the brand's `companyName`/`logoUrl` and the creator's `profilePhoto` in a single batched response (two extra queries, not N+1).
- Dashboard summary endpoint (`/api/proposals/dashboard-summary`, brand-only) aggregates total captured `Payment` spend, distinct hired-creator count (from accepted proposals), and pending count — powers the brand overview `StatCard`s.

### 6.5 Real-Time Chat (Socket.io) — fully wired, not just scaffolded
This is meaningfully more complete than a typical "messages" feature:
- **Presence**: `services/presenceService.ts` keeps an in-memory `Map<userId, Set<socketId>>` (supports multiple tabs/devices per user). On connect/disconnect, `userOnline`/`userOffline` events broadcast to every conversation participant, and `lastSeen` is persisted to Mongo on full disconnect.
- **Delivery status**: messages are stamped `sent`/`delivered`/`read` — `delivered` is set immediately if the recipient is online, `read` when they open the conversation or the sender emits `markAsRead`.
- **Typing indicators**: `typing`/`stoppedTyping` socket events with a server-side 5s auto-timeout per conversation+user pair.
- **Reactions**: `addReaction`/`removeReaction` (one reaction per user per message, replaces on re-react), broadcast to all conversation participants.
- **Attachments**: messages carry a typed `attachments[]` array (`image`/`video`/`file`, with size/mimeType/thumbnailUrl) — uploaded first via `POST /api/uploads/chat-attachment`, then referenced in the socket `sendMessage` payload.
- **Offline notification fallback**: if the recipient isn't connected via socket, `services/notificationService.ts` sends a "New message from X" email via Resend — throttled to once per 15 minutes per recipient (`lastChatNotificationAt` in-memory map) to avoid spamming an offline user for every message in a burst.
- **Reply threading**: messages support a `replyTo` reference to another message ID.
- Frontend hooks (`lib/socket.ts`): `useSocket` (singleton connection, auto-reconnect), `useTypingIndicator`, `useOnlineStatus` (merges a REST snapshot with live socket events), `useUnreadCount` (TanStack Query, `refetchInterval: 30_000`).

### 6.6 Payments / Billing — built, but intentionally unmounted
- `backend/src/routes/payments.ts` is a complete Razorpay subscription flow: plan listing (Basic ₹999/mo, Pro ₹2999/mo — **note these INR test-era numbers don't match the live pricing page's USD "Studio $499/mo, Creator Pro $29/mo" tiers**, another sign these are from different development phases), subscription creation, HMAC signature-verified activation, webhook handling for `subscription.charged/cancelled/halted` and `payment.failed`.
- **`backend/src/config/razorpay.ts` hardcodes `const hasValidCredentials = false; // Force disabled for now`** with the real `new Razorpay(...)` initialization commented out entirely — `razorpay` always exports `null`.
- **`backend/src/server.ts` has the payments route import and `app.use('/api/payments', ...)` mount both commented out** — the route isn't even reachable, regardless of the Razorpay client state.
- The live `/pricing` page reflects this: every paid tier's CTA is "Join beta waitlist," not a checkout flow, and there is no Razorpay checkout script or payment form anywhere in the current frontend.

### 6.7 Creator Verification
- Self-request (`POST /api/verification/request`, creator-only, one pending request at a time) and auto-flag (`GET /api/verification/auto-flag`, unauthenticated in the route definition — no `authMiddleware`/`adminMiddleware` guard on this specific handler, intended to be hit by a trusted internal caller/cron, not exposed publicly in practice since nothing links to it from the frontend).
- The **nightly cron** (`jobs/socialSync.ts`, 03:00 UTC) is the real trigger in practice: it re-syncs every creator's Instagram/YouTube data in batches of 50 (1s delay between batches to respect rate limits), recomputes `combinedFollowerCount`, and auto-creates a verification request the moment a creator crosses 100,000 combined followers (matching `services/socialStats.ts`'s `computeCombinedFollowerCount`).
- Admin approval sets a badge tier (`verified` or `premium` — admin's choice, not automatic from follower count) and emails the creator; rejection requires a reason and allows re-application.

### 6.8 File Uploads
- Single `uploadCloudinary` multer instance (`config/cloudinary.ts`) shared across all upload routes — 10MB limit, allowed types include images, video (mp4/mov), and documents (pdf/doc/docx/txt/csv/zip) for the chat-attachment use case.
- Falls back to local disk (`backend/uploads/`) automatically if `CLOUDINARY_*` env vars are absent — and this fallback is **actively in use**: the repo has real committed files in `backend/uploads/` (7 images, one per user-id-prefixed filename), meaning local storage was used during development/testing.

### 6.9 Admin (backend-only, no frontend pages found)
`GET /api/admin/stats` (platform totals), `GET/PATCH /api/admin/users` + `/:id` (search/filter/paginate, suspend/unsuspend, patch `verificationBadge`/`isAdmin`/`plan`), full verification-request review queue. A `scripts/seed-admin.ts` script exists (`npm run seed:admin`) to bootstrap the first admin user, and `scripts/check-public-creators.ts` for a sanity-check query.

### 6.10 Analytics
- **Server-side**: `posthog-node`, no-ops safely if unconfigured, typed `trackEvent(distinctId, event, properties)` helper called from most mutating routes (signup, login, oauth_login, proposal lifecycle, verification lifecycle, message_sent from the socket layer).
- **Client-side**: `posthog-js` initialized in `app/providers.tsx` with `capture_pageview: true`, wrapped via `<PostHogProvider>`.

## 7. Frontend Route Map

| Route | Generation | Notes |
|---|---|---|
| `/` | Current | `HeroSection` → `BrandMarquee` → `HowItWorks` → `CreatorShowcase` → `SplitCTA` → `StatsStrip` → `WaitlistCTA` |
| `/discover` | Current | Public creator directory, tiered by auth, `usePublicCreators` (TanStack Query) |
| `/about` | Current (has its own `layout.tsx`) | |
| `/pricing` | Current | Brand tiers (Explorer free / Studio $499 coming-soon / Agency custom) + Creator tiers (Free / Pro $29 coming-soon), `Accordion` FAQ |
| `/login` | Current | Split-panel role picker (Brand vs Creator), reuses the `SplitCTA` hover-width pattern |
| `/login/brand`, `/login/creator` | Current | Each has its own `layout.tsx`; uses `components/auth/*` (AuthEmailForm, AuthSidePanel, SocialLoginButton ×6 providers) |
| `/onboarding` | Current | Post-OAuth-signup role/niche/company setup, Zustand `useAuthStore` |
| `/auth/callback` | Current | OAuth landing page — refreshes user, routes to `/onboarding` if new or straight to the role dashboard |
| `/forgot-password`, `/reset-password`, `/verify-email` | Current | Token-based flows matching the backend auth routes |
| `/c/[handle]` | Current | Public creator profile by Instagram handle (`GET /api/profile/creator/by-handle/:handle`) |
| `/creator/[username]` | Legacy-adjacent | A *second*, older public-profile route (username-based, not handle-based) — likely superseded by `/c/[handle]` but not removed |
| `/brand/[id]` | Current-ish | Public brand profile, has its own `BrandProfile.css` |
| `/dashboard/brand` (+ `layout.tsx`) | **Current** | `BrandSidebar` + `TopBar` + `CreateCampaignModal`, Zustand auth, hides global nav/footer via direct DOM manipulation |
| `/dashboard/brand/{discover,campaigns,creators,creators/[id],messages,profile,proposals,settings,analytics}` | **Mixed** | Some of these still import `contexts/AuthContext` (legacy) despite living under the current dashboard shell — see §5 |
| `/dashboard/creator` (+ `layout.tsx`) | Current/Mixed, same caveat | |
| `/dashboard/page.tsx` (bare `/dashboard`) | Legacy | Un-role-routed placeholder, imports `contexts/AuthContext` |
| `/brand/profile`, `/brand/proposals` | Legacy | Orange/cream theme, `contexts/AuthContext` |
| `/creator/profile`, `/creator/proposals` | Legacy | Same |
| `/privacy-policy`, `/terms-and-conditions`, `/refund-policy`, `/delivery-policy`, `/data-deletion` | Standalone | Legal pages; `/data-deletion` pairs with the Meta Data Deletion Request callback (§6.1) |
| `/sitemap.ts` | — | Next.js dynamic sitemap generator |

## 8. Data Models (MongoDB / Mongoose)

| Model | Notable fields beyond the obvious |
|---|---|
| `User` | `accountType` (Brand/Creator), `plan`/`subscriptionStatus` (Razorpay fields present but dormant), 6 sets of OAuth id/token fields (`googleId`, `instagramId`, `twitterId`, `linkedinId`, `youtubeId` + channel/tokens, `snapchatId` + token), `verificationStatus`/`verificationBadge`, `lastLoginAt`, `lastSeen` (presence), `password` is now **optional** (OAuth users have none) |
| `CreatorProfile` | Manual fields + a full cross-platform stats cache (Instagram: followers/following/media/recentMedia[]; YouTube: subscribers/views/videos/recentVideos[]) + `combinedFollowerCount`/`primaryPlatform` computed fields |
| `BrandProfile` | `companyName`, `industry`, `logoUrl`, `website`, `brandStory`, `totalRevenue`, `creatorsHired[]` (not actually populated by any route found — likely intended to sync from accepted proposals) |
| `Proposal` | `brandId`/`creatorId`/title/description/budget/deliverables/deadline/status (`pending`\|`accepted`\|`declined`), compound indexes on `{brandId,status}` and `{creatorId,status}` |
| `Payment` | `status` (`created`\|`authorized`\|`captured`\|`failed`\|`refunded`), `paymentType` (`subscription`\|`commission`\|`refund` — only `subscription` is ever created, and only by the currently-unmounted payments route) |
| `Conversation` | `participants[]`, `lastMessage`/`lastMessageAt`, `closed` |
| `Message` | `status` (`sent`\|`delivered`\|`read`), `attachments[]` (typed), `replyTo`, `reactions[]` (`{userId, emoji, createdAt}`), soft-delete (`deleted: true`, text replaced) |
| `VerificationRequest` | `requestType` (`auto_flag`\|`self_request`), `followerCount`, `platform`, `evidence[]` (`{type, url}`), admin-only `notes` |

## 9. REST API Reference

Mounted in `backend/src/server.ts` in this exact order (relevant because Express matches routes top-down, though there's no overlap here):

```
app.use('/api/auth',          authRoutes)
app.use('/api/profile',       profileRoutes)
app.use('/api/uploads',       uploadsRoutes)
app.use('/api/chat',          chatRoutes)
app.use('/api/proposals',     proposalRoutes)
app.use('/api/instagram',     instagramRoutes)
app.use('/api/youtube',       youtubeRoutes)
app.use('/api/admin',         adminRoutes)
app.use('/api/verification',  verificationRoutes)
// app.use('/api/payments',   paymentsRoutes)   ← commented out, see §6.6
app.use('/uploads', express.static(...))         // local-disk file serving
GET  /        → { name, status, version }
GET  /health  → { status, services: { cloudinary, resend, posthog } }  // live config-check endpoint
```

### `/api/auth`
`POST /signup` · `POST /login` · `GET /me` · `POST /logout` · `GET /token` (raw JWT for socket auth) · `PUT /profile` (fullName) · `PUT /password` · `DELETE /account` · `POST /request-password-reset` · `POST /reset-password` · `POST /verify-email` · `POST /resend-verification` · `POST /onboarding` (sets `accountType` post-OAuth) · `GET /google`, `/google/callback` · `GET /youtube`, `/youtube/callback` · `GET /instagram`, `/instagram/callback` · `GET /twitter`, `/twitter/callback` · `GET /linkedin`, `/linkedin/callback` · `GET /snapchat`, `/snapchat/callback`

### `/api/profile`
`PUT /creator` · `POST /creator/refresh-stats` (rate-limited: 1 per 10 min, re-syncs Instagram+YouTube+recomputes combined followers) · `PUT /brand` · `GET /brand/:userId` · `GET /creator/by-handle/:handle` (public) · `GET /creator/:userId` · `GET /creators/public` (tiered by auth) · `GET /creators/:userId/public` · `GET /brand/:userId/public` · `GET /brands/public`

### `/api/proposals`
`GET /summary` · `GET /dashboard-summary` (brand-only) · `POST /` (brand-only) · `GET /` (filterable `?status=`) · `GET /:id` · `PUT /:id/accept` / `PUT /:id/decline` (creator-only)

### `/api/chat`
`GET /summary` · `GET /online-status?userIds=` · `GET /unread-count` · `GET /conversations` · `GET /:conversationId` (marks read) · `POST /conversations` (find-or-create) · `PUT /messages/:id` / `DELETE /messages/:id` (sender-only) · `PUT /conversations/:id/close`

### `/api/uploads`
`POST /profile-photo` · `POST /brand-work` (up to 6 files) · `POST /brand-logo` · `POST /cover-image` · `POST /chat-attachment`

### `/api/instagram`
`GET /sync` (live Graph API call) · `GET /data` (cached) · `POST /deletion` (Meta signed-request callback) · `GET /deletion-status`

### `/api/youtube`
`GET /sync` · `GET /data` · `POST /refresh-token`

### `/api/verification`
`POST /request` (creator-only) · `GET /status` · `GET /auto-flag` (unguarded route handler — see §6.7)

### `/api/admin` (all require `isAdmin: true`)
`GET /stats` · `GET /users` (paginated/filterable) · `GET /users/:id` · `PATCH /users/:id` · `POST /users/:id/suspend` / `/unsuspend` · `GET /verification-requests` (+ `/:id`) · `POST /verification-requests/:id/approve` / `/reject`

### `/api/payments` (routes exist, **not mounted** — see §6.6)
`GET /plans` · `POST /create-subscription` · `POST /verify-subscription` · `GET /subscription-status` · `POST /cancel-subscription` · `POST /webhook`

## 10. Real-Time Layer (Socket.io)

Auth: JWT read from `socket.handshake.auth.token`, falling back to the `token` cookie, falling back to a `?token=` query param. On connect, the socket joins a room named after its own `userId` (so server code emits to `io.to(userId)` for private delivery).

| Event (client→server) | Payload | Server behavior |
|---|---|---|
| `sendMessage` | `{conversationId, receiverId, text?, attachments?, replyTo?}` | Persists `Message`, updates `Conversation.lastMessage`, emits `newMessage` to both parties, emits `messageDelivered` if recipient online else sends a throttled email |
| `typing` / `stoppedTyping` | `{conversationId, receiverId}` | Emits `userTyping`/`userStoppedTyping`; server auto-clears typing after 5s |
| `markAsRead` | `{conversationId, senderId}` | Bulk-updates messages to `read`, emits `messagesRead` to the original sender |
| `addReaction` / `removeReaction` | `{messageId, emoji}` | Emits `reactionAdded`/`reactionRemoved` to all conversation participants |

| Event (server→client) | Fired when |
|---|---|
| `userOnline` / `userOffline` | A user with shared conversations connects/fully disconnects |
| `newMessage`, `messageDelivered`, `messagesRead`, `userTyping`, `userStoppedTyping`, `reactionAdded`, `reactionRemoved` | Mirrors the client events above |

## 11. Environment Variables

**Backend** (`backend/src/config/env.ts` just calls `dotenv.config()` — no `.env.example` was found in the repo, so this list is compiled directly from every `process.env.*` reference in source):

```
# Core
JWT_SECRET, MONGODB_URI (or DATABASE_URL), PORT, NODE_ENV
FRONTEND_URL                 # used in every email link and OAuth redirect fallback
CORS_ORIGIN                  # comma-separated list; *.vercel.app and *.up.railway.app are always allowed in addition
ENABLE_CRON                  # set to 'false' to skip the nightly social-sync job

# OAuth — each provider is independently optional; missing creds just skip that strategy at boot
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_CALLBACK_URL   # falls back to the GOOGLE_* pair if unset
INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, INSTAGRAM_CALLBACK_URL   # these are actually Facebook App credentials
FACEBOOK_APP_SECRET            # separate from INSTAGRAM_CLIENT_SECRET — used only to verify Meta's deletion-request HMAC
TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, TWITTER_CALLBACK_URL
LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_CALLBACK_URL
SNAPCHAT_CLIENT_ID, SNAPCHAT_CLIENT_SECRET, SNAPCHAT_CALLBACK_URL

# Third-party services (each has a safe no-op fallback if unset)
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
RESEND_API_KEY, EMAIL_FROM                     # default: "CreatorLyff <support.creatorlyff@gmail.com>"
POSTHOG_API_KEY, POSTHOG_HOST                  # default host: https://us.i.posthog.com

# Razorpay — coded but not currently reachable (§6.6)
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, RAZORPAY_PLAN_BASIC, RAZORPAY_PLAN_PRO
```

**Frontend**:
```
NEXT_PUBLIC_API_URL            # backend base URL, default http://localhost:5001
NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
```

## 12. Deployment

- **Frontend**: Vercel (Next.js default target; `DEPLOYMENT_CHECKLIST.md` explicitly recommends it).
- **Backend**: two supported paths, both present in the repo —
  - `backend/vercel.json`: serverless deploy, routes every request to `dist/server.js` via `@vercel/node` (see `BACKEND_DEPLOYMENT.md` for the CLI walkthrough).
  - `backend/ecosystem.config.js`: PM2 cluster-mode config (`instances: 'max'`, 500MB memory-restart cap, graceful shutdown with a 5s kill timeout) for a persistent-server host — `RAILWAY_SETUP.md` documents Railway specifically, and `server.ts`'s CORS/Socket.io config explicitly allowlists `*.up.railway.app` origins, suggesting Railway is (or was) the live backend host rather than Vercel serverless.
- **Database**: MongoDB Atlas (`MONGODB_ATLAS_SETUP.md` — free-tier cluster walkthrough).
- `npm run dev` at the repo root uses `concurrently` to run `frontend` (`next dev`) and `backend` (`tsx watch src/server.ts`) together; `postinstall` at the root installs both sub-projects' dependencies.

## 13. Known Inconsistencies & Rough Edges

Worth knowing before making changes — none of these block the app from running, but they're easy to trip over:

- **Two auth systems, not cleanly separated** (§5): `contexts/AuthContext` and `lib/auth.ts`'s Zustand store both exist, are both actively imported, and don't share state — a component using one has no visibility into a sibling using the other.
- **Two abandoned Hero/landing redesigns** still in the tree: `components/Hero.tsx` (flat, orange gradient) and `components/landing/*` (GSAP-based, its own dark theme with an undefined-anywhere `--status-color` variable) — neither is rendered by the current `/` route (`components/sections/HeroSection.tsx` is).
- **`/creator/[username]` vs `/c/[handle]`**: two different public creator-profile routes exist; the backend only has a by-handle lookup (`/api/profile/creator/by-handle/:handle`), suggesting `/c/[handle]` is the intended current route and `/creator/[username]` is a leftover.
- **Pricing numbers don't match between layers**: the backend's dormant Razorpay routes hardcode ₹999/₹2999 (INR, India-focused), while the live `/pricing` page shows $499/$29 (USD) — these were clearly written in different phases and were never reconciled, and neither is currently chargeable (§6.6).
- **`GET /api/verification/auto-flag` has no auth guard** in its route definition — it's not linked from the frontend and is presumably meant to be triggered by the internal cron/an admin script only, but as written it's a publicly reachable endpoint that mutates verification state. Worth a second look before any internet-facing deploy.
- **`three` / `@react-three/fiber` / `@react-three/drei`** are installed frontend dependencies with no importing file found anywhere in `app/` or `components/` — likely scaffolding for a not-yet-built 3D element, or a leftover from a removed one.
- **`BrandProfile.creatorsHired[]`** is modeled but never written to by any route — if a "creators you've worked with" feature is expected on brand profiles, the data pipeline for it doesn't exist yet.
