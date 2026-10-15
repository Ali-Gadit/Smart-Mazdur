import { describe, it, expect } from "vitest";
import { getActiveCategories, getCategoryWithTasksBySlug } from "../index";

describe("Catalogue Feature Module", () => {
  it("retrieves active launch categories (Plumbing, Electrical, AC Repair)", async () => {
    const response = await getActiveCategories();
    expect(response.data).toBeDefined();
    expect(response.data.length).toBeGreaterThanOrEqual(3);

    const slugs = response.data.map((c) => c.slug);
    expect(slugs).toContain("plumbing");
    expect(slugs).toContain("electrical");
    expect(slugs).toContain("ac-repair");
  });

  it("retrieves category by slug with associated tasks and scope definitions", async () => {
    const response = await getCategoryWithTasksBySlug("plumbing");
    expect(response.data).not.toBeNull();
    expect(response.data?.category.name).toBe("Plumbing");
    expect(response.data?.tasks.length).toBeGreaterThan(0);

    const task = response.data?.tasks[0];
    expect(task).toBeDefined();
    expect(task?.scope_inclusions).toBeDefined();
    expect(task?.scope_exclusions).toBeDefined();
    expect(task?.pricing_mode).toBeDefined();
  });

  it("returns null data for non-existent slug", async () => {
    const response = await getCategoryWithTasksBySlug("unknown-non-existent-trade");
    expect(response.data).toBeNull();
  });
});

describe("Vetting & Badge Policy Rules", () => {
  interface MockProviderState {
    identity_reviewed: boolean;
    skills_assessed: boolean;
    application_status: string;
  }

  function computePublicBadges(provider: MockProviderState) {
    if (provider.application_status !== "approved") {
      return { showIdentityBadge: false, showSkillsBadge: false, isShortlistEligible: false };
    }
    return {
      showIdentityBadge: provider.identity_reviewed === true,
      showSkillsBadge: provider.skills_assessed === true,
      isShortlistEligible: provider.identity_reviewed && provider.skills_assessed,
    };
  }

  it("does not show badges for pending or unapproved providers", () => {
    const pendingProvider: MockProviderState = {
      identity_reviewed: true,
      skills_assessed: true,
      application_status: "pending",
    };
    const badges = computePublicBadges(pendingProvider);
    expect(badges.isShortlistEligible).toBe(false);
  });

  it("only displays identity badge if identity check is actually approved", () => {
    const provider: MockProviderState = {
      identity_reviewed: false,
      skills_assessed: true,
      application_status: "approved",
    };
    const badges = computePublicBadges(provider);
    expect(badges.showIdentityBadge).toBe(false);
    expect(badges.showSkillsBadge).toBe(true);
    expect(badges.isShortlistEligible).toBe(false); // both required for shortlist
  });

  it("grants shortlist eligibility only when both checks are independently passed", () => {
    const approvedProvider: MockProviderState = {
      identity_reviewed: true,
      skills_assessed: true,
      application_status: "approved",
    };
    const badges = computePublicBadges(approvedProvider);
    expect(badges.showIdentityBadge).toBe(true);
    expect(badges.showSkillsBadge).toBe(true);
    expect(badges.isShortlistEligible).toBe(true);
  });
});
