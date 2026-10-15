import Link from "next/link";
import {
  Wrench,
  Zap,
  Wind,
  ShieldCheck,
  Clock,
  Coins,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50/70 to-white py-14 sm:py-20 border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/70 text-teal-800 text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5 text-teal-700" />
              <span>Closed Pilot: Launching in Selected Karachi Localities</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Honest home repairs with{" "}
              <span className="text-teal-700">upfront visit charges</span> & verified skill.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Choose your professional from a shortlist of nearby, independently assessed technicians. Know the visit fee before booking and approve repair quotes before work starts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/customer/requests/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 transition"
              >
                <span>Book a Technician</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                How It Works
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                No surprise pricing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                Quote approval required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                Direct cash payment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Pilot Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Launch Services in Karachi</h2>
            <p className="text-sm text-slate-500 mt-2">
              Quality before breadth: We focus on 3 core trades with strict practical skills assessments before expanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Category 1: Plumbing */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-teal-500 hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Plumbing</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Leak diagnosis, tap & sanitary fitting replacements, motor pump troubleshooting, and drain clearance.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Visit fee from</span>
                <span className="font-bold text-slate-900">Rs. 500</span>
              </div>
              <Link
                href="/customer/requests/new?category=plumbing"
                className="mt-4 block text-center rounded-lg bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition"
              >
                Request Plumber
              </Link>
            </div>

            {/* Category 2: Electrical */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-teal-500 hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Electrical Work</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Short circuit diagnosis, breaker & DB board repair, UPS wiring, fan/light mounting, and socket replacement.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Visit fee from</span>
                <span className="font-bold text-slate-900">Rs. 600</span>
              </div>
              <Link
                href="/customer/requests/new?category=electrical"
                className="mt-4 block text-center rounded-lg bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition"
              >
                Request Electrician
              </Link>
            </div>

            {/* Category 3: AC Repair */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-teal-500 hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Wind className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AC Repair & Service</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                General master service, refrigerant gas charging, cooling fault diagnosis, and PCB card inspection.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Visit fee from</span>
                <span className="font-bold text-slate-900">Rs. 800</span>
              </div>
              <Link
                href="/customer/requests/new?category=ac-repair"
                className="mt-4 block text-center rounded-lg bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition"
              >
                Request AC Tech
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Mechanics Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">How Smart Mazdur Protects You</h2>
            <p className="text-sm text-slate-500 mt-2">
              Designed around honesty, transparent pricing, and worker dignity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Coins className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Upfront Agreed Quotes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technicians provide an itemized quote detailing labour and parts before performing extra work. No surprise charges upon job completion.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-10 w-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Separate Identity & Skill Vetting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We clearly separate CNIC identity reviews from practical technical skill assessments. We never show fake automated badges.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-10 w-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Timeout & Shortlist Choice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You select a specific technician from a verified shortlist. If they do not respond within 2 minutes, you can easily select another provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Callout */}
      <section className="py-14 bg-teal-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-2xl space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Are you an experienced tradesperson in Karachi?</h2>
          <p className="text-sm text-teal-100 leading-relaxed">
            Join the Smart Mazdur pilot cohort. Receive direct job requests in your neighbourhood with guaranteed fair visit charges and transparent terms.
          </p>
          <div className="pt-2">
            <Link
              href="/professional/onboarding"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-teal-900 hover:bg-teal-50 transition"
            >
              Apply as a Professional
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
