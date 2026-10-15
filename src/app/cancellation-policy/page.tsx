import { AlertCircle, Clock, ShieldCheck } from "lucide-react";

export default function CancellationPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 max-w-3xl space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
          <Clock className="h-3.5 w-3.5" />
          Pilot Operating Policy
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Visit Charges & Cancellation Policy
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Note: This policy applies during the closed Karachi pilot and is subject to formal legal review before public commercial launch.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Pre-Acceptance Cancellation</h2>
          <p className="text-xs text-slate-600">
            Customers may cancel a job request at any time prior to a professional accepting the request with <strong>zero penalty or fee</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Request Expiry</h2>
          <p className="text-xs text-slate-600">
            If a requested professional does not accept within 2 minutes, the request automatically expires. The customer is returned to the verified shortlist to select another technician without re-entering job details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Post-Acceptance & En Route</h2>
          <p className="text-xs text-slate-600">
            Once a professional has accepted and is travelling to the premises, customers who need to cancel are requested to notify the professional promptly through the in-app status or customer hotline. Avoidable repeated cancellations will be reviewed by support.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Diagnostic / Visit Fee</h2>
          <p className="text-xs text-slate-600">
            The visit fee shown on the technician&apos;s shortlist profile covers travel and initial physical problem diagnosis. If the customer chooses not to proceed with the quoted repair work, the technician is entitled to the agreed visit fee for their time and inspection.
          </p>
        </section>

        <div className="rounded-lg bg-teal-50 border border-teal-200 p-4 flex gap-3 text-xs text-teal-900">
          <ShieldCheck className="h-5 w-5 text-teal-700 shrink-0" />
          <div>
            <p className="font-semibold">Questions or Discrepancies?</p>
            <p className="mt-1 text-teal-800">
              If a technician does not arrive or demands charges outside the agreed quotation, contact pilot support immediately or submit an in-app dispute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
