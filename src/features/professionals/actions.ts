"use server";

import { providerApplicationSchema, ProviderApplicationInput } from "@/lib/validation";
import { ProviderProfile, ProviderVerification } from "@/types";
import { DEMO_CANDIDATES } from "@/lib/supabase/mock-data";

export interface ApplicationSubmissionResult {
  success: boolean;
  providerId?: string;
  message: string;
  error?: string;
  isDemo?: boolean;
}

/**
 * Server action to submit a professional registration application.
 * Validates inputs server-side with Zod and records initial pending verification checks.
 */
export async function submitProviderApplicationAction(
  rawInput: ProviderApplicationInput
): Promise<ApplicationSubmissionResult> {
  const parseResult = providerApplicationSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(", ");
    return {
      success: false,
      error: "VALIDATION_FAILED",
      message: errorMsg,
    };
  }

  const input = parseResult.data;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      // In local development / demo mode, record application without live DB credentials
      return {
        success: true,
        providerId: "demo-provider-pending-1",
        message: "Application submitted successfully (Local Demo Mode). Status: Pending Admin Vetting.",
        isDemo: true,
      };
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "UNAUTHENTICATED",
        message: "You must be signed in to submit a professional application.",
      };
    }

    // Insert or update provider_profiles
    const { data: profile, error: profileError } = await supabase
      .from("provider_profiles")
      .upsert(
        {
          user_id: user.id,
          public_name: input.publicName,
          bio: input.bio || "",
          experience_years: input.experienceYears,
          application_status: "pending",
          availability_status: "offline",
          base_area_id: input.serviceAreaIds[0] || null,
        },
        { onConflict: "user_id" }
      )
      .select("id")
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        error: "DATABASE_ERROR",
        message: profileError?.message || "Failed to create professional profile.",
      };
    }

    const providerId = profile.id;

    // Insert provider_services
    for (const catId of input.tradeCategoryIds) {
      await supabase.from("provider_services").upsert(
        {
          provider_id: providerId,
          category_id: catId,
          is_active: true,
        },
        { onConflict: "provider_id,category_id,task_id" }
      );
    }

    // Insert provider_service_areas
    for (const areaId of input.serviceAreaIds) {
      await supabase.from("provider_service_areas").upsert(
        {
          provider_id: providerId,
          service_area_id: areaId,
        },
        { onConflict: "provider_id,service_area_id" }
      );
    }

    // Mask CNIC for storage (keep only last 4 digits visible)
    const maskedCnic = input.cnicNumber.replace(/\d(?=\d{4})/g, "*");

    // Insert Identity Review verification entry
    await supabase.from("provider_verifications").upsert(
      {
        provider_id: providerId,
        verification_type: "identity_review",
        status: "pending",
        method_description: `CNIC provided: ${maskedCnic}. Pending manual inspection by platform staff.`,
      },
      { onConflict: "provider_id,verification_type,category_id" }
    );

    // Insert Skill Assessment verification entries for each trade
    for (const catId of input.tradeCategoryIds) {
      await supabase.from("provider_verifications").upsert(
        {
          provider_id: providerId,
          verification_type: "skill_assessment",
          category_id: catId,
          status: "not_started",
          method_description: "Practical skills assessment checklist pending observation by master technician.",
        },
        { onConflict: "provider_id,verification_type,category_id" }
      );
    }

    return {
      success: true,
      providerId,
      message: "Application submitted. Your identity and trade skills are queued for manual verification.",
      isDemo: false,
    };
  } catch (err: any) {
    return {
      success: false,
      error: "SERVER_ERROR",
      message: err.message || "An unexpected error occurred during submission.",
    };
  }
}
