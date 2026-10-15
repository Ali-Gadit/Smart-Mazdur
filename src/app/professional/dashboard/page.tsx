"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPKR } from "@/lib/money";
import {
  Power,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  AlertTriangle,
  FileText,
  User,
} from "lucide-react";

export default function ProfessionalDashboardPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [hasPendingRequest, setHasPendingRequest] = useState(true);
  const [requestStatus, setRequestStatus] = useState<"pending" | "accepted" | "declined">("pending");

  const handleAccept = () => {
    setRequestStatus("accepted");
  };

  const handleDecline = () => {
    setRequestStatus("declined");
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-4xl space-y-8">
      {/* Header and Online Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">[DEMO] Tariq Mehmood</h1>
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-teal-100 text-teal-800">
              Verified Plumber
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Base: Gulshan-e-Iqbal • Karachi Pilot</p>
        </div>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
            isOnline
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          <Power className="h-4 w-4" />
          <span>{isOnline ? "Online (Receiving Jobs)" : "Offline"}</span>
        </button>
      </div>

      {/* Verification Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-teal-700 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Identity Review: Approved</h4>
            <p className="text-[11px] text-slate-600">CNIC inspected manually by operations team</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-teal-700 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Plumbing Assessment: Passed</h4>
            <p className="text-[11px] text-slate-600">Observed by senior master technician</p>
          </div>
        </div>
      </div>

      {/* New Booking Request Alert */}
      {hasPendingRequest && requestStatus === "pending" && (
        <div className="rounded-2xl border-2 border-teal-600 bg-white p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Clock className="h-3.5 w-3.5" />
              Incoming Job Request • Expires in 1:45
            </span>
            <span className="text-sm font-black text-slate-900">Visit Fee: Rs. 500</span>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">Basin Tap Leak & Water Pressure Issue</h3>
            <p className="text-xs text-slate-600">
              Customer in <strong>Gulshan-e-Iqbal Block 7</strong> needs inspection as soon as possible.
            </p>
            <p className="text-[11px] text-slate-400">
              Full street address will be unlocked once you accept the request.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAccept}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-xs font-bold text-white hover:bg-teal-800 transition shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              Accept Job (Rs. 500 Visit Fee)
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {requestStatus === "accepted" && (
        <div className="rounded-2xl border border-teal-300 bg-teal-50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800">Job Confirmed & Active</span>
            <span className="text-xs font-bold text-slate-700">Booking ID: #JM-8492</span>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <p><strong>Customer:</strong> Salman K. (Gulshan Block 7)</p>
            <p><strong>Unlocked Address:</strong> Flat 4B, Al-Noor Apartments, Street 4, Block 7, Gulshan</p>
            <p><strong>Agreed Visit Charge:</strong> Rs. 500 (Payable in cash on-site)</p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button className="rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 transition">
              Mark Arrived
            </button>
            <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
              Submit Itemized Repair Quote
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity / Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Completed Jobs</span>
          <p className="text-2xl font-bold text-slate-900">19</p>
          <p className="text-[11px] text-teal-700">100% completion rate</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Average Rating</span>
          <p className="text-2xl font-bold text-slate-900">4.8 / 5.0</p>
          <p className="text-[11px] text-slate-400">From 14 verified customer reviews</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Reported Cash Revenue</span>
          <p className="text-2xl font-bold text-slate-900">Rs. 24,500</p>
          <p className="text-[11px] text-slate-400">Direct cash settlements</p>
        </div>
      </div>
    </div>
  );
}
