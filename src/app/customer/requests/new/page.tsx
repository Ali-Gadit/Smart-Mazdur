"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEMO_CATEGORIES, DEMO_TASKS, DEMO_SERVICE_AREAS } from "@/lib/supabase/mock-data";
import { ArrowLeft, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export default function NewRequestPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(DEMO_CATEGORIES[0].id);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [urgency, setUrgency] = useState<"asap" | "scheduled">("asap");
  const [scheduledFor, setScheduledFor] = useState("");
  const [selectedArea, setSelectedArea] = useState(DEMO_SERVICE_AREAS[0].id);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTasks = DEMO_TASKS.filter((t) => t.category_id === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In local demo flow, navigate to shortlist view
    setTimeout(() => {
      // Direct to shortlist for this service
      router.push(`/customer/requests/demo-job-1/professionals?category=${selectedCategory}&area=${selectedArea}`);
    }, 600);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-2xl space-y-6">
      <Link
        href="/customer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Request a Repair Professional</h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide job details to view an eligible shortlist of vetted technicians in Karachi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">1. Service Category</label>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedTask("");
                }}
                className={`p-3 text-left rounded-xl border text-xs font-semibold transition ${
                  selectedCategory === cat.id
                    ? "border-teal-600 bg-teal-50 text-teal-900"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Task Selection (Optional) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">2. Specific Task (Optional)</label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">General Diagnosis & Inspection (Technician will quote on-site)</option>
            {availableTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.pricing_mode === "fixed" ? `Fixed: Rs. ${t.fixed_price}` : `Visit: Rs. ${t.visit_fee}`})
              </option>
            ))}
          </select>
        </div>

        {/* Urgency */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">3. Urgency</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUrgency("asap")}
              className={`p-3 text-left rounded-xl border text-xs font-semibold transition ${
                urgency === "asap"
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className="block font-bold">As Soon As Possible</span>
              <span className="text-[11px] font-normal text-slate-500">Fastest available arrival</span>
            </button>
            <button
              type="button"
              onClick={() => setUrgency("scheduled")}
              className={`p-3 text-left rounded-xl border text-xs font-semibold transition ${
                urgency === "scheduled"
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className="block font-bold">Schedule for Later</span>
              <span className="text-[11px] font-normal text-slate-500">Pick preferred day/time</span>
            </button>
          </div>
        </div>

        {urgency === "scheduled" && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              required={urgency === "scheduled"}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        )}

        {/* Service Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">4. Karachi Service Neighbourhood</label>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal-700 shrink-0" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {DEMO_SERVICE_AREAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Street Address */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">5. Street Address / Flat Details</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            required
            placeholder="House/Apartment #, Street name, Landmark..."
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
            Exact address is masked and only revealed to the single technician who accepts your request.
          </p>
        </div>

        {/* Problem Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">6. Describe the Problem</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            minLength={10}
            placeholder="Describe what is broken, leaking, or making noise..."
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition disabled:opacity-50"
        >
          <span>{isSubmitting ? "Finding Eligible Professionals..." : "Find Eligible Professionals"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
