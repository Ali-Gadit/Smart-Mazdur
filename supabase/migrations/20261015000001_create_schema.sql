-- ============================================================================
-- Migration: 20261015000001_create_schema.sql
-- Description: Core Schema for Skilled Labour Marketplace (Smart Mazdur Pilot)
-- Enforces: Strict constraints, indexes, timestamps, and audit structures.
-- ============================================================================

-- Extensions (standard in Supabase PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & DOMAIN TYPES
-- ----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('customer', 'professional', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE pricing_mode_type AS ENUM ('fixed', 'inspection_quote', 'quote_only');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE provider_app_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'paused', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE availability_status_type AS ENUM ('offline', 'online', 'busy');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_type_enum AS ENUM ('contact', 'identity_review', 'skill_assessment', 'certificate_review');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status_enum AS ENUM ('not_started', 'pending', 'approved', 'rejected', 'expired', 'needs_more_information');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE job_status_type AS ENUM (
    'draft',
    'open',
    'request_pending',
    'confirmed',
    'scheduled',
    'en_route',
    'arrived',
    'inspection_in_progress',
    'quote_pending',
    'quote_approved',
    'in_progress',
    'completion_requested',
    'completed',
    'cancelled',
    'disputed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_request_status_type AS ENUM ('pending', 'accepted', 'declined', 'expired', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE quote_status_type AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'expired', 'superseded', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE quote_item_kind_type AS ENUM ('labour', 'material', 'visit_fee', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE materials_responsibility_type AS ENUM ('customer', 'provider', 'shared');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE review_moderation_status AS ENUM ('visible', 'hidden_pending_review', 'removed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('cash', 'online', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM ('not_due', 'due', 'reported_paid', 'confirmed_paid', 'disputed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. USER PROFILES & SECURE ROLES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(trim(display_name)) >= 2),
  avatar_path text NULL,
  phone_e164 text NULL,
  preferred_language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Privileged user roles table (NEVER self-assigned from client)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role_type NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_role UNIQUE (user_id, role)
);
CREATE INDEX IF NOT EXISTS idx_user_roles_lookup ON public.user_roles (user_id, role);

-- ----------------------------------------------------------------------------
-- 3. SERVICE CATALOGUE & SERVICE AREAS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.service_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  icon_key text NOT NULL DEFAULT 'Wrench',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON public.service_categories (is_active, sort_order);

CREATE TABLE IF NOT EXISTS public.service_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL,
  pricing_mode pricing_mode_type NOT NULL,
  fixed_price numeric(12,2) NULL CHECK (fixed_price IS NULL OR fixed_price >= 0),
  visit_fee numeric(12,2) NULL CHECK (visit_fee IS NULL OR visit_fee >= 0),
  currency text NOT NULL DEFAULT 'PKR',
  scope_inclusions text NOT NULL DEFAULT '',
  scope_exclusions text NOT NULL DEFAULT '',
  requires_skill_assessment boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_category_task_slug UNIQUE (category_id, slug),
  CONSTRAINT chk_fixed_pricing CHECK (
    (pricing_mode = 'fixed' AND fixed_price IS NOT NULL) OR
    (pricing_mode IN ('inspection_quote', 'quote_only'))
  )
);
CREATE INDEX IF NOT EXISTS idx_service_tasks_category ON public.service_tasks (category_id, is_active);

CREATE TABLE IF NOT EXISTS public.service_areas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  city text NOT NULL DEFAULT 'Karachi',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_service_area_name_city UNIQUE (name, city)
);
CREATE INDEX IF NOT EXISTS idx_service_areas_active ON public.service_areas (is_active, city);

-- ----------------------------------------------------------------------------
-- 4. PROFESSIONAL PROFILES, SERVICES & VERIFICATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.provider_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  public_name text NOT NULL CHECK (char_length(trim(public_name)) >= 2),
  bio text NULL,
  experience_years integer NULL CHECK (experience_years IS NULL OR (experience_years >= 0 AND experience_years <= 60)),
  application_status provider_app_status NOT NULL DEFAULT 'draft',
  availability_status availability_status_type NOT NULL DEFAULT 'offline',
  base_area_id uuid NULL REFERENCES public.service_areas(id) ON DELETE SET NULL,
  travel_radius_km numeric(5,2) NULL CHECK (travel_radius_km IS NULL OR travel_radius_km > 0),
  profile_photo_path text NULL,
  approved_at timestamptz NULL,
  approved_by uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_provider_match ON public.provider_profiles (application_status, availability_status, base_area_id);

CREATE TABLE IF NOT EXISTS public.provider_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
  task_id uuid NULL REFERENCES public.service_tasks(id) ON DELETE CASCADE,
  experience_note text NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_provider_cat_task UNIQUE (provider_id, category_id, task_id)
);
CREATE INDEX IF NOT EXISTS idx_provider_services_lookup ON public.provider_services (category_id, task_id, is_active);

CREATE TABLE IF NOT EXISTS public.provider_service_areas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  service_area_id uuid NOT NULL REFERENCES public.service_areas(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_provider_area UNIQUE (provider_id, service_area_id)
);
CREATE INDEX IF NOT EXISTS idx_provider_service_areas ON public.provider_service_areas (service_area_id);

-- Distinct verification checks (Separates manual CNIC review from trade skill test)
CREATE TABLE IF NOT EXISTS public.provider_verifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  verification_type verification_type_enum NOT NULL,
  category_id uuid NULL REFERENCES public.service_categories(id) ON DELETE SET NULL,
  status verification_status_enum NOT NULL DEFAULT 'not_started',
  method_description text NOT NULL,
  evidence_path text NULL, -- private bucket path
  reviewer_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz NULL,
  expires_at timestamptz NULL,
  result_summary text NULL,
  private_notes text NULL, -- private to staff
  rejection_reason text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_provider_verif_type UNIQUE (provider_id, verification_type, category_id)
);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON public.provider_verifications (provider_id, status);

