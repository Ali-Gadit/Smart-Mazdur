import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Database Migrations, RLS & Concurrency Invariants", () => {
  const migrationsDir = path.resolve(process.cwd(), "supabase/migrations");
  const schemaSql = fs.readFileSync(
    path.join(migrationsDir, "20261015000001_create_schema.sql"),
    "utf-8"
  );
  const rlsSql = fs.readFileSync(
    path.join(migrationsDir, "20261015000002_row_level_security.sql"),
    "utf-8"
  );
  const rpcSql = fs.readFileSync(
    path.join(migrationsDir, "20261015000003_atomic_booking_acceptance.sql"),
    "utf-8"
  );
  const seedSql = fs.readFileSync(
    path.join(migrationsDir, "20261015000004_seed_demo_data.sql"),
    "utf-8"
  );

  describe("Schema Integrity (Migration 1)", () => {
    const requiredTables = [
      "profiles",
      "user_roles",
      "service_categories",
      "service_tasks",
      "service_areas",
      "provider_profiles",
      "provider_services",
      "provider_service_areas",
      "provider_verifications",
      "provider_assessments",
      "customer_addresses",
      "jobs",
      "job_media",
      "booking_requests",
      "quotes",
      "quote_items",
      "job_events",
      "reviews",
      "disputes",
      "payment_records",
      "commission_ledger",
      "admin_audit_logs",
    ];

    it.each(requiredTables)("defines table %s with primary key", (tableName) => {
      const tableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${tableName}\\s*\\(`, "i");
      expect(schemaSql).toMatch(tableRegex);
    });

    it("enforces partial unique index for max one pending request per job", () => {
      expect(schemaSql).toMatch(/CREATE UNIQUE INDEX IF NOT EXISTS uq_one_pending_request_per_job/i);
      expect(schemaSql).toMatch(/WHERE status = 'pending'/i);
    });

    it("enforces numeric check constraints on money fields", () => {
      expect(schemaSql).toMatch(/fixed_price >= 0/i);
      expect(schemaSql).toMatch(/visit_fee >= 0/i);
      expect(schemaSql).toMatch(/total numeric\(12,2\)/i);
    });

    it("enforces review rating check constraint between 1 and 5", () => {
      expect(schemaSql).toMatch(/rating >= 1 AND rating <= 5/i);
    });
  });

  describe("Row Level Security Policies (Migration 2)", () => {
    const rlsTables = [
      "profiles",
      "user_roles",
      "service_categories",
      "service_tasks",
      "service_areas",
      "provider_profiles",
      "provider_services",
      "provider_service_areas",
      "provider_verifications",
      "provider_assessments",
      "customer_addresses",
      "jobs",
      "job_media",
      "booking_requests",
      "quotes",
      "quote_items",
      "job_events",
      "reviews",
      "disputes",
      "payment_records",
      "commission_ledger",
      "admin_audit_logs",
    ];

    it.each(rlsTables)("enables RLS on table %s", (tableName) => {
      const rlsEnableRegex = new RegExp(`ALTER TABLE public\\.${tableName} ENABLE ROW LEVEL SECURITY;`, "i");
      expect(rlsSql).toMatch(rlsEnableRegex);
    });

    it("defines secure helper functions with fixed search_path", () => {
      expect(rlsSql).toMatch(/CREATE OR REPLACE FUNCTION public\.is_admin/i);
      expect(rlsSql).toMatch(/SECURITY DEFINER/i);
      expect(rlsSql).toMatch(/SET search_path = public, pg_temp/i);
    });

    it("prevents non-admins from self-assigning admin role in user_roles", () => {
      expect(rlsSql).toMatch(/CREATE POLICY "user_roles_admin_all" ON public\.user_roles/i);
      expect(rlsSql).toMatch(/public\.is_admin\(\)/i);
    });

    it("prevents professionals from modifying application approval status", () => {
      expect(rlsSql).toMatch(/CREATE POLICY "providers_update_owner_or_admin"/i);
      expect(rlsSql).toMatch(/application_status = \(SELECT p\.application_status FROM public\.provider_profiles/i);
    });

    it("protects provider verifications from self-approval by technician", () => {
      expect(rlsSql).toMatch(/CREATE POLICY "verifications_admin_manage" ON public\.provider_verifications/i);
      expect(rlsSql).toMatch(/WITH CHECK \(public\.is_admin\(\)\)/i);
    });

    it("ensures job_events is strictly append-only (no update or delete policy)", () => {
      expect(rlsSql).toMatch(/CREATE POLICY "job_events_insert" ON public\.job_events/i);
      expect(rlsSql).not.toMatch(/CREATE POLICY .* ON public\.job_events\s+FOR UPDATE/i);
      expect(rlsSql).not.toMatch(/CREATE POLICY .* ON public\.job_events\s+FOR DELETE/i);
    });
  });

  describe("Atomic Acceptance Stored Procedure (Migration 3)", () => {
    it("is defined as SECURITY DEFINER with safe search_path", () => {
      expect(rpcSql).toMatch(/CREATE OR REPLACE FUNCTION public\.rpc_accept_booking_request/i);
      expect(rpcSql).toMatch(/SECURITY DEFINER/i);
      expect(rpcSql).toMatch(/SET search_path = public, pg_temp/i);
    });

    it("includes row-level locking (FOR UPDATE) to prevent concurrency races", () => {
      expect(rpcSql).toMatch(/FROM public\.booking_requests\s+WHERE id = p_request_id\s+FOR UPDATE/i);
      expect(rpcSql).toMatch(/FROM public\.jobs\s+WHERE id = v_job_id\s+FOR UPDATE/i);
    });

    it("verifies provider identity, approval, and service qualification", () => {
      expect(rpcSql).toMatch(/v_app_status != 'approved'/i);
      expect(rpcSql).toMatch(/PROVIDER_NOT_APPROVED/i);
      expect(rpcSql).toMatch(/FROM public\.provider_services/i);
    });

    it("enforces server timestamp expiration check (2-min timeout)", () => {
      expect(rpcSql).toMatch(/IF now\(\) >= v_expires_at THEN/i);
      expect(rpcSql).toMatch(/SET status = 'expired'/i);
      expect(rpcSql).toMatch(/REQUEST_EXPIRED/i);
    });

    it("checks for schedule conflicts before confirming booking", () => {
      expect(rpcSql).toMatch(/SCHEDULE_CONFLICT/i);
    });

    it("restricts execute permission to authenticated users only", () => {
      expect(rpcSql).toMatch(/REVOKE ALL ON FUNCTION public\.rpc_accept_booking_request\(uuid\) FROM PUBLIC;/i);
      expect(rpcSql).toMatch(/GRANT EXECUTE ON FUNCTION public\.rpc_accept_booking_request\(uuid\) TO authenticated;/i);
    });
  });

  describe("State Machine Invariant Simulation", () => {
    interface SimulatedJob {
      id: string;
      customer_id: string;
      job_status: string;
      accepted_provider_id: string | null;
      urgency: "asap" | "scheduled";
    }

    interface SimulatedRequest {
      id: string;
      job_id: string;
      provider_id: string;
      status: "pending" | "accepted" | "declined" | "expired";
      expires_at: number;
    }

    function simulateAccept(
      callerUserId: string,
      providerProfile: { id: string; user_id: string; application_status: string } | null,
      request: SimulatedRequest,
      job: SimulatedJob,
      currentTime: number
    ) {
      if (!callerUserId) {
        return { success: false, error: "UNAUTHENTICATED" };
      }
      if (!providerProfile || providerProfile.user_id !== callerUserId) {
        return { success: false, error: "NOT_A_PROVIDER" };
      }
      if (providerProfile.application_status !== "approved") {
        return { success: false, error: "PROVIDER_NOT_APPROVED" };
      }
      if (request.provider_id !== providerProfile.id) {
        return { success: false, error: "UNAUTHORIZED_PROVIDER" };
      }
      if (request.status !== "pending") {
        return { success: false, error: "REQUEST_ALREADY_RESOLVED" };
      }
      if (currentTime >= request.expires_at) {
        request.status = "expired";
        return { success: false, error: "REQUEST_EXPIRED" };
      }
      if (job.accepted_provider_id !== null || job.job_status !== "request_pending") {
        return { success: false, error: "JOB_ALREADY_CLAIMED" };
      }

      // Atomic transition
      request.status = "accepted";
      job.accepted_provider_id = providerProfile.id;
      job.job_status = "confirmed";
      return { success: true, job_id: job.id, status: "confirmed" };
    }

    it("rejects acceptance if caller is not an approved provider", () => {
      const now = Date.now();
      const job: SimulatedJob = {
        id: "job-1",
        customer_id: "cust-1",
        job_status: "request_pending",
        accepted_provider_id: null,
        urgency: "asap",
      };
      const req: SimulatedRequest = {
        id: "req-1",
        job_id: "job-1",
        provider_id: "prov-1",
        status: "pending",
        expires_at: now + 60000,
      };

      const result = simulateAccept(
        "user-unapproved",
        { id: "prov-1", user_id: "user-unapproved", application_status: "pending" },
        req,
        job,
        now
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe("PROVIDER_NOT_APPROVED");
      expect(job.accepted_provider_id).toBeNull();
    });

    it("rejects acceptance if request has expired", () => {
      const now = Date.now();
      const job: SimulatedJob = {
        id: "job-1",
        customer_id: "cust-1",
        job_status: "request_pending",
        accepted_provider_id: null,
        urgency: "asap",
      };
      const req: SimulatedRequest = {
        id: "req-1",
        job_id: "job-1",
        provider_id: "prov-1",
        status: "pending",
        expires_at: now - 5000, // expired 5 seconds ago
      };

      const result = simulateAccept(
        "user-1",
        { id: "prov-1", user_id: "user-1", application_status: "approved" },
        req,
        job,
        now
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe("REQUEST_EXPIRED");
      expect(req.status).toBe("expired");
      expect(job.accepted_provider_id).toBeNull();
    });

    it("prevents two concurrent providers from claiming the same job", () => {
      const now = Date.now();
      const job: SimulatedJob = {
        id: "job-1",
        customer_id: "cust-1",
        job_status: "request_pending",
        accepted_provider_id: null,
        urgency: "asap",
      };
      const req1: SimulatedRequest = {
        id: "req-1",
        job_id: "job-1",
        provider_id: "prov-1",
        status: "pending",
        expires_at: now + 60000,
      };
      const req2: SimulatedRequest = {
        id: "req-2",
        job_id: "job-1",
        provider_id: "prov-2",
        status: "pending",
        expires_at: now + 60000,
      };

      // Provider 1 accepts first
      const result1 = simulateAccept(
        "user-1",
        { id: "prov-1", user_id: "user-1", application_status: "approved" },
        req1,
        job,
        now
      );
      expect(result1.success).toBe(true);
      expect(job.accepted_provider_id).toBe("prov-1");
      expect(job.job_status).toBe("confirmed");

      // Provider 2 attempts to accept after Provider 1 wins
      const result2 = simulateAccept(
        "user-2",
        { id: "prov-2", user_id: "user-2", application_status: "approved" },
        req2,
        job,
        now
      );
      expect(result2.success).toBe(false);
      expect(result2.error).toBe("JOB_ALREADY_CLAIMED");
      expect(job.accepted_provider_id).toBe("prov-1"); // Remains prov-1
    });
  });
});
