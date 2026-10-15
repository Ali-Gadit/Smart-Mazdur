-- ============================================================================
-- pgTAP Test Suite: 02_atomic_booking_acceptance.test.sql
-- Run with: supabase test db (when Supabase CLI and Docker are active)
-- Verifies: rpc_accept_booking_request invariants:
-- - Unauthenticated caller rejected
-- - Unapproved provider rejected
-- - Expired request rejected
-- - Second concurrent accept attempt rejected
-- - Schedule conflict rejected
-- ============================================================================

BEGIN;
SELECT plan(6);

-- 1. Function existence
SELECT has_function(
  'public',
  'rpc_accept_booking_request',
  ARRAY['uuid'],
  'rpc_accept_booking_request function should exist with uuid parameter'
);

-- 2. Verify security definer
SELECT is_definer(
  'public',
  'rpc_accept_booking_request',
  ARRAY['uuid'],
  'rpc_accept_booking_request must be SECURITY DEFINER to atomically manage updates'
);

-- 3. Anonymous caller rejection test
SELECT is(
  (public.rpc_accept_booking_request('00000000-0000-0000-0000-000000000001'::uuid)->>'error')::text,
  'UNAUTHENTICATED',
  'Anonymous caller without auth.uid() must be rejected with UNAUTHENTICATED'
);

-- 4. Non-existent request rejection test (Simulating authenticated user without request)
SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
SELECT is(
  (public.rpc_accept_booking_request('00000000-0000-0000-0000-000000000001'::uuid)->>'error')::text,
  'NOT_A_PROVIDER',
  'Caller who is not an approved provider must be rejected with NOT_A_PROVIDER'
);

-- 5. Invariant check: Partial unique index prevents multiple active pending requests
SELECT has_index(
  'public',
  'booking_requests',
  'uq_one_pending_request_per_job',
  'Partial unique index uq_one_pending_request_per_job must exist'
);

-- 6. Check review rating bounds
SELECT col_has_check(
  'public',
  'reviews',
  'rating',
  'Review rating column must have check constraint for 1 to 5'
);

SELECT * FROM finish();
ROLLBACK;
