import { describe, it, expect } from "vitest";
import {
  createJobRequestSchema,
  respondToBookingRequestSchema,
  submitQuoteSchema,
  createReviewSchema,
} from "../index";

describe("Validation Schemas", () => {
  describe("createJobRequestSchema", () => {
    it("validates a valid job request payload", () => {
      const validPayload = {
        categoryId: "c1000000-0000-0000-0000-000000000001",
        description: "Kitchen basin pipe leaking under the cabinet rapidly.",
        urgency: "asap",
        serviceAreaId: "a1000000-0000-0000-0000-000000000001",
        addressText: "Flat 402, Al-Razi Heights, Gulshan Block 5",
      };
      const result = createJobRequestSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects too short description", () => {
      const invalidPayload = {
        categoryId: "c1000000-0000-0000-0000-000000000001",
        description: "Broken",
        urgency: "asap",
        serviceAreaId: "a1000000-0000-0000-0000-000000000001",
        addressText: "Flat 402, Al-Razi Heights",
      };
      const result = createJobRequestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("respondToBookingRequestSchema", () => {
    it("accepts valid response action", () => {
      const payload = {
        requestId: "b1000000-0000-0000-0000-000000000001",
        action: "accept" as const,
      };
      const result = respondToBookingRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("rejects invalid action string", () => {
      const payload = {
        requestId: "b1000000-0000-0000-0000-000000000001",
        action: "invalid_action",
      };
      const result = respondToBookingRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("submitQuoteSchema", () => {
    it("validates itemized quote structure", () => {
      const quotePayload = {
        jobId: "11111111-1111-1111-1111-111111111111",
        scopeSummary: "Replacement of broken basin mixer and sealing main joint.",
        materialsResponsibility: "customer" as const,
        discount: 0,
        items: [
          {
            kind: "labour" as const,
            description: "Labour for basin mixer replacement",
            quantity: 1,
            unit: "job",
            unitPrice: 800,
          },
        ],
      };
      const result = submitQuoteSchema.safeParse(quotePayload);
      expect(result.success).toBe(true);
    });

    it("rejects quote with empty items", () => {
      const quotePayload = {
        jobId: "11111111-1111-1111-1111-111111111111",
        scopeSummary: "No items listed in this quote",
        materialsResponsibility: "customer" as const,
        discount: 0,
        items: [],
      };
      const result = submitQuoteSchema.safeParse(quotePayload);
      expect(result.success).toBe(false);
    });
  });

  describe("createReviewSchema", () => {
    it("accepts rating between 1 and 5", () => {
      expect(
        createReviewSchema.safeParse({
          jobId: "11111111-1111-1111-1111-111111111111",
          rating: 5,
          comment: "Punctual and fixed the leak cleanly.",
        }).success
      ).toBe(true);
    });

    it("rejects rating greater than 5 or less than 1", () => {
      expect(
        createReviewSchema.safeParse({
          jobId: "j1000000-0000-0000-0000-000000000001",
          rating: 6,
        }).success
      ).toBe(false);

      expect(
        createReviewSchema.safeParse({
          jobId: "j1000000-0000-0000-0000-000000000001",
          rating: 0,
        }).success
      ).toBe(false);
    });
  });
});
