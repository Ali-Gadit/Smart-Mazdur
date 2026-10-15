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
