# Smart Mazdur — Skilled Labour Marketplace (Karachi Pilot)

Smart Mazdur is an on-demand skilled labour marketplace designed for the Karachi pilot market, connecting customers with vetted professionals for home maintenance (Plumbing, Electrical, AC Repair).

The marketplace operates on a **customer-selects-from-a-shortlist** model:
1. Customer describes a job and selects location in Karachi.
2. The platform presents an eligible shortlist of nearby, verified professionals.
3. Customer picks one professional to request.
4. The professional accepts or declines with an automated 2-minute server-enforced timeout.
5. Work progresses through visit, itemized quotation, explicit customer approval, completion, cash payment recording, and verified review.

---

## Technical Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Database & Auth:** Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Validation:** Shared Zod schemas on client and server
- **Storage:** Private Supabase Storage buckets with signed URLs
- **Testing:** Vitest

---

## Quick Start

### 1. Prerequisites
- Node.js v20+ or v22+
- npm v10+

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project keys if connecting to a live Supabase instance. Note: Local development features demo seed data fallbacks so the app can be explored immediately.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Tests
```bash
npm test
```

### 6. Build
```bash
npm run build
```

---

## Route Overview
- `/` — Landing page with pilot disclosures, service categories, and CTAs
- `/services` — Launch service catalogue (Plumbing, Electrical, AC Repair)
- `/services/[slug]` — Detailed category scope, inclusions/exclusions, pricing models
- `/how-it-works` — End-to-end booking workflow explanation
- `/safety-and-verification` — Honest disclosure of manual CNIC review vs practical trade skills testing
- `/terms`, `/privacy`, `/cancellation-policy` — Pilot policies and visit charge protections
- `/customer` — Customer dashboard
- `/customer/requests/new` — Request creation wizard with category/task/urgency/location
- `/customer/requests/[id]/professionals` — Shortlist comparison & request dispatch
- `/professional/onboarding` — Technician application wizard
- `/professional/dashboard` — Technician incoming requests, availability toggle & active job
- `/admin` — Operations console for manual verification logging & audit logs

---

## Core Documentation
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System layers, state transitions, and concurrency safeguards
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — PostgreSQL schema, relationships, and column specifications
- [`docs/SECURITY.md`](docs/SECURITY.md) — RLS policies, least-privilege rules, private storage policies
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) — Pilot procedures, master technician skills assessment guidelines
- [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md) — 14 tracked operational decisions with owners and action items
