# System Architecture

## 1. Overview
Smart Mazdur is an on-demand skilled labour marketplace designed for the Karachi pilot market, connecting customers with vetted professionals for home maintenance (Plumbing, Electrical, AC Repair).

The system follows a **customer-selects-from-a-shortlist** model:
1. Customer describes a job and selects location.
2. System computes an eligible shortlist of nearby, available, verified professionals.
3. Customer picks one professional to request.
4. Professional accepts or declines with an automatic timeout expiry.
5. Work progresses through visit, itemized quote, customer approval, completion, cash payment recording, and verified review.

## 2. Technology Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Database & Auth:** Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Validation:** Zod for shared schema validation across forms and server mutations
- **Storage:** Supabase Storage (Private buckets for job photos and verification documents, accessed via signed URLs)
- **Testing:** Vitest for unit & integration testing

## 3. Layered Design
```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/          # Authentication flows (login, register, reset)
│   ├── (marketing)/     # Landing, how it works, safety, legal
│   ├── customer/        # Customer dashboard, job request wizard, shortlist, active job
│   ├── professional/    # Worker onboarding, dashboard, job requests, active job, quotes
│   ├── admin/           # Provider approvals, catalogue, disputes, finance ledger
│   └── api/             # Webhooks / lightweight handlers where needed
├── components/           # Reusable UI components
│   ├── ui/              # Buttons, inputs, modals, cards, badges
│   ├── layout/          # Navbar, footers, role navigation
│   ├── jobs/            # Job status timeline, quote builder, media upload
│   └── professionals/   # Provider card, verification badges, rating stars
├── features/             # Domain logic & service boundaries
│   ├── auth/            # Session, role checking, permissions
│   ├── catalogue/       # Categories, tasks, pricing modes
│   ├── matching/        # Shortlist eligibility filtering and deterministic scoring
│   ├── bookings/        # Booking state machine and concurrency-safe transitions
│   ├── quotes/          # Itemized quote calculations and immutable versioning
│   ├── reviews/         # Verified-job-only reviews
│   └── admin/           # Provider vetting, dispute handling, ledger
├── lib/                  # Infrastructure & utility modules
│   ├── supabase/        # Browser client, server client, service-role client
│   ├── money/           # Safe currency math (numeric/cents/PKR formatters)
│   ├── location/        # Service area verification & manual fallback
│   └── validation/      # Zod schemas for all mutations
└── types/                # Database entities, status enums, API types
```

## 4. Key Architectural Invariants
1. **Never trust client payloads:** All mutations, prices, quote totals, and state transitions are validated on the server or via database transactions.
2. **Atomic booking acceptance:** Request acceptance is handled via conditional PostgreSQL updates or stored procedures (`rpc_accept_booking_request`) to prevent race conditions where two providers claim the same job or a provider is double-booked.
3. **Privacy by default:** Private customer addresses and contact numbers are masked until a booking is accepted by a provider. Public provider profiles only project approved public fields.
4. **Honest verifications:** Clear separation between identity document review and practical trade skill assessments. No simulated integrations or fake badges.
