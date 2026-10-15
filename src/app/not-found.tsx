import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 max-w-md text-center space-y-4">
      <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
      <p className="text-xs text-slate-500">
        The requested service, technician, or page could not be found.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}
