import { Shield, CheckCircle, AlertTriangle, FileText, Wrench } from "lucide-react";

export default function SafetyAndVerificationPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 max-w-4xl">
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
          <Shield className="h-4 w-4" />
          Transparency & Safety Standards
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          What Our Verification Checks Mean (and What They Don&apos;t)
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          In our Karachi pilot, trust is built on honesty, not marketing claims. We explicitly document our vetting procedures so customers and technicians know exactly what is verified.
        </p>
      </div>

      <div className="space-y-8">
        {/* Identity Review Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Identity Review</h2>
              <span className="text-xs font-medium text-teal-700">Conducted manually by platform operations staff</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs leading-relaxed">
            <div className="space-y-2">
              <span className="font-semibold text-teal-900 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-teal-600" />
                What is verified:
              </span>
              <p className="text-slate-600">
                A physical or scanned Pakistani National Identity Card (CNIC) was inspected by staff to match the person&apos;s face and provided contact details.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                What it does NOT prove:
              </span>
              <p className="text-slate-600">
                It does not constitute an official government background clearance, a biometric police certificate, or a real-time automated NADRA database integration.
              </p>
            </div>
          </div>
        </div>

        {/* Trade Skills Assessment Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">2. Practical Trade Skills Assessment</h2>
              <span className="text-xs font-medium text-blue-700">Administered per specific trade</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs leading-relaxed">
            <div className="space-y-2">
              <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                What is verified:
              </span>
              <p className="text-slate-600">
                The technician completed a practical checklist (e.g. electrical multimeter safety, pipe soldering/PPRC testing, or AC refrigerant pressure diagnosis) observed by a senior master technician.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                What it does NOT prove:
              </span>
              <p className="text-slate-600">
                It does not guarantee perfection on every job. Technicians are independent tradespeople. We provide quotation approval gates and dispute mediation if an issue occurs.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing & Customer Safeguards */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
          <h2 className="text-base font-bold text-amber-950 mb-2">Customer Pricing Protections</h2>
          <ul className="space-y-2 text-xs text-amber-900">
            <li>• <strong>No hidden visit charges:</strong> The technician&apos;s visit and diagnostic fee is explicitly shown before you confirm the booking request.</li>
            <li>• <strong>No work without quote approval:</strong> If new materials or substantial repair labour are needed, the technician must enter an itemized quotation which you must tap to approve.</li>
            <li>• <strong>Direct off-platform cash records:</strong> Payments during the pilot are paid directly in cash to the professional and recorded in the app for dual-confirmation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
