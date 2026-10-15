"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Shield, Wrench, AlertCircle, Loader2 } from "lucide-react";
import { DEMO_CATEGORIES, DEMO_SERVICE_AREAS } from "@/lib/supabase/mock-data";
import { submitProviderApplicationAction } from "@/features/professionals/actions";

export default function ProfessionalOnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cnicNumber, setCnicNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState("5");
  const [selectedTrades, setSelectedTrades] = useState<string[]>([DEMO_CATEGORIES[0].id]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([DEMO_SERVICE_AREAS[0].id]);
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{ message: string; isDemo?: boolean } | null>(null);

  const toggleTrade = (id: string) => {
    setSelectedTrades((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((t) => t !== id) : prev) : [...prev, id]
    );
  };

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((a) => a !== id) : prev) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitProviderApplicationAction({
      publicName: fullName,
      phone,
      experienceYears: parseInt(experienceYears, 10) || 0,
      bio,
      tradeCategoryIds: selectedTrades,
      serviceAreaIds: selectedAreas,
      cnicNumber,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmittedData({ message: result.message, isDemo: result.isDemo });
    } else {
      setSubmitError(result.message || "Failed to submit application. Please check your inputs.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-2xl space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Technician Registration & Onboarding</h1>
        <p className="text-xs text-slate-500 mt-1">
          Apply to join the Smart Mazdur pilot cohort in Karachi. We connect vetted professionals with fair visit charges.
        </p>
      </div>

      {submittedData ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Application Successfully Queued</h2>
          <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
            {submittedData.message}
          </p>

          <div className="rounded-xl border border-teal-200 bg-white p-4 text-left max-w-md mx-auto text-xs space-y-2">
            <h3 className="font-bold text-teal-950">Next Required Steps for Activation:</h3>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600">
              <li>
                <strong>CNIC Identity Review:</strong> Staff will inspect your identity card against your profile.
              </li>
              <li>
                <strong>Practical Trade Assessment:</strong> An observed skill checklist with a senior master technician.
              </li>
              <li>
                <strong>Activation:</strong> Once approved, your profile appears on the customer shortlist.
              </li>
            </ol>
          </div>

          <div className="pt-2">
            <Link
              href="/professional/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-800 transition shadow-sm"
            >
              Go to Technician Portal
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {submitError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Section 1: Identity & Contact */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700">
              1. Identity & Contact Details
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800">Full Name (as per CNIC)</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800">Phone (WhatsApp Active)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800">CNIC Number</label>
                <input
                  type="text"
                  required
                  value={cnicNumber}
                  onChange={(e) => setCnicNumber(e.target.value)}
                  placeholder="42101-1234567-1"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <span className="text-[10px] text-slate-400">Kept private; never shown on public profile</span>
              </div>
            </div>
          </div>

          {/* Section 2: Trades & Experience */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700">
              2. Trades & Practical Experience
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800">Years of Experience</label>
              <input
                type="number"
                min="0"
                max="60"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800">Select Trades Offered</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_CATEGORIES.map((cat) => {
                  const checked = selectedTrades.includes(cat.id);
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => toggleTrade(cat.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition ${
                        checked
                          ? "border-teal-600 bg-teal-50 text-teal-900"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800">Professional Bio / Tool Kit</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your specializations, tools owned (e.g. PPRC welding machine, vacuum pump, multimeter)..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Section 3: Service Areas */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700">
              3. Karachi Service Areas Covered
            </h2>
            <div className="space-y-2">
              {DEMO_SERVICE_AREAS.map((area) => {
                const checked = selectedAreas.includes(area.id);
                return (
                  <button
                    type="button"
                    key={area.id}
                    onClick={() => toggleArea(area.id)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-medium text-left transition flex items-center justify-between ${
                      checked
                        ? "border-teal-600 bg-teal-50 text-teal-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span>{area.name}</span>
                    {checked && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Honest Disclosure Banner */}
          <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Shield className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Honest Vetting Standard</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Submitting this form creates a <strong>pending</strong> application. To maintain homeowner safety, you will not receive jobs until an administrator manually verifies your CNIC and records a passed trade assessment.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <span>Submit Application for Review</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
