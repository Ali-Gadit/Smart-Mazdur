# Skilled Labour Marketplace — Complete Product & Engineering Plan

**Document type:** Product requirements + technical specification + phased implementation roadmap  
**Working product name:** TBD (use a configurable placeholder; do not invent a final brand)  
**Initial market:** One limited service area in Karachi, Pakistan  
**Initial service categories:** Plumbing, electrical work, and AC repair/maintenance  
**Primary product model:** Yango-style on-demand discovery and booking, where customers compare a shortlist of suitable nearby professionals and choose whom to request  
**Preferred stack:** Next.js, TypeScript, Tailwind CSS, Supabase, PostgreSQL  
**Currency:** PKR (Rs.)  
**Status:** Initial implementation specification; commercial assumptions must be validated in a real-world pilot.

---

## 0. Instructions for the Coding Agent

Treat this document as the product source of truth. Build the product in small, testable phases instead of attempting a huge one-shot implementation.

### Mandatory working rules

1. **Inspect before changing.** First inspect the existing repository, package manager, framework version, scripts, existing components, and any Supabase setup. Preserve working code. If the repository is empty, scaffold the application.
2. **Create an implementation checklist.** Convert this specification into a short task list or project board and keep it updated as work progresses.
3. **Build vertical slices.** Complete one working flow at a time: application setup, auth, profiles, service catalogue, customer request, professional shortlist, booking acceptance, quotation, completion, reviews, admin operations.
4. **Use supported stable dependencies.** Prefer the repository's existing package manager and versions. Do not upgrade unrelated packages without reason. Commit the lockfile.
5. **Never expose secrets.** Server-only secrets must not use a `NEXT_PUBLIC_` prefix. Use `.env.example` with blank/example values, never real credentials.
6. **Never trust the client.** Validate and authorize every mutation on the server or in secured database functions. Enforce database access through Supabase Row Level Security (RLS), not UI hiding alone.
7. **No fake production behavior.** Do not present dummy professionals, fake ratings, fake verification badges, invented live locations, made-up ETAs, or simulated successful payments as real. Seed clearly marked local development/demo data only.
8. **No false verification claims.** The MVP should support manual verification records and admin decisions. Do not claim that identity was officially verified by NADRA or that a worker passed a practical assessment unless the defined process actually happened and an authorized integration/assessor confirms it.
9. **Make integrations optional.** The application must run locally without paid maps, SMS, WhatsApp, or payment API keys. Provide a reliable manual/location-entry fallback. Optional integrations must have clear adapter boundaries and setup documentation.
10. **Explain assumptions.** For unresolved business decisions, implement configurable defaults and document them in `docs/OPEN_QUESTIONS.md`. Do not block ordinary progress by asking questions whose answers are not necessary to build the current phase.
11. **Quality before breadth.** Do not implement all 90+ service categories in the first release. The database and UI should support adding categories through the admin panel later.
12. **Do not claim completion without evidence.** Run formatting, lint, type-check, migrations, and tests that exist in the project. Report which commands passed and which could not be run.

### Required first response from the coding agent

Before making substantial edits, report:
- repository structure and detected stack;
- existing implementation worth preserving;
- missing prerequisites (if any);
- a phased task checklist;
- the first vertical slice to implement.

Then begin the first phase. Do not only return a plan; make implementation progress in the repository.

---

## 1. Product Vision

Build a trusted local marketplace that helps people book qualified skilled professionals for home repairs and maintenance. Customers should be able to describe a job, compare a shortlist of nearby and eligible professionals, inspect their profiles and charges, request a specific professional, follow booking progress, approve any quotation, and review the completed work.

Professionals should be able to create a profile, select the services they genuinely provide, complete verification steps, set service areas and availability, receive requests, accept or decline jobs, submit quotations, track jobs, and build a trustworthy work history.

Admins should be able to review professionals, record the exact checks performed, manage the catalogue and pricing rules, resolve complaints, and monitor marketplace performance.

### Core value proposition

**Find an appropriate professional nearby, understand the visit charge before booking, and agree on repair costs before extra work begins.**

### Marketplace model

This is a **customer-selects-from-a-shortlist** model, not automatic assignment:

1. Customer selects a service and describes the problem.
2. The system finds eligible professionals in the service area.
3. Customer compares the shortlist.
4. Customer chooses one professional and sends a request.
5. The professional accepts or declines; a timeout expires unanswered requests.
6. If declined/expired, customer can return to the shortlist and choose another professional.
7. Once accepted, the booking progresses through arrival, inspection/quotation if needed, work, completion, and review.

Only one professional request should be active for one job at a time in the MVP. This prevents multiple workers from independently accepting the same customer request. Past request attempts remain in the booking history.

---

## 2. Initial Scope and Non-Goals

### 2.1 MVP scope

- Responsive web application using Next.js; mobile-first, usable on Android phones.
- Customer, professional, and administrator roles.
- Authentication and account/profile management.
- Service catalogue initially containing plumbing, electrical work, and AC repair/maintenance.
- Professional service skills, service coverage, availability, verification status, and public profile.
- Customer job request with description, service category, urgency/schedule, address, optional photos, and optional problem details.
- Candidate shortlist ranked by eligibility first, then relevant quality/reliability/distance signals.
- Request a selected professional; accept, decline, and expiry paths.
- Booking status history and customer-visible updates.
- Fixed-price tasks where the task scope can be clearly defined; visit/inspection fees; itemized quotations for unknown or complex repairs.
- Customer approval of quote and quote revisions before extra work starts.
- Completion confirmation, reviews, complaints/disputes, and admin follow-up.
- Basic admin dashboard for professional approvals, catalogue management, booking oversight, and dispute handling.
- Cash/off-platform settlement recording for the pilot, with clear status and auditability. No fake online payment flow.
- Configurable platform commission calculation/records for business experiments; do not assume automatic collection is solved.
- Secure database permissions and audit events for sensitive actions.
- Local development seed data that is explicitly marked as demo data.
- README, environment example, migrations, and tests.

### 2.2 Explicitly out of scope for initial MVP

Do not make these prerequisites for launch:
- Native Android/iOS applications.
- Nationwide service availability.
- All 90+ service categories.
- Automatic real-time route/traffic ETA unless a map provider is configured.
- Automated NADRA identity verification without an authorized service agreement and approved process.
- AI skill verification, automatic background checks, or AI decisions about professional safety.
- Escrow, wallet, automated payouts, or production card payments unless a suitable payment provider and business/legal setup are completed.
- Complex bidding among many workers for every small repair.
- Subscriptions, paid boosted listings, advertising, and loyalty programs.
- Multi-worker construction-project management.
- Guarantee or insurance promises that the company has not actually funded and legally arranged.

### 2.3 Future expansion

When the pilot demonstrates demand and reliable operations, consider:
- Carpentry, professional painting, tile fixing, solar/UPS, water-pump repair, and additional categories.
- Scheduled recurring maintenance, landlord/property-manager accounts, and business maintenance contracts.
- Urdu interface and accessible voice-assisted requests.
- SMS/WhatsApp notifications with user consent and provider-compliant templates.
- Real map pins, turn-by-turn navigation links, and genuine ETA integration.
- Secure online payments and provider payouts through a supported local provider.
- Native app or installable PWA enhancements.
- Warranty workflows and contractor-team/project jobs.

