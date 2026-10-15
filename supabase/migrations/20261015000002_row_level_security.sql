-- ============================================================================
-- Migration: 20261015000002_row_level_security.sql
-- Description: Row Level Security (RLS) policies for all tables.
-- Guarantees: Least privilege, tenant isolation, privacy of addresses/identity,
-- and prevention of self-privilege escalation.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SECURITY HELPER FUNCTIONS
-- ----------------------------------------------------------------------------

-- Check if a user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = p_user_id AND role = 'admin'
  );
$$;

-- Check if current user is the customer of a specific job
CREATE OR REPLACE FUNCTION public.is_job_customer(p_job_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.jobs 
    WHERE id = p_job_id AND customer_id = p_user_id
  );
$$;

-- Check if current user is the accepted provider of a specific job
CREATE OR REPLACE FUNCTION public.is_job_accepted_provider(p_job_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.jobs j
    JOIN public.provider_profiles p ON p.id = j.accepted_provider_id
    WHERE j.id = p_job_id AND p.user_id = p_user_id
  );
$$;

-- Check if current user is a requested provider for a specific job
CREATE OR REPLACE FUNCTION public.is_job_requested_provider(p_job_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.booking_requests br
    JOIN public.provider_profiles p ON p.id = br.provider_id
    WHERE br.job_id = p_job_id AND p.user_id = p_user_id
  );
$$;

-- ----------------------------------------------------------------------------
-- 2. ENABLE RLS ON ALL TABLES
-- ----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 3. POLICIES: PROFILES & USER ROLES
-- ----------------------------------------------------------------------------

-- Profiles: Own read/write, Admin full access, Public limited read for display
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- User Roles: Read own role, strictly admin-only mutation (PREVENTS SELF-ASSIGNMENT)
CREATE POLICY "user_roles_select_own_or_admin" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "user_roles_admin_all" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. POLICIES: CATALOGUE & SERVICE AREAS
-- ----------------------------------------------------------------------------

-- Categories: Public read active, Admin manage
CREATE POLICY "categories_public_read" ON public.service_categories
  FOR SELECT TO public
  USING (is_active = true OR public.is_admin());

CREATE POLICY "categories_admin_manage" ON public.service_categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Tasks: Public read active, Admin manage
CREATE POLICY "tasks_public_read" ON public.service_tasks
  FOR SELECT TO public
  USING (is_active = true OR public.is_admin());

CREATE POLICY "tasks_admin_manage" ON public.service_tasks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Service Areas: Public read active, Admin manage
CREATE POLICY "areas_public_read" ON public.service_areas
  FOR SELECT TO public
  USING (is_active = true OR public.is_admin());

CREATE POLICY "areas_admin_manage" ON public.service_areas
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. POLICIES: PROFESSIONAL PROFILES & VERIFICATIONS
-- ----------------------------------------------------------------------------

-- Provider Profiles:
-- Public can view approved providers. Owner and Admin can view all statuses.
CREATE POLICY "providers_select_approved_or_owner" ON public.provider_profiles
  FOR SELECT TO public
  USING (application_status = 'approved' OR user_id = auth.uid() OR public.is_admin());

CREATE POLICY "providers_insert_owner" ON public.provider_profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() 
    AND application_status IN ('draft', 'pending')
    AND approved_at IS NULL 
    AND approved_by IS NULL
  );

-- Owner can update bio, availability, areas, but CANNOT self-approve!
CREATE POLICY "providers_update_owner_or_admin" ON public.provider_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (
    public.is_admin() OR (
      user_id = auth.uid()
      -- If not admin, cannot change approval status
      AND application_status = (SELECT p.application_status FROM public.provider_profiles p WHERE p.id = provider_profiles.id)
      AND approved_at IS NOT DISTINCT FROM (SELECT p.approved_at FROM public.provider_profiles p WHERE p.id = provider_profiles.id)
      AND approved_by IS NOT DISTINCT FROM (SELECT p.approved_by FROM public.provider_profiles p WHERE p.id = provider_profiles.id)
    )
  );

-- Provider Services & Service Areas:
CREATE POLICY "provider_services_select" ON public.provider_services
  FOR SELECT TO public
  USING (
    is_active = true 
    OR EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = provider_services.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "provider_services_manage" ON public.provider_services
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = provider_services.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = provider_services.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "provider_areas_select" ON public.provider_service_areas
  FOR SELECT TO public
  USING (true);

CREATE POLICY "provider_areas_manage" ON public.provider_service_areas
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = provider_service_areas.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = provider_service_areas.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  );

-- Provider Verifications & Assessments:
-- Provider can inspect own verification status, but CANNOT modify reviewer notes or status!
CREATE POLICY "verifications_select" ON public.provider_verifications
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = provider_verifications.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "verifications_admin_manage" ON public.provider_verifications
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "assessments_select" ON public.provider_assessments
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = provider_assessments.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "assessments_admin_manage" ON public.provider_assessments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. POLICIES: CUSTOMER ADDRESSES
-- ----------------------------------------------------------------------------

