import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryWithTasksBySlug } from "@/features/catalogue";
import { formatPKR } from "@/lib/money";
import { ArrowLeft, ArrowRight, ShieldCheck, Info } from "lucide-react";

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const result = await getCategoryWithTasksBySlug(slug);

  if (!result || !result.data) {
    notFound();
  }

  const { category, tasks } = result.data;

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
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            {category.name} in Karachi
          </h1>
          {result.isDemoFallback && (
            <span className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
              Demo Catalogue
            </span>
          )}
        </div>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
          {category.description}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Standard Tasks & Work Scope</h2>
          <span className="text-xs text-slate-500">{tasks.length} task(s) configured</span>
        </div>

        {tasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No specific tasks listed under this trade yet. Contact operations or request general diagnosis.
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm">{task.name}</span>
                  <span className="text-xs font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded self-start sm:self-auto">
                    {task.pricing_mode === "fixed"
                      ? `${formatPKR(task.fixed_price)} (Fixed Price)`
                      : `Visit Fee: ${formatPKR(task.visit_fee)} + Itemized Quote`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/50">
                  <div className="text-teal-900">
                    <strong className="block text-[11px] uppercase tracking-wider text-teal-800 mb-0.5">
                      Inclusions
                    </strong>
                    {task.scope_inclusions}
                  </div>
                  <div className="text-amber-900">
                    <strong className="block text-[11px] uppercase tracking-wider text-amber-800 mb-0.5">
                      Exclusions
                    </strong>
                    {task.scope_exclusions}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Safety Box */}
      <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-5 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 leading-relaxed space-y-1">
          <p className="font-bold">Transparent Pricing Protection</p>
          <p>
            Technicians are not allowed to begin additional repair work without submitting an itemized quote that you explicitly approve. You only pay the agreed visit fee if you decline the repair quotation.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-teal-900 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Need {category.name} help in Karachi?</h3>
          <p className="text-xs text-teal-100 mt-1">
            Choose from vetted technicians serving your neighbourhood.
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
