# Security & Authorization Policies

## 1. Threat Model & Security Principles
- **Row Level Security (RLS) is Non-Negotiable:** The client application operates with authenticated user tokens. RLS policies enforce access control directly at the database tier.
- **Server-Side Validation:** All mutations are validated using strict Zod schemas on the server. Never trust parameters submitted by the browser.
- **Principle of Least Privilege:**
  - Customers cannot see other customers' jobs, private addresses, photos, or contact info.
  - Providers can only see customer address details *after* a booking is formally accepted.
  - Public provider profiles project only public approved fields.
  - Sensitive reviewer notes and identity document storage paths are restricted to admins.
  - Self-assignment of admin privileges is strictly prevented (admin roles are verified via trusted table/claims, not user profile inputs).

## 2. Storage Security
- Job photos and verification documents are placed in private Supabase Storage buckets (`job-media`, `verification-docs`).
- Files are accessed only via time-limited signed URLs generated server-side after verifying ownership or role.
- File upload constraints: Maximum 10MB per file; allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`.

## 3. Concurrency & Race-Condition Safeguards
- Acceptance of a booking request is wrapped in an atomic database function (`rpc_accept_booking_request`) using `SELECT ... FOR UPDATE` or conditional atomic update.
- Enforces:
  1. The booking request is currently `pending` and not expired (`now() < expires_at`).
  2. The job is in `request_pending` status and has no other accepted provider.
  3. The provider does not have an active conflicting booking.
  4. At most one provider can win the booking.

## 4. Financial & Quote Integrity
- Money calculations use decimal/numeric representations.
- Itemized quote totals are re-summed and verified on the server before storage.
- An approved quote is immutable. Any price modification generates a new quote version with an explicit reason and requires fresh customer approval.
- Pilot payment tracking is recorded as off-platform cash records; no deceptive claims of automated payment processing or card storage.
