"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_CANDIDATES } from "@/lib/supabase/mock-data";
import { formatPKR } from "@/lib/money";
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  ArrowLeft,
  UserCheck,
  AlertCircle,
  MapPin,
  Briefcase,
} from "lucide-react";

export default function ShortlistPage() {
  const [candidates, setCandidates] = useState(DEMO_CANDIDATES);
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "fee">("recommended");
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortBy === "rating") {
      return (b.rating_average || 0) - (a.rating_average || 0);
    }
    if (sortBy === "fee") {
      return a.indicative_visit_fee - b.indicative_visit_fee;
    }
    return b.match_score - a.match_score;
  });

  const handleRequestBooking = (candidateId: string) => {
    setRequestedId(candidateId);
    setCountdown(120); // 2 minute countdown
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-4xl space-y-6">
      <Link
        href="/customer/requests/new"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Edit Request Details
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compare Eligible Technicians</h1>
          <p className="text-xs text-slate-500 mt-1">
            Independently assessed professionals available in your selected Karachi neighbourhood.
          </p>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="recommended">Recommended Match</option>
            <option value="rating">Highest Rated</option>
            <option value="fee">Lowest Visit Fee</option>
          </select>
        </div>
      </div>

      {requestedId && (
        <div className="rounded-xl bg-teal-900 text-white p-6 shadow-md space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-800 px-3 py-1 rounded-full text-teal-200">
              <Clock className="h-3.5 w-3.5" />
              Request Pending: Technician has 2:00 to respond
            </span>
            <span className="text-xs text-teal-300 font-mono">Expires in ~{countdown}s</span>
          </div>
          <h3 className="text-base font-bold">Request dispatched to selected professional</h3>
          <p className="text-xs text-teal-100 leading-relaxed">
            We notified the technician. If they do not accept within 2 minutes or decline, you can immediately choose another professional from this shortlist without re-entering your job info.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setRequestedId(null);
                setCountdown(null);
              }}
              className="text-xs font-semibold underline text-teal-300 hover:text-white"
            >
              Cancel request and choose someone else
            </button>
          </div>
        </div>
      )}

      {/* Candidate List */}
      <div className="space-y-4">
        {sortedCandidates.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-800">No technicians currently available in this zone</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try scheduling for a later time or broadening your selected neighbourhood.
            </p>
          </div>
        ) : (
          sortedCandidates.map((c) => (
            <div
              key={c.provider_id}
              className={`rounded-2xl border bg-white p-6 shadow-sm transition ${
                requestedId === c.provider_id
                  ? "border-teal-600 ring-2 ring-teal-600/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{c.public_name}</h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                      Available Now
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{c.bio}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {c.base_area_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      {c.experience_years} years exp.
                    </span>
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {c.rating_average} ({c.rating_count} verified reviews)
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{c.completed_jobs_count} completed jobs</span>
                  </div>

                  {/* Verification Badges (Distinct & Honest) */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {c.identity_reviewed && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        <CheckCircle2 className="h-3 w-3 text-teal-600" />
                        CNIC Identity Reviewed
                      </span>
                    )}
                    {c.skills_assessed && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                        <ShieldCheck className="h-3 w-3 text-teal-700" />
                        Trade Practical Assessment Passed
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing & Request Button */}
                <div className="sm:text-right shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Upfront Visit Fee</span>
                    <span className="text-lg font-black text-slate-900">
                      {formatPKR(c.indicative_visit_fee)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRequestBooking(c.provider_id)}
                    disabled={requestedId !== null}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-800 transition disabled:opacity-50"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>{requestedId === c.provider_id ? "Requested" : "Request This Pro"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
