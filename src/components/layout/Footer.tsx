import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-white text-base font-bold">Smart Mazdur</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              On-demand marketplace for vetted home repair technicians. Currently running a closed pilot in Karachi, Pakistan.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 p-2.5 rounded border border-amber-800/60">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Pilot version. Real-world verification records logged manually by staff.</span>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Initial Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/plumbing" className="hover:text-white transition">
                  Plumbing Repair
                </Link>
              </li>
              <li>
                <Link href="/services/electrical" className="hover:text-white transition">
                  Electrical Maintenance
                </Link>
              </li>
              <li>
                <Link href="/services/ac-repair" className="hover:text-white transition">
                  AC Servicing & Gas Refill
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">For Technicians</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/professional/onboarding" className="hover:text-white transition">
                  Apply as a Service Provider
                </Link>
              </li>
              <li>
                <Link href="/safety-and-verification" className="hover:text-white transition">
                  Skills Assessment Standards
                </Link>
              </li>
              <li>
                <Link href="/professional/dashboard" className="hover:text-white transition">
                  Technician Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Policies & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service (Pilot)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-white transition">
                  Visit Fees & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Internal Ops / Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Smart Mazdur (Pilot). Currency: PKR. Operational in Karachi, Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}
