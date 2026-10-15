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
  Search,
  Filter,
  Check,
  X,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { DEMO_CANDIDATES } from "@/lib/supabase/mock-data";
import {
  recordProviderVerificationAction,
  reviewProviderApplicationAction,
} from "@/features/admin/actions";

export default function AdminDashboardPage() {
  const [providers, setProviders] = useState(DEMO_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all");
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Manual verification modal state
  const [verifType, setVerifType] = useState<"identity_review" | "skill_assessment">("identity_review");
  const [verifStatus, setVerifStatus] = useState<"approved" | "rejected" | "needs_more_information">("approved");
  const [verifMethod, setVerifMethod] = useState("Physical inspection of original CNIC");
  const [verifSummary, setVerifSummary] = useState("CNIC matches name and photograph; issued in Karachi");
  const [verifNotes, setVerifNotes] = useState("");

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.public_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.base_area_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleRecordVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    setIsProcessing(true);
    setActionNotice(null);

    const result = await recordProviderVerificationAction({
      providerId: selectedProvider.provider_id,
      verificationType: verifType,
      status: verifStatus,
      methodDescription: verifMethod,
      resultSummary: verifSummary,
      privateNotes: verifNotes,
    });

    setIsProcessing(false);
    setActionNotice(result.message);

    // Update in-memory state
    setProviders((prev) =>
      prev.map((item) => {
        if (item.provider_id === selectedProvider.provider_id) {
          return {
            ...item,
            identity_reviewed: verifType === "identity_review" ? verifStatus === "approved" : item.identity_reviewed,
            skills_assessed: verifType === "skill_assessment" ? verifStatus === "approved" : item.skills_assessed,
          };
        }
        return item;
      })
    );

    setSelectedProvider(null);
  };

  const handleApplicationDecision = async (providerId: string, decision: "approved" | "rejected") => {
    setIsProcessing(true);
    setActionNotice(null);

    const result = await reviewProviderApplicationAction({
      providerId,
      decision,
      reason: `Admin decision recorded on ${new Date().toLocaleDateString()}`,
    });

    setIsProcessing(false);
    setActionNotice(result.message);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-5xl space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Admin Operations & Vetting Console</h1>
            <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Privileged Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manual verification auditing, skills assessment checklists, and catalogue pricing controls.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-semibold">
            Pilot Zone: Karachi Central
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-teal-600 hover:text-teal-900 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <span className="text-xs font-medium text-slate-500">Active Technicians</span>
          <p className="text-2xl font-bold text-slate-900">{providers.length}</p>
          <p className="text-[11px] text-teal-700">Approved for marketplace</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <span className="text-xs font-medium text-slate-500">Pending Identity Checks</span>
          <p className="text-2xl font-bold text-amber-700">1</p>
          <p className="text-[11px] text-slate-400">Manual CNIC review required</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <span className="text-xs font-medium text-slate-500">Pending Skill Tests</span>
          <p className="text-2xl font-bold text-blue-700">1</p>
          <p className="text-[11px] text-slate-400">Master checklist pending</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <span className="text-xs font-medium text-slate-500">Open Disputes</span>
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-[11px] text-green-700">Healthy marketplace state</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technician by name or locality..."
            className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs rounded-lg border border-slate-200 p-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="all">All Applications</option>
            <option value="approved">Approved & Active</option>
            <option value="pending">Pending Vetting</option>
          </select>
        </div>
      </div>

      {/* Technician Vetting Queue */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Provider Onboarding & Vetting Queue</h2>
            <p className="text-xs text-slate-500">
              Record separate manual checks for Identity and Practical Trade Skills. Never merge into a vague boolean.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredProviders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No technicians matched your search query.
            </div>
          ) : (
            filteredProviders.map((p) => (
              <div key={p.provider_id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{p.public_name}</h3>
                    <span className="text-xs text-slate-500">• {p.base_area_name}</span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      ({p.experience_years} yrs exp)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{p.bio}</p>

                  {/* Distinct Checks */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded border ${
                        p.identity_reviewed
                          ? "text-teal-800 bg-teal-50 border-teal-200"
                          : "text-amber-800 bg-amber-50 border-amber-200"
                      }`}
                    >
                      {p.identity_reviewed ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      CNIC Identity: {p.identity_reviewed ? "Approved" : "Pending Check"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded border ${
                        p.skills_assessed
                          ? "text-blue-800 bg-blue-50 border-blue-200"
                          : "text-amber-800 bg-amber-50 border-amber-200"
                      }`}
                    >
                      {p.skills_assessed ? <ShieldCheck className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      Trade Assessment: {p.skills_assessed ? "Passed" : "Pending Checklist"}
                    </span>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => {
                      setSelectedProvider(p);
                      setVerifType("identity_review");
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition"
                  >
                    Log Verification
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleApplicationDecision(p.provider_id, "approved")}
                      disabled={isProcessing}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition"
                      title="Approve Provider"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApplicationDecision(p.provider_id, "rejected")}
                      disabled={isProcessing}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                      title="Reject Provider"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual Verification Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Verification Check</h3>
                <p className="text-xs text-slate-500">Applicant: {selectedProvider.public_name}</p>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordVerification} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Check Type</label>
                <select
                  value={verifType}
                  onChange={(e) => setVerifType(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800"
                >
                  <option value="identity_review">Identity Review (CNIC Manual Check)</option>
                  <option value="skill_assessment">Trade Skills Practical Assessment</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Evaluation Outcome</label>
                <select
                  value={verifStatus}
                  onChange={(e) => setVerifStatus(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800"
                >
                  <option value="approved">Approved / Passed</option>
                  <option value="needs_more_information">Needs More Information</option>
                  <option value="rejected">Rejected / Failed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Method Description</label>
                <input
                  type="text"
                  required
                  value={verifMethod}
                  onChange={(e) => setVerifMethod(e.target.value)}
                  placeholder="e.g. In-person CNIC inspection or observed practical test"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Result Summary</label>
                <textarea
                  rows={2}
                  required
                  value={verifSummary}
                  onChange={(e) => setVerifSummary(e.target.value)}
                  placeholder="Summary of check findings..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Private Notes (Staff only)</label>
                <textarea
                  rows={2}
                  value={verifNotes}
                  onChange={(e) => setVerifNotes(e.target.value)}
                  placeholder="Confidential notes..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProvider(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50"
                >
                  {isProcessing ? "Saving Check..." : "Save Verification Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Operational Policy Invariant Reminders */}
      <div className="rounded-xl bg-slate-900 text-white p-6 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-teal-400" />
          Administrator Compliance & Trust Rules
        </h3>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
          <li><strong>No false verification claims:</strong> Do not label identity as verified by NADRA without an authorized direct integration.</li>
          <li><strong>Separate record keeping:</strong> Identity reviews and practical skills assessments must always be recorded as distinct checks.</li>
          <li><strong>Audited actions:</strong> All approvals, suspensions, and manual status corrections write immutable audit logs to `admin_audit_logs`.</li>
        </ul>
      </div>
    </div>
  );
}
