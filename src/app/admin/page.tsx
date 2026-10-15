"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { DEMO_CANDIDATES } from "@/lib/supabase/mock-data";

export default function AdminDashboardPage() {
  const [providers, setProviders] = useState(DEMO_CANDIDATES);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-5xl space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Admin & Operations Console</h1>
            <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Privileged Staff Access
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manual provider verification recording, service catalogue control, and dispute mediation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold">
            Pilot Area: Karachi Zone 1
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <span className="text-xs font-medium text-slate-500">Active Technicians</span>
          <p className="text-2xl font-bold text-slate-900">3</p>
          <p className="text-[11px] text-teal-700">Fully vetted & available</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <span className="text-xs font-medium text-slate-500">Pending Identity Checks</span>
          <p className="text-2xl font-bold text-amber-700">1</p>
          <p className="text-[11px] text-slate-400">Manual CNIC review required</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <span className="text-xs font-medium text-slate-500">Pending Skill Tests</span>
          <p className="text-2xl font-bold text-blue-700">1</p>
          <p className="text-[11px] text-slate-400">Assessor checklist scheduled</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <span className="text-xs font-medium text-slate-500">Open Disputes</span>
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-[11px] text-green-700">No unresolved complaints</p>
        </div>
      </div>

      {/* Technician Vetting Queue */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Technician Verification Records</h2>
            <p className="text-xs text-slate-500">
              Each check is evaluated and logged independently. Do not approve without actual observed evidence.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {providers.map((p) => (
            <div key={p.provider_id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{p.public_name}</h3>
                  <span className="text-xs text-slate-500">• {p.base_area_name}</span>
                </div>
                <p className="text-xs text-slate-600 max-w-lg">{p.bio}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="inline-flex items-center gap-1 font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    <CheckCircle2 className="h-3 w-3" />
                    CNIC Reviewed: Manual Staff Check
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    <ShieldCheck className="h-3 w-3" />
                    Practical Skill Assessment: Verified by Master Tech
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                  Approved & Active
                </span>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition">
                  Audit History
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Policy Disclosures */}
      <div className="rounded-xl bg-slate-900 text-white p-6 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-400" />
          Marketplace Operational Invariants
        </h3>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
          <li>Never fabricate ratings, reviews, or completion counts.</li>
          <li>Never mark a provider as NADRA-verified without an authorized, legally established API integration.</li>
          <li>All quote revisions must preserve historical versions for dispute mediation.</li>
          <li>Cash payments must record declarations from both parties; disputes are escalated to operations.</li>
        </ul>
      </div>
    </div>
  );
}
