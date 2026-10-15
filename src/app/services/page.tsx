import Link from "next/link";
import { DEMO_CATEGORIES, DEMO_TASKS } from "@/lib/supabase/mock-data";
import { formatPKR } from "@/lib/money";
import { Wrench, Zap, Wind, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export default function ServicesPage() {
  const iconMap: Record<string, React.ElementType> = {
    Wrench,
    Zap,
    Wind,
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 max-w-5xl">
      <div className="space-y-4 mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Verified Service Catalogue
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Standardized visit fees and task scopes for our launch pilot in Karachi. Upfront pricing before technicians are requested.
        </p>
      </div>

      <div className="space-y-12">
        {DEMO_CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon_key] || Wrench;
          const tasks = DEMO_TASKS.filter((t) => t.category_id === cat.id);

          return (
            <div key={cat.id} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{cat.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                  </div>
                </div>

                <Link
                  href={`/customer/requests/new?category=${cat.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-800 transition"
                >
                  <span>Request in {cat.name}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Tasks under category */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Standard Defined Tasks & Inspection Rules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm">{task.name}</h4>
                        <span className="shrink-0 text-xs font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                          {task.pricing_mode === "fixed"
                            ? `${formatPKR(task.fixed_price)} (Fixed)`
                            : `${formatPKR(task.visit_fee)} (Visit & Quote)`}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                      <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1">
                        <div className="text-slate-700 font-medium">
                          <span className="text-teal-700 font-bold">Includes:</span> {task.scope_inclusions}
                        </div>
                        <div className="text-slate-500">
                          <span className="text-amber-800 font-bold">Excludes:</span> {task.scope_exclusions}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