---

## 3. Users, Roles, and Permissions

### 3.1 Customer

Can:
- create/manage their own account and profile;
- create a job request, save an address, upload job photos, and select a service;
- view only professionals eligible for their request and public professional information;
- request one selected professional at a time;
- view their own jobs, job timeline, approved quotes, payment records, and messages/notifications;
- approve/reject a quote or change request;
- cancel according to disclosed rules;
- confirm completion, review a completed job, and open a dispute;
- request data export/deletion through the defined privacy process.

Cannot:
- view other customers' private addresses, job media, contact data, or history;
- alter job price, verification status, professional rating, or payment state directly;
- mark a job as completed on behalf of a professional except through the defined customer confirmation action;
- view a professional's precise live location before a booking requires it.

### 3.2 Professional

Can:
- create/manage their own professional profile;
- apply to offer services and provide relevant skill/experience details;
- set service areas, working hours, available/offline status, and (where needed) coarse current location;
- view job details shared with them for requests they receive;
- accept or decline a request before it expires;
- update booking status for their active jobs using permitted transitions;
- submit itemized quotations or proposed changes;
- record work notes and completion evidence;
- see their own completed jobs, reviews, earnings/settlement records, and complaints relevant to them;
- report a safety concern or customer misconduct.

Cannot:
- approve their own identity or skills verification;
- change published customer reviews or platform commission settings;
- access jobs belonging to unrelated customers/providers;
- start additional chargeable work before the customer approves the quote/change;
- change a confirmed quote without creating a documented revision.

### 3.3 Administrator / Operations staff

Can, according to assigned permission scope:
- approve, reject, pause, or suspend provider applications;
- record verification checks and skills-assessment results;
- manage service categories, tasks, reference pricing rules, and enabled service areas;
- view and support booking operations;
- investigate reports, mediate disputes, and record resolution decisions;
- view operational metrics and a minimally necessary financial ledger;
- correct data only through audited administrative actions.

Admin access must be granted server-side via trusted role assignment or a secure allowlist/claims mechanism. A user must never be able to make themselves an admin by editing their profile or sending a request payload.

### 3.4 Role model

A user may be both a customer and a professional; do not force mutually exclusive account types. Maintain the base user profile separately from professional profile/application status. Admin is a privileged permission, not a user-editable public role.

---

## 4. Service Catalogue and Launch Geography

### 4.1 Launch categories

1. **Plumbing** — leak diagnosis, tap/sanitary fitting repair, drain issues, pipe repair, and other admin-defined tasks.
2. **Electrical work** — fault diagnosis, switch/socket repair, fan/light installation under safe conditions, and other defined tasks.
3. **AC repair and maintenance** — diagnosis, cleaning/servicing, cooling issues, and other defined tasks.

Only offer individual fixed-price tasks when the scope and assumptions are explicit. Category-level requests can use inspection/quotation workflows.

### 4.2 Service areas

- Launch in one limited, explicitly configured Karachi service area.
- Do not hardcode the entire city as serviceable by default.
- Admin can enable/disable areas and associate providers with one or more areas.
- Customer enters an address/area; map pin or GPS is optional when no map integration is configured.
- If location permission is denied, allow manual address and area selection.
- Avoid exposing the customer's exact address on public or shortlist pages.

### 4.3 Add categories through data, not code changes

Create an admin-managed catalogue with category, name, description, icon key, active flag, order, price mode(s), and optional trade-specific requirements. Adding a future category should be primarily a data/admin task, not a structural rewrite.

---

## 5. End-to-End Customer Journey

### 5.1 Entry and account

1. Customer visits the site and understands service coverage and booking process.
2. Customer signs in/registers using Supabase Auth-supported methods configured for the project.
3. Customer completes a minimal profile: display name and verified contact method where configured.
4. Before creating the job, explain what happens to their location and photos.

### 5.2 Request creation

Customer chooses:
- service category and, optionally, a specific task;
- problem description;
- optional photos or short video only if the chosen storage policy permits it;
- urgency: as soon as possible or scheduled time;
- service address/area and optional coordinates;
- access notes that are shared only with the selected professional at the appropriate point;
- whether the task has a known, fixed scope or needs inspection/diagnosis.

Validate file size/type, description length, service area, time, and category on both client and server. Use private storage for job media and signed URLs with limited lifetimes.

### 5.3 Professional shortlist

Show suitable professionals with information that is real and current enough to support a decision:
- display name and approved profile photo, if supplied;
- relevant skills/services offered;
- identity verification status and skills assessment status shown separately;
- verified review average and review count, only when earned through valid completed jobs;
- completed-job count if available;
- approximate distance or service area;
- estimated arrival only if calculated from a configured, real source; otherwise omit ETA;
- online/availability freshness indicator;
- visit/inspection fee or fixed task price, with scope/conditions;
- earliest available time for scheduled jobs.

Provide sorting options such as **Recommended**, **Nearest**, **Highest rated**, and **Soonest available**, only when the inputs are meaningful. Default ranking must not imply guarantees. Explain any relevant labels plainly.

If no one qualifies, show a helpful empty state: broaden area, choose a scheduled time, change service details, or request manual assistance. Never show invented providers.

### 5.4 Request a selected professional

1. Customer checks provider profile and the visit/task price.
2. Customer reviews the job summary, cancellation rules, and information shared with the provider.
3. Customer clicks **Request booking**.
4. Create a `booking_request` with a pending status and a server-side expiry time.
5. Notify the selected professional through the available in-app notification mechanism.
6. Customer sees **Waiting for response** with a cancellation option if still pending.
7. Provider accepts/declines. A response after expiry must not accept the job.
8. On decline/expiry, update the job/request history and let the customer return to the shortlist or create another request.
9. On acceptance, confirm the professional and booking atomically, prevent conflicting active bookings, and reveal only the appropriate booking details.

### 5.5 Arrival and repair

Provider status progression for a typical job:
- accepted/confirmed;
- on the way (optional if genuinely supported);
- arrived;
- inspection in progress, if needed;
- quotation required, if diagnosis changes the estimated scope;
- quote approved;
- work in progress;
- completion requested;
- customer confirms completion;
- completed.

For a fixed-price defined task, the quote step may be skipped if scope has not changed. If new work or materials are needed, provider submits a documented change/quote and waits for approval.

### 5.6 Completion and review

- Provider records a completion note and, where appropriate, optional before/after evidence.
- Provider requests completion.
- Customer confirms completion or reports an issue.
- If the customer does not respond within a configurable window, do not silently treat the work as fully approved without a defined policy; flag it for support/manual resolution.
- On completion, allow one review per completed job from the customer who booked it.
- Only valid completed bookings can generate public ratings.
- If the customer disputes the work, freeze review eligibility until the defined resolution state, or otherwise follow one consistent documented policy.

---

## 6. Professional Journey

### 6.1 Application and profile

Collect only necessary information initially:
- display name and contact method;
- profile photo (optional but encouraged);
- short bio and experience description;
- services and specific tasks offered;
- service areas and working hours;
- experience/certification evidence where relevant;
- preferred language, if supported;
- travel radius/availability preferences where relevant.

