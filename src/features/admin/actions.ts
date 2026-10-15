"use server";

import {
  adminVerificationDecisionSchema,
  AdminVerificationDecisionInput,
  adminApplicationDecisionSchema,
  AdminApplicationDecisionInput,
} from "@/lib/validation";

export interface AdminActionResult {
  success: boolean;
  message: string;
  error?: string;
  isDemo?: boolean;
}

/**
 * Record a manual verification check (Identity Review or Trade Skills Assessment)
 * Strictly restricted to authorized administrators.
 */
export async function recordProviderVerificationAction(
  rawInput: AdminVerificationDecisionInput
): Promise<AdminActionResult> {
  const parseResult = adminVerificationDecisionSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: "VALIDATION_FAILED", message: errorMsg };
  }

  const input = parseResult.data;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      return {
        success: true,
        message: `[DEMO MODE] Verification check (${input.verificationType}) recorded as '${input.status}'.`,
        isDemo: true,
      };
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "UNAUTHENTICATED", message: "Admin sign-in required." };
    }

    // Verify user has admin role via RPC or user_roles query
    const { data: isAdmin } = await supabase.rpc("is_admin", { p_user_id: user.id });
    if (!isAdmin) {
      return { success: false, error: "FORBIDDEN", message: "Privileged admin permission required." };
    }

    // Update or insert provider_verifications
    const { error: verifError } = await supabase
      .from("provider_verifications")
      .upsert(
        {
          provider_id: input.providerId,
          verification_type: input.verificationType,
          category_id: input.categoryId || null,
          status: input.status,
          method_description: input.methodDescription,
          result_summary: input.resultSummary,
          private_notes: input.privateNotes || null,
          rejection_reason: input.rejectionReason || null,
          reviewer_id: user.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "provider_id,verification_type,category_id" }
      );

    if (verifError) {
      return { success: false, error: "DATABASE_ERROR", message: verifError.message };
    }

    // Append to admin_audit_logs
    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "record_verification",
      target_table: "provider_verifications",
      target_id: input.providerId,
      details: {
        verification_type: input.verificationType,
        status: input.status,
        result_summary: input.resultSummary,
      },
    });

    return {
      success: true,
      message: `Verification check (${input.verificationType}) recorded successfully.`,
      isDemo: false,
    };
  } catch (err: any) {
    return { success: false, error: "SERVER_ERROR", message: err.message };
  }
}

/**
 * Review provider application and set application_status (approved, rejected, paused, suspended)
 */
export async function reviewProviderApplicationAction(
  rawInput: AdminApplicationDecisionInput
): Promise<AdminActionResult> {
  const parseResult = adminApplicationDecisionSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: "VALIDATION_FAILED", message: errorMsg };
  }

  const input = parseResult.data;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      return {
        success: true,
        message: `[DEMO MODE] Provider application marked as '${input.decision}'.`,
        isDemo: true,
      };
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "UNAUTHENTICATED", message: "Admin sign-in required." };
    }

    const { data: isAdmin } = await supabase.rpc("is_admin", { p_user_id: user.id });
    if (!isAdmin) {
      return { success: false, error: "FORBIDDEN", message: "Privileged admin permission required." };
    }

    const isApproval = input.decision === "approved";

    const { error: updateError } = await supabase
      .from("provider_profiles")
      .update({
        application_status: input.decision,
        approved_at: isApproval ? new Date().toISOString() : null,
        approved_by: isApproval ? user.id : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.providerId);

    if (updateError) {
      return { success: false, error: "DATABASE_ERROR", message: updateError.message };
    }

    // Append to admin_audit_logs
    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: `application_${input.decision}`,
      target_table: "provider_profiles",
      target_id: input.providerId,
      details: {
        decision: input.decision,
        reason: input.reason,
      },
    });

    return {
      success: true,
      message: `Provider application status updated to '${input.decision}'.`,
      isDemo: false,
    };
  } catch (err: any) {
    return { success: false, error: "SERVER_ERROR", message: err.message };
  }
}
