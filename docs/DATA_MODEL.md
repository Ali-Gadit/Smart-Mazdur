# Data Model & Schema Specification

## 1. Entity Relationship Summary

```
auth.users (Supabase managed)
  │
  ├── profiles (1:1 with auth.users)
  │     ├── user_roles (1:N or secure role claims)
  │     ├── provider_profiles (1:1 optional, if user is professional)
  │     │     ├── provider_services (1:N with service_categories / service_tasks)
  │     │     ├── provider_service_areas (1:N with service_areas)
  │     │     ├── provider_verifications (1:N)
  │     │     └── provider_assessments (1:N)
  │     └── customer_addresses (1:N)
  │
  └── jobs (customer_id -> profiles.id)
        ├── job_media (1:N, private storage bucket references)
        ├── booking_requests (1:N, max 1 active/pending at a time)
        ├── quotes (1:N, versioned immutable records)
        │     └── quote_items (1:N itemized lines)
        ├── job_events (1:N, append-only timeline)
        ├── reviews (1:1 unique per completed job)
        ├── disputes (1:N)
        ├── payment_records (1:N off-platform cash records)
        └── commission_ledger (1:1 expected fee calculations)
```

## 2. Table Specifications

### 2.1 `profiles`
- `id` (uuid, PK, references `auth.users.id` on delete cascade)
- `display_name` (text, not null)
- `avatar_path` (text, null)
- `phone_e164` (text, null)
- `preferred_language` (text, default `'en'`)
- `created_at` (timestamptz, default `now()`)
- `updated_at` (timestamptz, default `now()`)

### 2.2 `user_roles`
- `id` (uuid, PK)
- `user_id` (uuid, references `profiles.id`)
- `role` (enum: `'customer'`, `'professional'`, `'admin'`)
- `created_at` (timestamptz)

### 2.3 `service_categories`
- `id` (uuid, PK)
- `name` (text, not null)
- `slug` (text, unique, not null)
- `description` (text)
- `icon_key` (text)
- `is_active` (boolean, default true)
- `sort_order` (integer, default 0)
- `created_at`, `updated_at` (timestamptz)

### 2.4 `service_tasks`
- `id` (uuid, PK)
- `category_id` (uuid, references `service_categories.id`)
- `name` (text, not null)
- `slug` (text, not null)
- `description` (text)
- `pricing_mode` (enum: `'fixed'`, `'inspection_quote'`, `'quote_only'`)
- `fixed_price` (numeric(12,2), null)
- `visit_fee` (numeric(12,2), null)
- `currency` (text, default `'PKR'`)
- `scope_inclusions` (text)
- `scope_exclusions` (text)
- `requires_skill_assessment` (boolean, default true)
- `is_active` (boolean, default true)
- `created_at`, `updated_at` (timestamptz)

### 2.5 `service_areas`
- `id` (uuid, PK)
- `name` (text, not null) -- e.g. "Gulshan-e-Iqbal Zone 1"
- `city` (text, default `'Karachi'`)
- `is_active` (boolean, default true)
- `created_at`, `updated_at` (timestamptz)

### 2.6 `provider_profiles`
- `id` (uuid, PK)
- `user_id` (uuid, unique, references `profiles.id`)
- `public_name` (text, not null)
- `bio` (text)
- `experience_years` (integer)
- `application_status` (enum: `'draft'`, `'pending'`, `'approved'`, `'rejected'`, `'paused'`, `'suspended'`)
- `availability_status` (enum: `'offline'`, `'online'`, `'busy'`)
- `base_area_id` (uuid, references `service_areas.id`)
- `approved_at` (timestamptz, null)
- `approved_by` (uuid, references `profiles.id`, null)
- `created_at`, `updated_at` (timestamptz)

### 2.7 `provider_verifications`
- `id` (uuid, PK)
- `provider_id` (uuid, references `provider_profiles.id`)
- `verification_type` (enum: `'contact'`, `'identity_review'`, `'skill_assessment'`, `'certificate_review'`)
- `category_id` (uuid, null, references `service_categories.id`)
- `status` (enum: `'not_started'`, `'pending'`, `'approved'`, `'rejected'`, `'expired'`, `'needs_more_information'`)
- `method_description` (text)
- `evidence_path` (text, null -- private bucket path)
- `reviewer_id` (uuid, references `profiles.id`, null)
- `reviewed_at` (timestamptz, null)
- `result_summary` (text, null)
- `private_notes` (text, null -- private to admin)
- `rejection_reason` (text, null)
- `created_at`, `updated_at` (timestamptz)

### 2.8 `jobs`
- `id` (uuid, PK)
- `customer_id` (uuid, references `profiles.id`)
- `category_id` (uuid, references `service_categories.id`)
- `task_id` (uuid, null, references `service_tasks.id`)
- `description` (text, not null)
- `urgency` (text: `'asap'` or `'scheduled'`)
- `scheduled_for` (timestamptz, null)
- `service_area_id` (uuid, references `service_areas.id`)
- `address_snapshot` (text, not null -- masked until booking accepted)
- `latitude` (numeric(9,6), null)
- `longitude` (numeric(9,6), null)
- `job_status` (enum: `'draft'`, `'open'`, `'request_pending'`, `'confirmed'`, `'scheduled'`, `'en_route'`, `'arrived'`, `'inspection_in_progress'`, `'quote_pending'`, `'quote_approved'`, `'in_progress'`, `'completion_requested'`, `'completed'`, `'cancelled'`, `'disputed'`)
- `pricing_mode` (text)
- `accepted_provider_id` (uuid, null, references `provider_profiles.id`)
- `selected_visit_fee` (numeric(12,2), null)
- `approved_quote_id` (uuid, null)
- `customer_notes` (text, null)
- `completion_note` (text, null)
- `created_at`, `updated_at`, `accepted_at`, `completed_at`, `cancelled_at` (timestamptz)

### 2.9 `booking_requests`
- `id` (uuid, PK)
- `job_id` (uuid, references `jobs.id`)
- `provider_id` (uuid, references `provider_profiles.id`)
- `status` (enum: `'pending'`, `'accepted'`, `'declined'`, `'expired'`, `'cancelled'`)
- `requested_at` (timestamptz, default `now()`)
- `expires_at` (timestamptz, not null)
- `responded_at` (timestamptz, null)
- `response_reason` (text, null)
- `created_by` (uuid, references `profiles.id`)

### 2.10 `quotes` and `quote_items`
- `quotes`: `id`, `job_id`, `provider_id`, `version_number`, `status` (`'draft'`, `'submitted'`, `'approved'`, `'rejected'`, `'expired'`, `'superseded'`), `currency` (`'PKR'`), `subtotal`, `discount`, `total`, `scope_summary`, `exclusions`, `materials_responsibility`, `valid_until`, `submitted_at`, `decided_at`, `decided_by`, `revision_reason`, `supersedes_quote_id`.
- `quote_items`: `id`, `quote_id`, `kind` (`'labour'`, `'material'`, `'visit_fee'`, `'other'`), `description`, `quantity`, `unit`, `unit_price`, `line_total`, `notes`.

### 2.11 `reviews`
- `id` (uuid, PK)
- `job_id` (uuid, unique, references `jobs.id`)
- `customer_id` (uuid, references `profiles.id`)
- `provider_id` (uuid, references `provider_profiles.id`)
- `rating` (smallint, check `rating >= 1 and rating <= 5`)
- `comment` (text, null)
- `moderation_status` (text: `'visible'`, `'hidden'`, `'removed'`)
- `created_at`, `updated_at` (timestamptz)