CREATE TABLE IF NOT EXISTS public.provider_assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
  task_id uuid NULL REFERENCES public.service_tasks(id) ON DELETE SET NULL,
  assessor_name text NOT NULL,
  assessor_notes text NULL,
  checklist_version text NOT NULL DEFAULT 'v1.0',
  passed boolean NOT NULL DEFAULT false,
  score numeric(5,2) NULL,
  assessed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. CUSTOMER ADDRESSES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home',
  address_line text NOT NULL,
  service_area_id uuid NOT NULL REFERENCES public.service_areas(id) ON DELETE RESTRICT,
  access_instructions text NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user ON public.customer_addresses (user_id);

-- ----------------------------------------------------------------------------
-- 6. JOBS & JOB MEDIA
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  category_id uuid NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
  task_id uuid NULL REFERENCES public.service_tasks(id) ON DELETE SET NULL,
  description text NOT NULL CHECK (char_length(trim(description)) >= 10),
  urgency text NOT NULL CHECK (urgency IN ('asap', 'scheduled')),
  scheduled_for timestamptz NULL,
  service_area_id uuid NOT NULL REFERENCES public.service_areas(id) ON DELETE RESTRICT,
  -- Private address snapshot: Only unlocked to assigned provider once confirmed
  address_snapshot text NOT NULL,
  latitude numeric(9,6) NULL,
  longitude numeric(9,6) NULL,
  job_status job_status_type NOT NULL DEFAULT 'open',
  pricing_mode pricing_mode_type NOT NULL DEFAULT 'inspection_quote',
  accepted_provider_id uuid NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
  selected_visit_fee numeric(12,2) NULL CHECK (selected_visit_fee IS NULL OR selected_visit_fee >= 0),
  approved_quote_id uuid NULL, -- Forward referenced, linked to quotes table
  customer_notes text NULL,
  completion_note text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz NULL,
  completed_at timestamptz NULL,
  cancelled_at timestamptz NULL,
  CONSTRAINT chk_scheduled_time CHECK (
    (urgency = 'asap') OR (urgency = 'scheduled' AND scheduled_for IS NOT NULL)
  )
);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON public.jobs (customer_id, job_status);
CREATE INDEX IF NOT EXISTS idx_jobs_accepted_provider ON public.jobs (accepted_provider_id, job_status);
CREATE INDEX IF NOT EXISTS idx_jobs_status_area ON public.jobs (job_status, service_area_id);

