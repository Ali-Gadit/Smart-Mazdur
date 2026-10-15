// Core Domain Types for Smart Mazdur Skilled Labour Marketplace

export type UserRole = "customer" | "professional" | "admin";

export interface Profile {
  id: string;
  display_name: string;
  avatar_path: string | null;
  phone_e164: string | null;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_key: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type PricingMode = "fixed" | "inspection_quote" | "quote_only";

export interface ServiceTask {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  pricing_mode: PricingMode;
  fixed_price: number | null;
  visit_fee: number | null;
  currency: string;
  scope_inclusions: string;
  scope_exclusions: string;
  requires_skill_assessment: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  city: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProviderApplicationStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "paused"
  | "suspended";

export type AvailabilityStatus = "offline" | "online" | "busy";

export interface ProviderProfile {
  id: string;
  user_id: string;
  public_name: string;
  bio: string | null;
  experience_years: number | null;
  application_status: ProviderApplicationStatus;
  availability_status: AvailabilityStatus;
  base_area_id: string | null;
  travel_radius_km: number | null;
  profile_photo_path: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export type VerificationType =
  | "contact"
  | "identity_review"
  | "skill_assessment"
  | "certificate_review";

export type VerificationStatus =
  | "not_started"
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "needs_more_information";

export interface ProviderVerification {
  id: string;
  provider_id: string;
  verification_type: VerificationType;
  category_id: string | null;
  status: VerificationStatus;
  method_description: string;
  evidence_path: string | null;
  reviewer_id: string | null;
  reviewed_at: string | null;
  result_summary: string | null;
  private_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type JobStatus =
  | "draft"
  | "open"
  | "request_pending"
  | "confirmed"
  | "scheduled"
  | "en_route"
  | "arrived"
  | "inspection_in_progress"
  | "quote_pending"
  | "quote_approved"
  | "in_progress"
  | "completion_requested"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Job {
  id: string;
  customer_id: string;
  category_id: string;
  task_id: string | null;
  description: string;
  urgency: "asap" | "scheduled";
  scheduled_for: string | null;
  service_area_id: string;
  address_snapshot: string;
  latitude: number | null;
  longitude: number | null;
  job_status: JobStatus;
  pricing_mode: PricingMode;
  accepted_provider_id: string | null;
  selected_visit_fee: number | null;
  approved_quote_id: string | null;
  customer_notes: string | null;
  completion_note: string | null;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
}

export type BookingRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "expired"
  | "cancelled";

export interface BookingRequest {
  id: string;
  job_id: string;
  provider_id: string;
  status: BookingRequestStatus;
  requested_at: string;
  expires_at: string;
  responded_at: string | null;
  response_reason: string | null;
  created_by: string;
}

export type QuoteStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "expired"
  | "superseded"
  | "cancelled";

export interface Quote {
  id: string;
  job_id: string;
  provider_id: string;
  version_number: number;
  status: QuoteStatus;
  currency: string;
  subtotal: number;
  discount: number;
  total: number;
  scope_summary: string;
  exclusions: string;
  materials_responsibility: "customer" | "provider" | "shared";
  valid_until: string | null;
  submitted_at: string;
  decided_at: string | null;
  decided_by: string | null;
  revision_reason: string | null;
  supersedes_quote_id: string | null;
  created_at: string;
  updated_at: string;
}

export type QuoteItemKind = "labour" | "material" | "visit_fee" | "other";

export interface QuoteItem {
  id: string;
  quote_id: string;
  kind: QuoteItemKind;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  line_total: number;
  notes: string | null;
}

export interface Review {
  id: string;
  job_id: string;
  customer_id: string;
  provider_id: string;
  rating: number; // 1 to 5
  comment: string | null;
  moderation_status: "visible" | "hidden_pending_review" | "removed";
  created_at: string;
  updated_at: string;
}

export interface JobEvent {
  id: string;
  job_id: string;
  actor_user_id: string | null;
  event_type: string;
  old_status: string | null;
  new_status: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  job_id: string;
  payer_id: string;
  payee_id: string;
  amount: number;
  currency: string;
  method: "cash" | "online" | "other";
  status: "not_due" | "due" | "reported_paid" | "confirmed_paid" | "disputed";
  reported_by: string;
  confirmed_by: string | null;
  created_at: string;
  updated_at: string;
}

// Projected safe candidate model for shortlist
export interface ShortlistCandidate {
  provider_id: string;
  public_name: string;
  profile_photo_path: string | null;
  experience_years: number | null;
  bio: string | null;
  base_area_name: string;
  availability_status: AvailabilityStatus;
  identity_reviewed: boolean;
  skills_assessed: boolean;
  rating_average: number | null;
  rating_count: number;
  completed_jobs_count: number;
  indicative_visit_fee: number;
  fixed_task_price: number | null;
  match_score: number;
}
