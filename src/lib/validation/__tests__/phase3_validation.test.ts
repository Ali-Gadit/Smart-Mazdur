import { describe, it, expect } from "vitest";
import {
  providerApplicationSchema,
  adminVerificationDecisionSchema,
  adminApplicationDecisionSchema,
  manageServiceTaskSchema,
} from "../index";

describe("Phase 3 Validation Schemas", () => {
  describe("providerApplicationSchema", () => {
    it("validates a complete, valid technician application", () => {
      const validPayload = {
        publicName: "Tariq Mehmood",
        phone: "03001234567",
        experienceYears: 8,
        bio: "Specializing in PPRC pipe fittings, water pumps, and sanitary fixtures.",
        tradeCategoryIds: ["c1000000-0000-0000-0000-000000000001"],
        serviceAreaIds: ["a1000000-0000-0000-0000-000000000001"],
        cnicNumber: "42101-1234567-1",
      };
      const result = providerApplicationSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("accepts Pakistani phone with +923 country code prefix", () => {
      const validPayload = {
        publicName: "Muhammad Asif",
        phone: "+923001234567",
        experienceYears: 5,
        tradeCategoryIds: ["c1000000-0000-0000-0000-000000000001"],
        serviceAreaIds: ["a1000000-0000-0000-0000-000000000001"],
        cnicNumber: "4210112345671",
      };
      const result = providerApplicationSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects invalid Pakistani phone numbers", () => {
      const invalidPayload = {
        publicName: "Rashid Ali",
        phone: "12345", // invalid format
        experienceYears: 10,
        tradeCategoryIds: ["c1000000-0000-0000-0000-000000000001"],
        serviceAreaIds: ["a1000000-0000-0000-0000-000000000001"],
        cnicNumber: "42101-1234567-1",
      };
      const result = providerApplicationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("rejects application without selected trades", () => {
      const invalidPayload = {
        publicName: "Rashid Ali",
        phone: "03001234567",
        experienceYears: 10,
        tradeCategoryIds: [], // empty
        serviceAreaIds: ["a1000000-0000-0000-0000-000000000001"],
        cnicNumber: "42101-1234567-1",
      };
      const result = providerApplicationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("rejects invalid CNIC format", () => {
      const invalidPayload = {
        publicName: "Rashid Ali",
        phone: "03001234567",
        experienceYears: 10,
        tradeCategoryIds: ["c1000000-0000-0000-0000-000000000001"],
        serviceAreaIds: ["a1000000-0000-0000-0000-000000000001"],
        cnicNumber: "ABC-123", // invalid
      };
      const result = providerApplicationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("adminVerificationDecisionSchema", () => {
    it("validates identity review decision", () => {
      const payload = {
        providerId: "d1000000-0000-0000-0000-000000000001",
        verificationType: "identity_review" as const,
        status: "approved" as const,
        methodDescription: "Physical inspection of original CNIC in Karachi branch",
        resultSummary: "Verified photo and valid CNIC expiry date",
      };
      const result = adminVerificationDecisionSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("validates skill assessment decision with category ID", () => {
      const payload = {
        providerId: "d1000000-0000-0000-0000-000000000001",
        verificationType: "skill_assessment" as const,
        categoryId: "c1000000-0000-0000-0000-000000000001",
        status: "approved" as const,
        methodDescription: "PPRC heat-pipe test observed by master plumber",
        resultSummary: "Passed with 95% on pipe pressure test checklist",
        privateNotes: "Candidate has own welding iron and cutter",
      };
      const result = adminVerificationDecisionSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("rejects decision with missing method description", () => {
      const payload = {
        providerId: "d1000000-0000-0000-0000-000000000001",
        verificationType: "skill_assessment" as const,
        status: "approved" as const,
        methodDescription: "", // too short
        resultSummary: "Passed",
      };
      const result = adminVerificationDecisionSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("adminApplicationDecisionSchema", () => {
    it("validates application approval decision", () => {
      const payload = {
        providerId: "d1000000-0000-0000-0000-000000000001",
        decision: "approved" as const,
        reason: "All identity and trade assessment checks passed successfully.",
      };
      const result = adminApplicationDecisionSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("validates application rejection decision", () => {
      const payload = {
        providerId: "d1000000-0000-0000-0000-000000000001",
        decision: "rejected" as const,
        reason: "Applicant failed the practical electrical safety multimeter check.",
      };
      const result = adminApplicationDecisionSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });

  describe("manageServiceTaskSchema", () => {
    it("validates fixed price task setup", () => {
      const payload = {
        categoryId: "c1000000-0000-0000-0000-000000000001",
        name: "Tap Mixer Replacement",
        slug: "tap-mixer-replacement",
        description: "Standard replacement of existing wash basin mixer.",
        pricingMode: "fixed" as const,
        fixedPrice: 800,
        visitFee: 500,
        currency: "PKR",
        scopeInclusions: "Labour to install mixer and test for leakage.",
        scopeExclusions: "Mixer unit and new pipes not included.",
        requiresSkillAssessment: true,
        isActive: true,
      };
      const result = manageServiceTaskSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });
});
