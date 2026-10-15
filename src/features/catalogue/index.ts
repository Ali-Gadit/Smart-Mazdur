import { ServiceCategory, ServiceTask } from "@/types";
import { DEMO_CATEGORIES, DEMO_TASKS } from "@/lib/supabase/mock-data";

export interface CatalogueResponse<T> {
  data: T;
  isDemoFallback: boolean;
  error?: string;
}

/**
 * Fetch all active service categories.
 * Queries Supabase when configured, otherwise falls back gracefully to local demo data.
 */
export async function getActiveCategories(): Promise<CatalogueResponse<ServiceCategory[]>> {
  try {
    // If Supabase environment variables are not real, return demo data
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      return {
        data: DEMO_CATEGORIES.filter((c) => c.is_active),
        isDemoFallback: true,
      };
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return {
        data: DEMO_CATEGORIES.filter((c) => c.is_active),
        isDemoFallback: true,
        error: error?.message,
      };
    }

    return {
      data: data as ServiceCategory[],
      isDemoFallback: false,
    };
  } catch (err: any) {
    return {
      data: DEMO_CATEGORIES.filter((c) => c.is_active),
      isDemoFallback: true,
      error: err.message,
    };
  }
}

/**
 * Fetch a category and its tasks by slug.
 */
export async function getCategoryWithTasksBySlug(
  slug: string
): Promise<CatalogueResponse<{ category: ServiceCategory; tasks: ServiceTask[] } | null>> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      const category = DEMO_CATEGORIES.find((c) => c.slug === slug && c.is_active);
      if (!category) {
        return { data: null, isDemoFallback: true };
      }
      const tasks = DEMO_TASKS.filter((t) => t.category_id === category.id && t.is_active);
      return {
        data: { category, tasks },
        isDemoFallback: true,
      };
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: category, error: catError } = await supabase
      .from("service_categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (catError || !category) {
      // Check demo fallback
      const demoCat = DEMO_CATEGORIES.find((c) => c.slug === slug);
      if (demoCat) {
        const demoTasks = DEMO_TASKS.filter((t) => t.category_id === demoCat.id);
        return { data: { category: demoCat, tasks: demoTasks }, isDemoFallback: true };
      }
      return { data: null, isDemoFallback: false, error: catError?.message };
    }

    const { data: tasks, error: tasksError } = await supabase
      .from("service_tasks")
      .select("*")
      .eq("category_id", category.id)
      .eq("is_active", true);

    return {
      data: {
        category: category as ServiceCategory,
        tasks: (tasks || []) as ServiceTask[],
      },
      isDemoFallback: false,
      error: tasksError?.message,
    };
  } catch (err: any) {
    const demoCat = DEMO_CATEGORIES.find((c) => c.slug === slug);
    if (demoCat) {
      const demoTasks = DEMO_TASKS.filter((t) => t.category_id === demoCat.id);
      return { data: { category: demoCat, tasks: demoTasks }, isDemoFallback: true, error: err.message };
    }
    return { data: null, isDemoFallback: true, error: err.message };
  }
}