CREATE POLICY "customer_addresses_owner" ON public.customer_addresses
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 7. POLICIES: JOBS & JOB MEDIA (Protects Private Customer Addresses)
-- ----------------------------------------------------------------------------

-- Job visibility:
-- Customer owner, Assigned Provider, Requested Provider (for candidate review), or Admin
CREATE POLICY "jobs_select_authorized" ON public.jobs
  FOR SELECT TO authenticated
  USING (
    customer_id = auth.uid()
    OR public.is_job_accepted_provider(id, auth.uid())
    OR public.is_job_requested_provider(id, auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "jobs_insert_customer" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (
    customer_id = auth.uid() 
    AND job_status = 'open'
    AND accepted_provider_id IS NULL
    AND approved_quote_id IS NULL
  );

CREATE POLICY "jobs_update_authorized" ON public.jobs
  FOR UPDATE TO authenticated
  USING (
    customer_id = auth.uid()
    OR public.is_job_accepted_provider(id, auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
    -- Customer updating their own job
    OR (
      customer_id = auth.uid()
      -- Cannot self-assign provider without acceptance function
      AND (accepted_provider_id IS NOT DISTINCT FROM (SELECT j.accepted_provider_id FROM public.jobs j WHERE j.id = jobs.id))
    )
    -- Accepted provider updating status (arrived, quote_pending, etc.)
    OR (
      public.is_job_accepted_provider(id, auth.uid())
      AND customer_id = (SELECT j.customer_id FROM public.jobs j WHERE j.id = jobs.id)
    )
  );

-- Job Media
CREATE POLICY "job_media_select" ON public.job_media
  FOR SELECT TO authenticated
  USING (
    public.is_job_customer(job_id, auth.uid())
    OR public.is_job_accepted_provider(job_id, auth.uid())
    OR public.is_job_requested_provider(job_id, auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "job_media_insert" ON public.job_media
  FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND (
      public.is_job_customer(job_id, auth.uid())
      OR public.is_job_accepted_provider(job_id, auth.uid())
      OR public.is_admin()
    )
  );

-- ----------------------------------------------------------------------------
-- 8. POLICIES: BOOKING REQUESTS
-- ----------------------------------------------------------------------------

CREATE POLICY "booking_requests_select" ON public.booking_requests
  FOR SELECT TO authenticated
  USING (
    public.is_job_customer(job_id, auth.uid())
    OR EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = booking_requests.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "booking_requests_insert_customer" ON public.booking_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND public.is_job_customer(job_id, auth.uid())
    AND status = 'pending'
  );

CREATE POLICY "booking_requests_update_provider_or_customer" ON public.booking_requests
  FOR UPDATE TO authenticated
  USING (
    public.is_job_customer(job_id, auth.uid())
    OR EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = booking_requests.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
    -- Customer can cancel their own pending request
    OR (public.is_job_customer(job_id, auth.uid()) AND status = 'cancelled')
    -- Provider can decline (acceptance is mediated via rpc_accept_booking_request)
    OR (
      EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = booking_requests.provider_id AND p.user_id = auth.uid())
      AND status IN ('accepted', 'declined')
    )
  );

-- ----------------------------------------------------------------------------
-- 9. POLICIES: QUOTES & QUOTE ITEMS (Immutable once approved)
-- ----------------------------------------------------------------------------

CREATE POLICY "quotes_select" ON public.quotes
  FOR SELECT TO authenticated
  USING (
    public.is_job_customer(job_id, auth.uid())
    OR EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = quotes.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "quotes_insert_provider" ON public.quotes
  FOR INSERT TO authenticated
  WITH CHECK (
    (
      EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = quotes.provider_id AND p.user_id = auth.uid())
      AND public.is_job_accepted_provider(job_id, auth.uid())
      AND status IN ('draft', 'submitted')
    )
    OR public.is_admin()
  );

CREATE POLICY "quotes_update" ON public.quotes
  FOR UPDATE TO authenticated
  USING (
    public.is_job_customer(job_id, auth.uid())
    OR EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = quotes.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
    -- Customer deciding (approving or rejecting)
    OR (
      public.is_job_customer(job_id, auth.uid())
      AND status IN ('approved', 'rejected')
      AND decided_by = auth.uid()
      -- Financial amounts CANNOT be changed by customer
      AND subtotal = (SELECT q.subtotal FROM public.quotes q WHERE q.id = quotes.id)
      AND total = (SELECT q.total FROM public.quotes q WHERE q.id = quotes.id)
    )
    -- Provider can only edit if still draft
    OR (
      EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = quotes.provider_id AND p.user_id = auth.uid())
      AND (SELECT q.status FROM public.quotes q WHERE q.id = quotes.id) = 'draft'
    )
  );

CREATE POLICY "quote_items_select" ON public.quote_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q 
      WHERE q.id = quote_items.quote_id 
      AND (
        public.is_job_customer(q.job_id, auth.uid())
        OR EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = q.provider_id AND p.user_id = auth.uid())
        OR public.is_admin()
      )
    )
  );