CREATE TABLE IF NOT EXISTS public.job_media (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  storage_path text NOT NULL,
  media_type text NOT NULL,
  file_size_bytes integer NOT NULL CHECK (file_size_bytes > 0 AND file_size_bytes <= 10485760), -- max 10MB
  purpose text NOT NULL CHECK (purpose IN ('request', 'completion', 'dispute')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_job_media_job ON public.job_media (job_id);

-- ----------------------------------------------------------------------------
-- 7. BOOKING REQUESTS (Yango-style shortlist request with 2-min timeout)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.booking_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
  status booking_request_status_type NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  responded_at timestamptz NULL,
  response_reason text NULL,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  CONSTRAINT chk_expiry_future CHECK (expires_at > requested_at)
);

-- Unique index to guarantee MVP invariant: At most ONE pending request per job at any time!
CREATE UNIQUE INDEX IF NOT EXISTS uq_one_pending_request_per_job 
  ON public.booking_requests (job_id) 
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_booking_requests_provider_status ON public.booking_requests (provider_id, status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_expiring ON public.booking_requests (status, expires_at) WHERE status = 'pending';

-- ----------------------------------------------------------------------------
-- 8. QUOTATIONS & ITEMIZED LINE ITEMS (Immutable once approved)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
  version_number integer NOT NULL DEFAULT 1 CHECK (version_number >= 1),
  status quote_status_type NOT NULL DEFAULT 'submitted',
  currency text NOT NULL DEFAULT 'PKR',
  subtotal numeric(12,2) NOT NULL CHECK (subtotal >= 0),
  discount numeric(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total numeric(12,2) NOT NULL CHECK (total >= 0),
  scope_summary text NOT NULL CHECK (char_length(trim(scope_summary)) >= 10),
  exclusions text NOT NULL DEFAULT 'Materials not explicitly listed are excluded',
  materials_responsibility materials_responsibility_type NOT NULL DEFAULT 'customer',
  valid_until timestamptz NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz NULL,
  decided_by uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  revision_reason text NULL,
  supersedes_quote_id uuid NULL REFERENCES public.quotes(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_job_quote_version UNIQUE (job_id, version_number)
);
CREATE INDEX IF NOT EXISTS idx_quotes_job ON public.quotes (job_id, status);

CREATE TABLE IF NOT EXISTS public.quote_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  kind quote_item_kind_type NOT NULL,
  description text NOT NULL CHECK (char_length(trim(description)) >= 2),
  quantity numeric(10,2) NOT NULL CHECK (quantity > 0),
  unit text NOT NULL DEFAULT 'unit',
  unit_price numeric(12,2) NOT NULL CHECK (unit_price >= 0),
  line_total numeric(12,2) NOT NULL CHECK (line_total >= 0),
  notes text NULL
);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON public.quote_items (quote_id);

-- Add foreign key constraint from jobs.approved_quote_id to quotes.id
ALTER TABLE public.jobs 
  ADD CONSTRAINT fk_jobs_approved_quote 
  FOREIGN KEY (approved_quote_id) 
  REFERENCES public.quotes(id) 
  ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 9. JOB EVENTS (Append-only audit timeline)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.job_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  actor_user_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  old_status text NULL,
  new_status text NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_job_events_job ON public.job_events (job_id, created_at);

-- ----------------------------------------------------------------------------
-- 10. REVIEWS (One review per completed job, customer-only, rating 1-5)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL UNIQUE REFERENCES public.jobs(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  provider_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NULL CHECK (comment IS NULL OR char_length(comment) <= 1000),
  moderation_status review_moderation_status NOT NULL DEFAULT 'visible',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON public.reviews (provider_id, moderation_status);

-- ----------------------------------------------------------------------------
-- 11. DISPUTES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.disputes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  opened_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  issue_type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_investigation', 'resolved', 'closed')),
  assigned_admin_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolution_summary text NULL,
  resolution_outcome text NULL,
  resolved_by uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_disputes_job ON public.disputes (job_id, status);

-- ----------------------------------------------------------------------------
-- 12. PILOT PAYMENT RECORDS & COMMISSION LEDGER
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payment_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  payer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  payee_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'PKR',
  method payment_method_type NOT NULL DEFAULT 'cash',
  status payment_status_type NOT NULL DEFAULT 'due',
  reported_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  confirmed_by uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  reconciliation_notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payment_records_job ON public.payment_records (job_id);

CREATE TABLE IF NOT EXISTS public.commission_ledger (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL UNIQUE REFERENCES public.jobs(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
  gross_amount numeric(12,2) NOT NULL CHECK (gross_amount >= 0),
  commission_rate numeric(5,2) NOT NULL DEFAULT 10.00, -- e.g. 10%
  expected_commission numeric(12,2) NOT NULL CHECK (expected_commission >= 0),
  reconciliation_status text NOT NULL DEFAULT 'pending' CHECK (reconciliation_status IN ('pending', 'reconciled', 'waived', 'disputed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 13. ADMIN AUDIT LOGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  action text NOT NULL,
  target_table text NOT NULL,
  target_id text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs ON public.admin_audit_logs (actor_id, action, created_at);