Do not publicly display CNIC numbers, full identity documents, private phone numbers, or exact home addresses.

### 6.2 Verification statuses

Use separate status fields, never one vague boolean called `verified` for everything:
- account/contact status;
- identity review status;
- skills assessment status per relevant trade;
- optional qualification/certificate review status;
- provider activation status.

Possible review states: `not_started`, `pending`, `approved`, `rejected`, `expired`, `needs_more_information`. Keep a timestamp, reviewer, method, outcome, and reason where appropriate.

For MVP, admins can record manual outcomes after the defined evidence/check actually exists. If no official identity provider is integrated, label the record as **identity details reviewed by platform** only if that is what staff actually did; do not imply a direct NADRA check. A CNIC document by itself is not proof of a worker's technical skill or a full criminal/background check.

### 6.3 Skill assessment

- Use a trade-specific checklist and assessment status.
- Record who assessed, what was tested, date, result, and follow-up requirement.
- Keep records of failed/rejected tests and reassessment history privately.
- Require additional qualification or manual approval for higher-risk work where the company establishes that requirement.
- Do not let the provider edit assessor results.

### 6.4 Availability

- Provider can set Online/Offline and working hours.
- A provider is eligible only if active, online/available, within service area, approved for the requested service, and not conflicting with an active booking.
- Mark availability stale after a configurable time without a heartbeat/update.
- Do not claim a person is available just because their profile exists.
- If real-time location is unavailable, use their selected service area and let them confirm travel distance after receiving the request.

### 6.5 Job request actions

- Show request details and disclosed visit fee before acceptance.
- Accept or decline with one tap.
- Pending requests expire after a configurable duration (reasonable initial default: 2 minutes, subject to testing).
- Provider can decline without a punitive penalty; repeated acceptance followed by avoidable no-shows/cancellations can affect reliability.
- If provider accepts and then cancels, record reason and allow customer to select another provider or receive assistance.

---

## 7. Pricing, Quotations, and Financial Rules

### 7.1 Supported pricing models

**A. Fixed-price task**  
Use only for a precisely scoped task with stated assumptions, inclusions, exclusions, and labour/material treatment. Display the amount before the customer sends a booking request.

**B. Visit/inspection fee + repair quote**  
For unknown faults. Display the fee and what it covers before booking. After inspection, provider submits a quote. The quote separates labour, materials, any applicable platform/service fees, exclusions, and validity/expiry.

**C. Project quote**  
For jobs too large/variable for an instant fixed price. This may be added later; MVP can implement the basic quotation data structure without building a complete construction-project workflow.

### 7.2 Quote requirements

Each quote should capture:
- quote number/version;
- job id and provider id;
- labour line items (description, quantity/unit where applicable, rate, total);
- material line items and who buys/provides the materials;
- visit/inspection amount if chargeable;
- discount/tax only where applicable and correctly configured;
- total amount and currency (`PKR`);
- work description/scope;
- excluded work and assumptions;
- estimated duration and proposed start/completion where useful;
- expiry time;
- status: draft, submitted, approved, rejected, expired, superseded, cancelled;
- customer approval timestamp and user;
- revision reason and link to prior quote.

Once approved, a quote is immutable. Changes require a new version with a reason and customer approval. Preserve the history for dispute resolution.

### 7.3 Customer pricing protections

- Never start extra chargeable work until the customer approves the relevant quote/change.
- Show visit fees before the request is submitted.
- Clearly state if materials are excluded.
- Provide cancellation rules and any non-refundable fee policy before confirmation.
- Do not invent standard prices. Admin can set indicative ranges only after research and must label them as indicative, not guaranteed.

### 7.4 MVP payments and commission

The pilot may use cash payment directly between customer and professional, recorded in the system. The interface must say that the payment is cash/off-platform and must not imply that the platform processed or guaranteed it.

Record:
- quoted/approved job total;
- reported amount paid;
- method (`cash`, `online`, `other`);
- payer/payee and recorded-by user;
- payment status (`not_due`, `due`, `reported_paid`, `confirmed_paid`, `disputed`, `refunded`, as relevant);
- timestamps and reconciliation notes.

For a pilot using cash, both sides may confirm the payment status. Disagreements can be referred to admin; never silently overwrite the other side's confirmation.

Implement configurable commission rules and a ledger that can calculate an expected platform fee for reporting. Do not claim that commission has been collected unless it is actually reconciled. Any worker payment collection, payout, escrow, tax treatment or automated split settlement needs a later provider/legal decision.

Do not store payment card details.

---

## 8. Matching and Shortlist Logic

### 8.1 Eligibility filters (must pass before ranking)

A professional can appear only if:
1. account is active and the professional profile is approved for marketplace use;
2. they offer the requested category/task;
3. required identity/skill statuses meet the policy for that task;
4. they serve the customer's service area or fall within an explicitly supported travel radius;
5. their availability is current and compatible with the job time;
6. they are not suspended, blocked, or conflicted by an active booking;
7. the visit/task pricing needed for comparison is defined.

### 8.2 Ranking signals

Rank eligible candidates using a transparent, configurable score that may consider:
- skill/task match;
- distance or service-area fit;
- actual availability/earliest slot;
- valid completed-job rating and review count (avoid over-weighting one review);
- reliability (accepted-to-completed ratio, provider-caused cancellations, no-shows, adjusted for sample size);
- verified completed jobs and recency of relevant work.

Do not use race, religion, gender, or other protected traits in ranking. Do not let paid placement override eligibility or safety. Do not penalize providers unfairly for customer cancellations or factors they cannot control.

Start with simple, explainable rules; do not build machine learning until enough good data exists. Include deterministic tests for filters and sorting.

### 8.3 Location and ETA integrity

- Ask for location permission only when needed and explain why.
- Allow manual address/area entry.
- Store only the location detail needed to perform the service.
- Before acceptance, show approximate distance/area, not precise worker live coordinates or customer's exact address.
- Reveal precise customer address after provider acceptance, subject to booking needs.
- If no real maps/route provider is configured, show distance or service area only; do not make up an arrival estimate.
- If a geolocation update is stale, reflect that fact or remove the live/available indicator.

---

## 9. Booking State Machine and Concurrency

Implement explicit, validated state transitions. Keep a job timeline/event table for critical transitions.

### 9.1 Suggested job statuses

- `draft`
- `open` (request details complete and shortlist may be requested)
- `request_pending`
- `confirmed` (a provider accepted)
- `scheduled` (if accepted for a future time)
- `en_route` (only if supported)
- `arrived`
- `inspection_in_progress`
- `quote_pending`
- `quote_approved`
- `in_progress`
- `completion_requested`
- `completed`
- `cancelled`
- `disputed`

Use a single documented state transition function or server-side command per action. Avoid allowing arbitrary status updates from the browser.

### 9.2 Booking request statuses

- `pending`
- `accepted`
- `declined`
- `expired`
- `cancelled`

Each request has `requested_at`, `expires_at`, `responded_at`, response reason (where supplied), and actor metadata.

### 9.3 Required invariants