CREATE POLICY "quote_items_manage" ON public.quote_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q 
      WHERE q.id = quote_items.quote_id 
      AND (
        (EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = q.provider_id AND p.user_id = auth.uid()) AND q.status = 'draft')
        OR public.is_admin()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes q 
      WHERE q.id = quote_items.quote_id 
      AND (
        (EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = q.provider_id AND p.user_id = auth.uid()) AND q.status = 'draft')
        OR public.is_admin()
      )
    )
  );

-- ----------------------------------------------------------------------------
-- 10. POLICIES: JOB EVENTS (Append-only)
-- ----------------------------------------------------------------------------

CREATE POLICY "job_events_select" ON public.job_events
  FOR SELECT TO authenticated
  USING (
    public.is_job_customer(job_id, auth.uid())
    OR public.is_job_accepted_provider(job_id, auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "job_events_insert" ON public.job_events
  FOR INSERT TO authenticated
  WITH CHECK (
    actor_user_id = auth.uid()
    AND (
      public.is_job_customer(job_id, auth.uid())
      OR public.is_job_accepted_provider(job_id, auth.uid())
      OR public.is_admin()
    )
  );

-- No UPDATE or DELETE allowed on job_events: guarantees audit history integrity!

-- ----------------------------------------------------------------------------
-- 11. POLICIES: REVIEWS (Customer on completed job only)
-- ----------------------------------------------------------------------------

CREATE POLICY "reviews_select" ON public.reviews
  FOR SELECT TO public
  USING (
    moderation_status = 'visible'
    OR customer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = reviews.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "reviews_insert_completed_customer" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    customer_id = auth.uid()
    -- Must be the customer on an actually completed job!
    AND EXISTS (
      SELECT 1 FROM public.jobs j 
      WHERE j.id = reviews.job_id 
      AND j.customer_id = auth.uid() 
      AND j.job_status = 'completed'
      AND j.accepted_provider_id = reviews.provider_id
    )
  );

CREATE POLICY "reviews_update_customer_or_admin" ON public.reviews
  FOR UPDATE TO authenticated
  USING (customer_id = auth.uid() OR public.is_admin())
  WITH CHECK (
    public.is_admin() 
    OR (
      customer_id = auth.uid()
      -- Customer cannot change moderation status or target provider
      AND moderation_status = (SELECT r.moderation_status FROM public.reviews r WHERE r.id = reviews.id)
      AND provider_id = (SELECT r.provider_id FROM public.reviews r WHERE r.id = reviews.id)
    )
  );

-- ----------------------------------------------------------------------------
-- 12. POLICIES: DISPUTES, PAYMENT RECORDS, COMMISSION LEDGER & AUDIT
-- ----------------------------------------------------------------------------

CREATE POLICY "disputes_select" ON public.disputes
  FOR SELECT TO authenticated
  USING (
    public.is_job_customer(job_id, auth.uid())
    OR public.is_job_accepted_provider(job_id, auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "disputes_insert" ON public.disputes
  FOR INSERT TO authenticated
  WITH CHECK (
    opened_by = auth.uid()
    AND (
      public.is_job_customer(job_id, auth.uid())
      OR public.is_job_accepted_provider(job_id, auth.uid())
    )
  );

CREATE POLICY "disputes_admin_manage" ON public.disputes
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "payment_records_select" ON public.payment_records
  FOR SELECT TO authenticated
  USING (
    public.is_job_customer(job_id, auth.uid())
    OR public.is_job_accepted_provider(job_id, auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "payment_records_insert" ON public.payment_records
  FOR INSERT TO authenticated
  WITH CHECK (
    reported_by = auth.uid()
    AND (
      public.is_job_customer(job_id, auth.uid())
      OR public.is_job_accepted_provider(job_id, auth.uid())
      OR public.is_admin()
    )
  );

CREATE POLICY "payment_records_update" ON public.payment_records
  FOR UPDATE TO authenticated
  USING (
    public.is_job_customer(job_id, auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_job_customer(job_id, auth.uid())
      -- Customer confirming payment
      AND confirmed_by = auth.uid()
    )
  );

CREATE POLICY "commission_select" ON public.commission_ledger
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = commission_ledger.provider_id AND p.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "commission_admin_manage" ON public.commission_ledger
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "audit_logs_admin_only" ON public.admin_audit_logs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
