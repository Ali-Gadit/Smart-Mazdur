import Link from "next/link";
import { Wrench, Shield, User, Briefcase, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white font-bold">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight text-slate-900">
              Smart Mazdur
            </span>
            <span className="text-[10px] text-teal-700 font-medium">Karachi Pilot</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
          <Link href="/services" className="hover:text-teal-600 transition-colors">
            Services
          </Link>
          <Link href="/how-it-works" className="hover:text-teal-600 transition-colors">
            How It Works
          </Link>
          <Link href="/safety-and-verification" className="hover:text-teal-600 transition-colors flex items-center gap-1">
            <Shield className="h-4 w-4 text-teal-600" />
            Safety & Standards
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            href="/professional/onboarding"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            <Briefcase className="h-3.5 w-3.5 text-teal-600" />
            Join as Professional
          </Link>
          <Link
            href="/customer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm"
          >
            <User className="h-3.5 w-3.5" />
            Customer Portal
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-2 text-slate-400 hover:text-slate-700 transition"
            title="Admin Portal"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