- Only the job owner can submit/cancel their request before the relevant cutoff.
- Only the selected provider can accept/decline the request sent to them.
- Expired requests cannot be accepted.
- Only one pending provider request per job in the MVP.
- Only one provider can be attached as the accepted provider for a job.
- A professional cannot accept overlapping active bookings when the scheduled times conflict.
- Status transitions must be atomic and validated against current database state.
- On accept, acquire a database lock/perform a conditional update or use a PostgreSQL RPC transaction so two acceptances cannot win simultaneously.
- Any update to a price, quote approval, cancellation, completion, payment confirmation, verification status or dispute decision must be auditable.

### 9.4 Cancellation

Define separate reasons and actor:
- customer cancellation before provider acceptance;
- customer cancellation after acceptance;
- provider declines;
- provider cancels after acceptance;
- customer/provider unreachable;
- unsafe/unsuitable job;
- admin cancellation.

Apply the policy transparently. Avoid surprise penalties or fees; any cancellation fee must be shown before booking and reviewed against local legal requirements.

---

## 10. Screen Map and Routes

Use the App Router and protect role-specific pages server-side. Exact route naming can change if the existing repo has a consistent convention, but equivalent functionality must exist.

### Public routes

- `/` — landing page, service explanation, service area, customer and professional CTAs.
- `/services` — catalogue of enabled categories/tasks.
- `/services/[slug]` — category details, pricing approach, scope/cautions.
- `/how-it-works` — customer and professional workflow.
- `/safety-and-verification` — honest explanation of each check and what it does not prove.
- `/terms`, `/privacy`, `/cancellation-policy` — initial clearly marked policy pages requiring legal review before public launch.
- `/auth/sign-in`, `/auth/sign-up`, `/auth/callback` — auth screens and callback if needed.

### Customer routes

- `/customer` — dashboard and active/recent jobs.
- `/customer/requests/new` — service request wizard.
- `/customer/requests/[id]/professionals` — eligible shortlist for a request.
- `/customer/jobs/[id]` — job details/timeline, quote actions, completion, cancellation and support.
- `/customer/profile` — profile and contact preferences.
- `/customer/addresses` — saved addresses, if implemented.
- `/customer/reviews` — reviews authored by the customer, if useful.

### Professional routes

- `/professional/onboarding` — application and profile setup.
- `/professional/dashboard` — availability, new requests, active job and summary.
- `/professional/profile` — edit bio and public details.
- `/professional/services` — chosen categories/tasks.
- `/professional/availability` — service areas, hours and online/offline state.
- `/professional/verification` — checklist/statuses and evidence submission guidance.
- `/professional/requests/[id]` — request details and accept/decline.
- `/professional/jobs/[id]` — active job, status actions, quote, completion and issue reporting.
- `/professional/history` — completed/cancelled jobs and review/settlement history.

### Admin routes

- `/admin` — operations overview.
- `/admin/providers` — queue, active providers, paused/suspended providers.
- `/admin/providers/[id]` — profile, verification records, assessment, actions/audit history.
- `/admin/services` — categories, tasks, required checks and pricing rules.
- `/admin/areas` — launch service coverage.
- `/admin/jobs` and `/admin/jobs/[id]` — booking overview, event timeline and support actions.
- `/admin/disputes` and `/admin/disputes/[id]` — complaints and evidence.
- `/admin/finance` — reported payments, expected commission and reconciliation records.
- `/admin/settings` — configurable operational settings with audit trail.

### UX standards

- Mobile-first responsive layout; use flexible layouts, accessible controls, and no brittle fixed-position layouts that break on small screens.
- Handle loading, empty, error, offline, unauthorized, and stale-data states for every major flow.
- Use visible confirmation before destructive/irreversible actions.
- Use clear status labels; do not expose internal database enum strings to customers.
- Forms need inline validation and server-side validation.
- Use keyboard navigation, semantic HTML, visible focus, appropriate color contrast, and accessible labels.
- Display prices and dates in a local-friendly format; make currency explicit as PKR/Rs.
- Support Urdu-friendly text lengths and layout, even if the first version is English-only.

---

## 11. Recommended Technical Architecture

### 11.1 Core stack

- **Frontend and server:** Next.js App Router + TypeScript.
- **Styling:** Tailwind CSS; use the repository's existing component library if present. A consistent accessible component system is preferred over one-off UI.
- **Auth and data:** Supabase Auth + PostgreSQL.
- **Authorization:** RLS for database data access; server-side authorization for privileged operations.
- **Storage:** Supabase Storage private buckets for job images and verification evidence, with least-privilege access and signed URLs.
- **Validation:** Shared schema validation (for example, Zod if compatible with the repo) for form inputs and server actions/API requests.
- **Testing:** Unit/integration tests for business logic and database transitions; browser-based end-to-end tests for critical booking paths if test infrastructure permits.
- **Deployment:** A supported Next.js host and Supabase project. Document setup; do not hardcode host-specific behavior unnecessarily.

Do not add an independent backend service in the MVP unless the repository or a concrete requirement demands it. Next.js server actions/route handlers can mediate privileged operations, while database constraints/RPCs protect transactional invariants.

### 11.2 Suggested code organization

Adapt to the existing repo, but keep clear boundaries such as:

```text
src/
  app/
    (marketing)/
    (auth)/
    customer/
    professional/
    admin/
    api/                 # only where route handlers are appropriate
  components/
    ui/
    layout/
    forms/
    jobs/
    professionals/
  features/
    auth/
    catalogue/
    customer-requests/
    matching/
    bookings/
    quotes/
    reviews/
    verification/
    admin/
  lib/
    supabase/
    auth/
    validation/
    permissions/
    money/
    location/
    notifications/
    config/
  types/
  tests/
supabase/
  migrations/
  seed.sql
 docs/
  ARCHITECTURE.md
  DATA_MODEL.md
  SECURITY.md
  OPERATIONS.md
  OPEN_QUESTIONS.md
```

This is a suggestion, not an instruction to disrupt an existing clean structure.

### 11.3 Supabase client usage

- Use a browser client only for allowed user-scoped operations.
- Use a server client with the authenticated user context for server-side read/write operations.
- Use the service-role key only in trusted server-side code/jobs, never in a browser bundle or public environment variable.
- Do not bypass RLS casually with a service-role client.
- Use Postgres constraints and transactional functions for booking acceptance and other race-sensitive operations.
- Keep SQL migrations version-controlled and reproducible.

### 11.4 Configuration

