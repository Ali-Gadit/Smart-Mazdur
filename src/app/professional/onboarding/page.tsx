"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Shield, Wrench, Briefcase } from "lucide-react";
import { DEMO_CATEGORIES, DEMO_SERVICE_AREAS } from "@/lib/supabase/mock-data";

export default function ProfessionalOnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [experienceYears, setExperienceYears] = useState("5");
  const [selectedTrades, setSelectedTrades] = useState<string[]>([DEMO_CATEGORIES[0].id]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([DEMO_SERVICE_AREAS[0].id]);
  const [bio, setBio] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTrade = (id: string) => {
    setSelectedTrades((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
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
        <h1 className="text-2xl font-bold text-slate-900">Technician Onboarding (Karachi Pilot)</h1>
        <p className="text-xs text-slate-500 mt-1">
          Apply to join our vetted technician network. We offer honest visit fees and direct local jobs.
        </p>
      </div>

      {isSubmitted ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Application Submitted for Review</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you, {fullName}. Our operations team will contact you to schedule:
            1) CNIC identity document review, and
            2) A practical trade skills checklist with our senior technician in Karachi.
          </p>
          <div className="pt-2">
            <Link
              href="/professional/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-800 transition"
            >
              Go to Technician Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Full Name (as per CNIC)</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Tariq Mehmood"
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Phone Number (WhatsApp Active)</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03001234567"
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Years of Practical Experience</label>
            <input
              type="number"
              min="1"
              max="50"
              required
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Trade Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Trades You Offer</label>
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

          {/* Service Area Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Service Coverage in Karachi</label>
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

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Short Bio / Tools & Expertise</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Specialize in water pump repairs, sanitary fittings, and PPRC pipe heat welding..."
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Shield className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              Applying creates a <strong>draft/pending</strong> profile. You will not be visible on the public shortlist until an admin records your identity review and practical skill check.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-teal-700 py-3 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition"
          >
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
}
