import Link from "next/link";
import { PlusCircle, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function CustomerDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active requests, approve quotations, and view completed jobs in Karachi.
          </p>
        </div>

        <Link
          href="/customer/requests/new"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-800 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Request a Service
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
          <span className="text-xs font-medium text-slate-500">Active Bookings</span>
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-[11px] text-slate-400">No repair jobs currently in progress</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
          <span className="text-xs font-medium text-slate-500">Quotes Pending Approval</span>
          <p className="text-2xl font-bold text-teal-700">0</p>
          <p className="text-[11px] text-slate-400">All submitted quotes reviewed</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
          <span className="text-xs font-medium text-slate-500">Completed Repairs</span>
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-[11px] text-slate-400">Pilot account initialized</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Clock className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No active service requests</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Need a plumber, electrician, or AC technician in your Karachi neighbourhood?
        </p>
        <Link
          href="/customer/requests/new"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
        >
          <span>Start a new request</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