Create `.env.example` containing only variable names and safe placeholders. Exact variables depend on implementation but may include:

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MAPS_PROVIDER=
MAPS_API_KEY=
SMS_PROVIDER=
SMS_API_KEY=
WHATSAPP_PROVIDER=
PAYMENT_PROVIDER=
PAYMENT_API_KEY=
```

Only add variables for integrations actually implemented. Never require optional integration variables just to start the local app. Document which values are public and which must remain server-only.

---

## 12. Database Design

Create normalized, indexed, migration-controlled tables. Names can change if the repo has an existing convention, but the relationships and security model must be preserved.

### 12.1 `profiles`

Purpose: base account information for customer/professional users.

Suggested columns:
- `id uuid primary key references auth.users(id) on delete cascade`
- `display_name text`
- `avatar_path text null` (storage path, not public identity document)
- `phone_e164 text null` (only if collected/verified and policy permits)
- `preferred_language text default 'en'`
- `created_at`, `updated_at`

Do not store admin privilege as an editable profile field.

### 12.2 `user_roles` or secure role claims

Maintain user capabilities securely. A user can be a customer and professional. Admin privileges must be granted only through trusted server/admin operations. RLS policies should check a trusted role source/function.

### 12.3 `service_categories`

Suggested columns:
- `id uuid primary key`
- `name`, `slug`, `description`, `icon_key`
- `is_active boolean`
- `sort_order integer`
- `created_at`, `updated_at`

Seed plumbing, electrical work, and AC repair/maintenance as enabled categories.

### 12.4 `service_tasks`

Optional predefined tasks under a category:
- `id`, `category_id`
- `name`, `slug`, `description`
- `pricing_mode` (fixed, inspection_quote, quote_only or supported enum)
- `fixed_price numeric(12,2) null`
- `visit_fee numeric(12,2) null`
- `price_currency text default 'PKR'`
- `scope_inclusions text`, `scope_exclusions text`
- `requires_skill_assessment boolean`
- `is_active`, timestamps

Validate amounts as non-negative, and do not permit a fixed price without the required defined scope.

### 12.5 `provider_profiles`

Suggested columns:
- `id uuid primary key`
- `user_id uuid unique references profiles(id)`
- `public_name` or use the approved profile display name
- `bio text`, `experience_years integer null`
- `application_status` (draft, pending, approved, rejected, paused, suspended)
- `availability_status` (offline, online, busy)
- `base_area_id uuid null`
- `travel_radius_km numeric null` (only if used)
- `profile_photo_path text null`
- `approved_at`, `approved_by` (admin reference where appropriate)
- `created_at`, `updated_at`

Avoid public fields containing CNIC, private address, or sensitive documents.

### 12.6 `provider_services`

- `id uuid primary key`
- `provider_id uuid references provider_profiles(id)`
- `category_id uuid references service_categories(id)`
- `task_id uuid null references service_tasks(id)`
- `experience_note text null`
- `service_status` and activation state
- unique constraint for relevant provider/category/task combination

### 12.7 `service_areas` and `provider_service_areas`

`service_areas` contains admin-configured locality/zone labels and active state. `provider_service_areas` links providers to areas. Keep the first version simple; do not require a spatial GIS extension to run locally.

If coordinates and nearby sorting are supported, use validated latitude/longitude and an indexed/appropriate geospatial strategy. Do not expose exact private coordinates unnecessarily. If PostGIS is enabled, document the extension and migration requirements; otherwise use a carefully tested server-side distance calculation for a small launch dataset.

### 12.8 `provider_verifications`

Track each verification type separately:
- `id`, `provider_id`
- `verification_type` (contact, identity_review, skill_assessment, certificate_review or configured values)
- `category_id` nullable for trade-specific checks
- `status`
- `method_description`
- `evidence_reference`/private storage path if actually required
- `reviewer_id`, `reviewed_at`, `expires_at`
- `result_summary`, `private_notes`, `rejection_reason`
- `created_at`, `updated_at`

Sensitive records must not be readable by arbitrary providers/customers. The customer-facing API should return only approved status/label and the minimum explanation needed.

### 12.9 `provider_assessments` (or equivalent)

Store practical test/assessment results independently if more detail is needed:
- provider, category/task, checklist/version, assessor, assessment date, result, retest date, notes, record timestamps.

Keep assessor-only notes private.

### 12.10 `customer_addresses` (optional for MVP)

- `id`, `user_id`, label, address text, area id, optional latitude/longitude, access instructions, `is_default`, timestamps.

Protect owner access. Access instructions should be visible only to the owner and the appropriate confirmed provider/support staff when a booking requires it.

### 12.11 `jobs`

Suggested columns:
- `id uuid primary key`
- `customer_id uuid references profiles(id)`
- `category_id uuid references service_categories(id)`
- `task_id uuid null references service_tasks(id)`
- `description text`
- `urgency`/`scheduled_for timestamptz null`
- `service_area_id uuid`
- `address_snapshot text` (private; only accessible to the customer, selected provider after acceptance, and authorized support)
- `latitude numeric null`, `longitude numeric null` (restricted)
- `job_status`
- `pricing_mode`
- `accepted_provider_id uuid null references provider_profiles(id)`
- `selected_visit_fee numeric(12,2) null`
- `approved_quote_id uuid null` after quote table relationships are established
- `customer_notes`, `completion_note` as appropriately permissioned fields
- `created_at`, `updated_at`, `accepted_at`, `completed_at`, `cancelled_at`

Use FK constraints, safe deletion rules, and indexes for customer history, provider active jobs, status, area/category, and timestamps. Store an address snapshot on the booking so later address edits do not rewrite a historic job.

### 12.12 `job_media`

- `id`, `job_id`, `uploaded_by`, private storage path, media type, file size, purpose (request/completion/dispute), timestamp.
- Apply file limits and content-type validation.
- Never use a public bucket for private residential job photos.

### 12.13 `booking_requests`

- `id`, `job_id`, `provider_id`
- `status`
- `requested_at`, `expires_at`, `responded_at`
- `response_reason` optional
- `created_by`

Use constraints/indexes to enforce the MVP rule of one pending request per job and quickly find expiring requests. Use a transactional PostgreSQL function/conditional update for accepting a request. Keep declined/expired request history.

### 12.14 `quotes` and `quote_items`

`quotes`:
- `id`, `job_id`, `provider_id`, `version_number`
- `status`, `currency` (PKR), `subtotal`, `discount` if supported, `total`
- `scope_summary`, `exclusions`, `materials_responsibility`
- `valid_until`, `submitted_at`, `decided_at`, `decided_by`
- `revision_reason`, `supersedes_quote_id`, timestamps

`quote_items`:
- `id`, `quote_id`, `kind` (labour, material, visit_fee, other)
- `description`, quantity, unit, unit_price, line_total, notes

Enforce that approved quote contents cannot be edited. New quote revisions require a new row/version. Validate arithmetic on server/database; do not trust the total supplied by the browser.

### 12.15 `job_events`

Append-only event timeline:
- `id`, `job_id`, `actor_user_id` nullable for system event
- `event_type`, old/new status if relevant
- safe structured metadata JSON
- `created_at`

Do not put identity-document data, full addresses, secrets, or unnecessary personal details in event metadata. Restrict edits/deletes; admin audit corrections should create additional events rather than silently erasing history.

### 12.16 `reviews`

- `id`, `job_id unique`, `customer_id`, `provider_id`
- `rating smallint` constrained to 1–5
- `comment text null`, optional category ratings if justified
- moderation status (visible, hidden_pending_review, removed with reason)
- `created_at`, `updated_at`

Only the customer on a completed eligible job may create the review. Prevent duplicate reviews with a database constraint. Add moderation controls and a fair complaint process; providers must not be able to delete reviews themselves.

### 12.17 `disputes`

- `id`, `job_id`, opened_by, issue_type, description, status, assigned_admin_id
- evidence references/media
- resolution summary, resolution outcome, resolved_by, resolved_at
- timestamps

Restrict sensitive details to job parties and authorized admins. Establish a clear policy before public launch.

### 12.18 `payment_records` and `commission_ledger`

For the pilot, track reported/reconciled transactions; do not represent this as payment processing. Use decimal/numeric database types, never floating-point for money.

`payment_records` may include job id, payer, payee, amount, currency, method, status, reported_by, confirmed_by and timestamps. Design confirmations to preserve both sides' declarations when they disagree.

`commission_ledger` may record job id, provider id, gross amount basis, configured rate/fixed fee, expected commission, collection/reconciliation status, and audited adjustments. Never mark a fee as collected solely because it was calculated.

### 12.19 `notifications`

- `id`, recipient user, type, safe title/body, related job/request/quote id, channel, read timestamp, delivery status, created timestamp.
- Use in-app notifications first. Do not expose sensitive booking details in lock-screen content or external messaging without considering privacy.

### 12.20 `admin_audit_logs`

Record sensitive admin actions: provider approval/suspension, verification decision, manual status corrections, dispute outcomes, pricing/commission changes, and finance reconciliation. Store actor, action, target, minimal change summary, timestamp, and correlation/reference id.

### 12.21 Data consistency

- Add appropriate foreign keys, check constraints, indexes, uniqueness constraints, and timestamps.
- Use database transactions for multi-table critical writes.
- Keep money in `numeric/decimal` columns with validated currency.
- Use UTC timestamps in the database; render local time to the user.
- Add migration and seed scripts. Seed data must be clearly marked as demo data and never inserted into production by default.

---

## 13. RLS and Security Requirements

Implement and test RLS on all user-owned/private tables. The below is a policy goal, not a substitute for reviewing actual SQL policies.

### Profiles
- Users can read/update only their own private profile fields.
- Public professional profile responses must expose a deliberately limited, approved projection—not the entire profile row.
- Admin operations require a trusted admin permission.

### Professional data
- Professional can update their own editable profile fields but cannot set approval/verification/assessment/admin fields.
- Public can see only active, approved public profile fields.
- A professional's private evidence and internal assessor notes are never public.

### Jobs and addresses
- Customer can read their own jobs.
- Provider can see a request's minimum necessary job details when a request is sent to them; exact address/access notes are only shown at the appropriate confirmed-booking stage.
- Accepted provider can read details necessary to perform their active booking.
- Other providers and other customers cannot read the job.
- Admin/support access is permissioned and audited.

### Booking requests and quotes
- Only the customer owning the job and the relevant provider may access the booking request in the permitted context.
- Providers can create quotes only for the job they are assigned to and only in valid states.
- Customers can approve/reject quotes only for their own job and through validated server actions/transactions.

### Reviews/disputes/payments
- Customer can create one eligible review for their completed job.
- Users can read only the payment/dispute records relevant to their own job, with fields restricted as appropriate.
- Only authorized admins can resolve a dispute or modify platform ledger reconciliation.

### Storage
- Use private buckets for job and verification files.
- Signed URL creation must enforce access checks.
- Validate extension, MIME/type, size, and intended file purpose.
- Avoid storing identity files if an alternative record of the completed verification is sufficient.
- Apply retention and deletion rules for sensitive data.

### General controls
- Rate-limit or otherwise protect auth-sensitive and costly endpoints.
- Validate all input server-side; escape/render user-generated content safely.
- Check file uploads, user IDs, ownership, role and state before every privileged action.
- Add CSRF/origin protections consistent with Next.js/Supabase architecture.
- Avoid leaking detailed server errors, SQL messages, keys, private addresses or verification evidence.
- Keep dependencies updated deliberately and audit before production.
- Create an incident response and data breach escalation checklist before public launch.

---

## 14. Server Actions / API Boundaries

Use server actions or route handlers based on the project's conventions. Suggested operations (names are illustrative):

### Customer
- `createJobRequest(input)`
- `getEligibleProfessionals(jobId)`
- `requestProfessional(jobId, providerId)`
- `cancelOwnJob(jobId, reason)`
- `approveQuote(quoteId)`
- `rejectQuote(quoteId, reason)`
- `requestCompletionConfirmation(jobId)` or `confirmJobCompletion(jobId)`
- `createReview(jobId, rating, comment)`
- `openDispute(jobId, input)`

### Professional
- `submitProviderApplication(input)`
- `updateOwnAvailability(input)`
- `updateOwnServiceAreas(input)`
- `respondToBookingRequest(requestId, acceptOrDecline, reason?)`
- `markEnRoute(jobId)` only if supported
- `markArrived(jobId)`
- `submitQuote(jobId, quoteInput)`
- `submitQuoteRevision(quoteId, changeInput)`
- `startWork(jobId)`
- `requestJobCompletion(jobId, completionInput)`
- `reportPayment(jobId, input)`

### Admin
- `reviewProviderApplication(providerId, decision, reason)`
- `recordVerification(providerId, input)`
- `manageCatalogue(input)`
- `manageServiceArea(input)`
- `assignDispute(disputeId, adminId)`
- `resolveDispute(disputeId, resolution)`
- `reconcilePayment/paymentCommission(input)`
- `updatePlatformSetting(input)`

Every operation must:
1. authenticate the requester;
2. authorize the role/ownership;
3. validate input;
4. validate current state and permitted transition;
5. execute a transaction where needed;
6. write appropriate job/audit event;
7. return safe structured errors and update/revalidate the relevant UI.

Do not build a generic mutation endpoint that lets the client submit arbitrary table names, columns, status values, or admin actions.

---

## 15. Notifications

MVP:
- in-app notification or visible dashboard updates for a new professional request;
- customer update when request is accepted, declined, or expires;
- provider/customer update on quote submission and decision;
- booking status changes and cancellation;
- completion request and review eligibility;
- dispute receipt and resolution.

If real-time Supabase subscriptions are used, enforce private channel access and don't use them as a replacement for database authorization. Polling is acceptable for initial development if simpler and safe.

Future adapters:
- email provider;
- SMS provider;
- WhatsApp Business API provider;
- push notifications.

No WhatsApp/SMS/email should be represented as sent unless the provider confirms success or the UI clearly says it is queued/pending. Do not put sensitive addresses or identity data in notifications.

---

## 16. Admin and Operations Workflow

Admin tooling is essential because the marketplace's trust and service quality cannot be fully automated in the first release.

### Provider application review
- Show pending applications and required missing information.
- Review service selections and evidence.
- Record identity-related check type, method, outcome and date honestly.
- Record trade-specific assessor/checklist and outcome.
- Approve only when minimum requirements configured for those offered services are met.
- Reject with a reason and a way to reapply or provide further information.
- Pause/suspend providers and record the reason.

### Catalogue operations
- Activate/deactivate services/tasks.
- Define price mode and scope assumptions.
- Configure required verification/skill status by task.
- Define indicative pricing only from research and label it properly.
- Maintain launch service areas.

### Job operations
- Search by job id/status/date/service area/provider/customer, with privacy-preserving access.
- View the timeline and the latest quote/approval/payment records.
- Contact parties using the platform's defined support channels.
- Record an audited manual correction if operationally necessary.

### Disputes
- Record the reported issue, relevant timeline, quote revisions, and permitted evidence.
- Give both parties a reasonable opportunity to respond.
- Apply a defined outcome (for example: close without change, partial resolution, refund recommendation/record, rework agreement, provider coaching/suspension, or external escalation).
- Do not promise compensation/insurance the platform cannot provide.
- Log who made the decision and why.

---

## 17. Business Operations and Real-World Pilot

The code is only part of the product. Before public launch, define these operations.

### Worker supply
- Recruit a small initial cohort in one service area.
- Onboard people in person/phone/WhatsApp where appropriate; don't assume every worker wants to complete a long form.
- Confirm actual service capabilities, fee expectations, working area, hours, tools/equipment, and ability to receive jobs.
- Explain platform rules, pricing approval, cancellation, privacy, reviews, complaints, and whether/when commission applies.
- Provide a simple Urdu-friendly onboarding guide even if the app launches in English.

### Skill checks
- Recruit reputable master technicians or technical-training partners to design and conduct trade-specific assessments.
- Set an agreed checklist and a clear result standard.
- Record assessor and assessment evidence.
- Decide who pays for the assessment and pilot that cost; do not assume it is free or economically scalable.

### Customer acquisition
- Interview customers about their last service booking before spending heavily on ads.
- Test referrals, neighbourhood groups, property managers, local shops, and community partnerships.
- Track source for every customer/booking.
- Measure repeat booking; a one-time download is not proof of product-market fit.

### Support and safety
- Decide support operating hours and escalation path.
- Have an incident process for suspected fraud, harassment, unsafe conditions, property damage, injury, or emergency situations.
- Tell customers/providers to contact emergency services for immediate danger; platform support is not an emergency service.
- Keep only relevant evidence, restrict it to authorized staff, and define retention.
- Before launch, get local legal advice on business registration, applicable taxes, consumer obligations, privacy/data handling, worker arrangements, contracts, liability and insurance.

---

## 18. Analytics and Success Metrics

Track events without collecting unnecessary personal data. Avoid sending addresses, phone numbers, CNIC data, job photos, or free-text sensitive information to analytics providers.

### Funnel events
- account_created;
- provider_application_started/submitted/approved;
- job_request_started/submitted;
- shortlist_shown;
- professional_profile_viewed;
- booking_request_sent;
- booking_request_accepted/declined/expired;
- quote_submitted/approved/rejected;
- job_started/completion_requested/completed/cancelled;
- review_submitted;
- dispute_opened/resolved;
- repeat_booking_started/completed.

### Marketplace metrics
- request-to-shortlist success rate;
- median time to see eligible professionals;
- shortlist-to-booking-request conversion;
- provider acceptance rate;
- request expiry/decline rate;
- provider-caused cancellation and no-show rate;
- completed jobs per active provider;
- median time to professional arrival when genuine arrival data exists;
- quote revision frequency;
- completion rate;
- complaint/dispute rate and resolution time;
- average rating with sample size;
- 30/60/90-day customer repeat rate;
- customer acquisition cost by channel;
- cost to onboard and assess a provider;
- revenue and contribution margin per completed job;
- commission earned versus collected/reconciled.

Set numeric pass/fail targets before the pilot, based on interviews and observed baseline data. Do not state the business is validated only because users register or open the app.

---

## 19. Suggested 90-Day Validation Roadmap

This is an operating plan, not a promise that every feature must be built in 90 calendar days. Adjust it to actual resources and pilot findings.

### Days 1–14: Discovery and operational groundwork
- Interview customers and workers.
- Collect real local quotes and understand common task scopes.
- Decide the initial service area, service categories, cancellation policy, visit-fee handling and verification standards.
- Identify candidate assessors/training partners.
- Test competitor booking flows where possible; document gaps based on observed experience rather than marketing claims.
- Write a draft unit economics model with assumptions labelled.

**Gate:** Do we have a credible problem statement, an initial cohort of potential professionals, customers willing to trial the service, and an operational way to resolve issues?

### Days 15–30: Manual concierge pilot
- Run a small number of actual bookings with manual matching via a form/WhatsApp/phone.
- Track service request, quote, completion, cancellation, feedback, and cost-to-serve.
- Refine the service catalogue and price-disclosure language.
- Validate worker willingness to accept a platform fee/commission model, without assuming consent.

**Gate:** Can we repeatedly complete jobs to both sides' satisfaction, and do customers/technicians find the process useful enough to repeat?

### Days 31–60: MVP engineering
- Implement authentication, customer/professional profiles, catalogue, admin verification, job creation, shortlist, request/accept/decline, quote approval, completion, and reviews.
- Add RLS and tests before exposing private customer/job data.
- Pilot with a closed cohort; no unrestricted public marketing yet.
- Compare digital workflow outcomes with the manual baseline.

**Gate:** Can real pilot participants complete the full digital workflow without critical security defects or frequent manual intervention?

### Days 61–90: Controlled public pilot
- Expand only within the chosen service area and active categories.
- Add operational monitoring, notification improvements, customer support tools, and pricing refinements.
- Review reliability, repeat usage, disputes, provider retention and contribution economics weekly.
- Decide whether to scale, modify the niche, or stop based on evidence.

**Gate:** Are completion, reliability, repeat usage, customer acquisition cost and per-job economics trending toward targets set before this phase?

---

## 20. Testing and Acceptance Criteria

### 20.1 General
- App starts locally using documented commands.
- Environment variables are documented and secrets are absent from source control.
- TypeScript type-check and lint pass.
- Build succeeds.
- Database migrations can be applied to a fresh Supabase development project.
- `README.md` provides complete setup and troubleshooting instructions.
- Empty/error/loading/unauthorized states exist for each major page.
- Responsive layouts work on small Android-width screens and desktop.

### 20.2 Authentication and permissions
- Unauthenticated users cannot access protected customer/professional/admin pages.
- Customers cannot retrieve other customers' jobs, addresses, quotes, media, or payment/dispute details by guessing IDs.
- Providers cannot access unrelated jobs/private customer details.
- Providers cannot change their own verification result or approval status.
- A normal user cannot self-assign admin privileges.
- Private storage URLs cannot be obtained by unauthorized users.

### 20.3 Shortlist
- Only eligible, active, sufficiently verified, service-matched providers are included.
- Ineligible/unavailable/suspended providers do not appear.
- The ranking/sorting logic is deterministic and tested.
- No fake review, distance, availability or ETA is shown.
- Empty state works when no provider qualifies.
- Exact customer address is not exposed in public shortlist data.

### 20.4 Booking
- Customer can request one provider.
- Provider can accept or decline only their own request.
- Expired requests cannot be accepted.
- Concurrent acceptance attempts cannot attach multiple providers to a job.
- Conflicting provider bookings are rejected.
- Decline, expiry and cancellation allow customer recovery without corrupting job history.
- Each important transition adds a timeline event.

### 20.5 Quotes and money
- A quote total is computed/validated server-side from line items.
- Customer must explicitly approve a quote before additional repair work begins.
- Approved quotes cannot be silently edited.
- Quote revisions retain prior versions and reasons.
- No false payment-success indication exists without a real provider confirmation.
- Cash confirmations and mismatches are represented honestly.
- Money calculations use decimal/numeric types and are covered by tests.

### 20.6 Reviews and disputes
- Only a customer with an eligible completed booking can submit one review.
- Review rating range is validated.
- A disputed job follows the documented policy.
- Only authorized staff can resolve a dispute or hide a review, with an audit record.

### 20.7 Test scenarios to automate
- Customer signup -> create job -> shortlist -> request provider -> provider accepts -> quote submitted -> customer approves -> completion -> review.
- Provider declines -> customer chooses another provider.
- Request expires -> expired request cannot be accepted.
- Provider is unavailable/suspended -> omitted from shortlist.
- Customer A attempts to read Customer B's job/address/media -> denied.
- Provider A attempts to read Provider B's request/finance details -> denied.
- Two concurrent provider accept attempts -> exactly one valid result.
- Quote revision after approval -> original preserved and re-approval required.
- Job cancellation at each allowed stage -> correct status/timeline/policy.
- User attempts to self-promote to admin -> denied.

---

## 21. Deployment and Operations Checklist

### Development
- Set up local `.env.local` from `.env.example`.
- Configure a development Supabase project and auth redirect URLs.
- Apply versioned migrations and optional demo seed data.
- Run lint, type-check, unit tests, integration tests, and build.

### Staging
- Use a separate Supabase project/dataset from production.
- Test auth flows, RLS, storage policies, quote/booking race conditions, and full browser journeys.
- Confirm email/phone auth settings and redirect URLs.
- Validate backups, error logging and access restrictions.

### Production readiness
- Configure production domain and HTTPS.
- Configure production auth URLs and allowed origins.
- Apply migrations using a repeatable process.
- Remove demo seed data and test accounts not required for operations.
- Check that no service-role secret reaches client code.
- Confirm RLS on every private table and private bucket policies.
- Set up backups and a tested restore procedure.
- Add error monitoring without leaking sensitive fields.
- Define who can access production database/admin console.
- Publish reviewed Terms, Privacy, Cancellation and Safety policies.
- Obtain appropriate local legal guidance and operational insurance/liability advice as needed.
- Document contact for security/privacy incidents.
- Monitor application and database errors, slow requests and storage use.

### Rollback
- Keep database migrations and deployments versioned.
- Document how to disable a broken feature flag/integration.
- Do not perform destructive data migrations without a backup and recovery plan.
- Have a way to pause new bookings while supporting already accepted jobs if a serious issue occurs.

---

## 22. Deliverables Expected From the Coding Agent

At the end of the MVP implementation, the repository should include:

1. A working Next.js responsive application for customers, professionals, and admins.
2. Authentication and protected routes.
3. Supabase migrations and RLS policies for all schema tables.
4. Seed data for local development clearly labelled as demo data only.
5. Service catalogue and provider onboarding/profile management.
6. Admin verification review tools with honest, distinct status types.
7. Job creation, professional shortlist, provider request acceptance/decline/expiry, and booking history.
8. Quote creation, approval/rejection, and revision history.
9. Completion, review, dispute and pilot payment-record flows.
10. Transaction-safe booking acceptance and status transitions.
11. Tests for permissions, matching, pricing calculations, quote approval, and concurrency invariants.
12. `.env.example`, setup instructions, migration instructions, test commands and deployment guide.
13. `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/SECURITY.md`, `docs/OPERATIONS.md`, and `docs/OPEN_QUESTIONS.md`.
14. A final implementation report listing completed features, remaining items, commands run, test results, setup requirements, and any known risks.

The agent must not claim that the product is production-ready simply because the pages render. Production readiness requires real RLS testing, operational and legal review, and validation with real professionals/customers.

---

## 23. Definition of Done

The MVP is ready for a **closed, controlled pilot** only when:

- the core booking flow works end-to-end with real test accounts;
- the shortlist contains only eligible providers and never invents availability/ETA/reviews;
- provider accept/decline and timeout logic is correct under concurrent attempts;
- quote approval and all price changes are traceable;
- customers and providers cannot access private data belonging to other users;
- admin actions and important job/payment events are auditable;
- the app's limitations and verification meanings are explained honestly;
- users have a way to cancel, report problems, and contact support;
- migrations, setup docs, tests, and rollback notes exist;
- at least a small cohort of real providers and customers has tested the workflow with an operator monitoring the pilot.

A **public commercial launch** additionally requires validated service pricing, a sustainable support process, clear dispute/cancellation rules, local legal/tax/privacy review, appropriate liability arrangements, and a working plan for any commission or payment collection the platform claims to offer.

---

## 24. Open Questions to Record (Do Not Silently Assume)

Create and maintain `docs/OPEN_QUESTIONS.md` with an owner and next action for each question:

1. Final product name, domain and visual identity.
2. Exact first service neighbourhood/zone in Karachi.
3. Verification standard and who performs/pays for each trade assessment.
4. Whether phone verification is mandatory before viewing shortlist or only before booking.
5. Exact visit-fee, cancellation and refund rules, including no-show handling.
6. Commission rate and the practical way cash jobs would be reconciled.
7. Whether customer/provider must confirm cash payment independently.
8. Customer support operating hours and escalation owner.
9. Whether a map provider is needed for the closed pilot or manual area/address is sufficient.
10. Which notification channel is genuinely available and affordable.
11. Data-retention periods for ID-review evidence, photos, job records and disputes.
12. Local legal/business registration, tax, consumer, privacy, worker arrangement, liability and insurance requirements.
13. Pilot numeric pass/fail targets for completed jobs, worker reliability, satisfaction, repeat usage and contribution margin.
14. Whether the platform will guarantee rework/refund for any class of job; do not advertise a guarantee until funded, operationally defined and legally reviewed.

Resolve these through interviews, small pilots and appropriate professional advice. The application should support configuration and honest disclosure rather than burying assumptions in hard-coded code.

---

## 25. Final Build Order

Build in this order and keep each phase runnable:

1. **Repository audit and app foundation** — routing, layout, design tokens, lint/type-check/build, env examples, docs.
2. **Supabase foundation** — clients, migrations, profiles, role model, RLS baseline, auth flow, tests.
3. **Catalogue and professional profile** — categories/tasks, provider application, services, service areas, admin review/verification.
4. **Customer job request** — service wizard, address/manual-location fallback, private media upload, request draft/open states.
5. **Eligible professional shortlist** — privacy-safe projection, eligibility filters, ranking/sorting, empty/loading/error states.
6. **Booking request state machine** — request, accept/decline/expiry, transactional invariants, notifications and timeline.
7. **Arrival, inspection and quotes** — fixed-scope tasks, visit fee, itemized quote, quote revisions, explicit approval.
8. **Completion, cash records, reviews and disputes** — honest pilot payment recording, commission ledger, support/admin resolution.
9. **Hardening** — responsive/accessibility pass, security review, RLS tests, concurrency tests, E2E tests, error handling.
10. **Pilot deployment** — staging, operational documents, reviewed policies, monitored closed cohort, weekly metrics.
11. **Iterate from evidence** — fix funnel/drop-off and operational pain points before adding categories or complex integrations.

**Start now at Phase 1.** Inspect the current repository, summarize what is already present, create the checklist and required docs, and implement the smallest complete vertical slice without weakening the security or booking-state requirements above.
