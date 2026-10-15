import { notFound } from "next/navigation";
import Link from "next/link";
import { DEMO_CATEGORIES, DEMO_TASKS } from "@/lib/supabase/mock-data";
import { formatPKR } from "@/lib/money";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const category = DEMO_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const tasks = DEMO_TASKS.filter((t) => t.category_id === category.id);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 max-w-4xl space-y-8">
      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Services
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          {category.name} in Karachi
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
          {category.description}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Standard Tasks & Work Scope</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-900 text-sm">{task.name}</span>
                <span className="text-xs font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded self-start sm:self-auto">
                  {task.pricing_mode === "fixed"
                    ? `${formatPKR(task.fixed_price)} (Fixed Price)`
                    : `Visit Fee: ${formatPKR(task.visit_fee)} + Itemized Quote`}
                </span>
              </div>
              <p className="text-xs text-slate-600">{task.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                <div className="text-teal-900">
                  <strong>Inclusions:</strong> {task.scope_inclusions}
                </div>
                <div className="text-amber-900">
                  <strong>Exclusions:</strong> {task.scope_exclusions}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-teal-900 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Need {category.name} help today?</h3>
          <p className="text-xs text-teal-100 mt-1">
            Choose from vetted technicians serving your neighbourhood in Karachi.
          </p>
        </div>
        <Link
          href={`/customer/requests/new?category=${category.slug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-teal-900 hover:bg-teal-50 transition shrink-0"
        >
          Book Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
