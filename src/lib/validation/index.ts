import { z } from "zod";

// Customer Job Request Validation
export const createJobRequestSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  taskId: z.string().uuid("Invalid task ID").optional().nullable(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  urgency: z.enum(["asap", "scheduled"]),
  scheduledFor: z.string().datetime().optional().nullable(),
  serviceAreaId: z.string().uuid("Invalid service area ID"),
  addressText: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address must be under 300 characters"),
  customerNotes: z.string().max(500).optional().nullable(),
});

export type CreateJobRequestInput = z.infer<typeof createJobRequestSchema>;

// Booking Request Action (Accept / Decline)
export const respondToBookingRequestSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
  action: z.enum(["accept", "decline"]),
  reason: z.string().max(300).optional(),
});

export type RespondToBookingRequestInput = z.infer<typeof respondToBookingRequestSchema>;

// Quote Submission Schema
export const quoteLineItemSchema = z.object({
  kind: z.enum(["labour", "material", "visit_fee", "other"]),
  description: z.string().min(2, "Description required").max(200),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit required").max(30),
  unitPrice: z.number().nonnegative("Unit price must be non-negative"),
  notes: z.string().max(200).optional().nullable(),
});

export const submitQuoteSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  scopeSummary: z.string().min(10, "Scope summary must be at least 10 characters"),
  exclusions: z.string().max(500).default("Materials not explicitly listed are excluded"),
  materialsResponsibility: z.enum(["customer", "provider", "shared"]),
  discount: z.number().nonnegative("Discount cannot be negative").default(0),
  items: z.array(quoteLineItemSchema).min(1, "At least one line item is required"),
  validUntil: z.string().datetime().optional().nullable(),
});

export type SubmitQuoteInput = z.infer<typeof submitQuoteSchema>;

// Review Schema
export const createReviewSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  rating: z.number().int().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
  comment: z.string().max(1000).optional().nullable(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// Professional Registration / Onboarding Schema
export const providerApplicationSchema = z.object({
  publicName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  phone: z
    .string()
    .regex(/^(03\d{9}|\+923\d{9})$/, "Invalid Pakistani mobile number (e.g. 03001234567 or +923001234567)"),
  experienceYears: z
    .number()
    .int()
    .min(0, "Experience years cannot be negative")
    .max(60, "Experience years must be 60 or less"),
  bio: z.string().max(1000, "Bio must be under 1000 characters").optional().nullable(),
  tradeCategoryIds: z.array(z.string().uuid("Invalid category ID")).min(1, "Select at least one trade"),
  serviceAreaIds: z.array(z.string().uuid("Invalid service area ID")).min(1, "Select at least one service area"),
  cnicNumber: z
    .string()
    .regex(/^(\d{5}-\d{7}-\d{1}|\d{13})$/, "CNIC must be 13 digits (e.g. 42101-1234567-1 or 4210112345671)"),
});

export type ProviderApplicationInput = z.infer<typeof providerApplicationSchema>;

// Admin Verification Decision Schema
export const adminVerificationDecisionSchema = z.object({
  providerId: z.string().uuid("Invalid provider ID"),
  verificationType: z.enum(["contact", "identity_review", "skill_assessment", "certificate_review"]),
  categoryId: z.string().uuid("Invalid category ID").optional().nullable(),
  status: z.enum(["pending", "approved", "rejected", "needs_more_information"]),
  methodDescription: z
    .string()
    .min(5, "Method description must be at least 5 characters")
    .max(300),
  resultSummary: z.string().min(3, "Result summary must be at least 3 characters").max(500),
  privateNotes: z.string().max(1000).optional().nullable(),
  rejectionReason: z.string().max(500).optional().nullable(),
});

export type AdminVerificationDecisionInput = z.infer<typeof adminVerificationDecisionSchema>;

// Admin Application Status Decision Schema
export const adminApplicationDecisionSchema = z.object({
  providerId: z.string().uuid("Invalid provider ID"),
  decision: z.enum(["approved", "rejected", "paused", "suspended"]),
  reason: z.string().min(5, "Reason must be at least 5 characters").max(500),
});

export type AdminApplicationDecisionInput = z.infer<typeof adminApplicationDecisionSchema>;

// Admin Service Task Management Schema
export const manageServiceTaskSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  pricingMode: z.enum(["fixed", "inspection_quote", "quote_only"]),
  fixedPrice: z.number().nonnegative("Fixed price must be non-negative").optional().nullable(),
  visitFee: z.number().nonnegative("Visit fee must be non-negative").optional().nullable(),
  currency: z.string().default("PKR"),
  scopeInclusions: z.string().min(5, "Inclusions must be at least 5 characters").max(500),
  scopeExclusions: z.string().min(5, "Exclusions must be at least 5 characters").max(500),
  requiresSkillAssessment: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export type ManageServiceTaskInput = z.infer<typeof manageServiceTaskSchema>;

