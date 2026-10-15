import Link from "next/link";
import { Search, UserCheck, MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Describe Your Problem & Location",
      desc: "Select your repair category (Plumbing, Electrical, or AC). Describe the issue, specify if you need urgent or scheduled help, and provide your neighbourhood in Karachi.",
    },
    {
      num: "02",
      icon: UserCheck,
      title: "Compare Verified Shortlist & Choose",
      desc: "Unlike platforms that blind-dispatch whoever is nearest, we show you a shortlist of eligible professionals with their inspection fees, verified trade assessments, and real review scores. You choose who you want.",
    },
    {
      num: "03",
      icon: MessageSquare,
      title: "Request Sent with 2-Minute Expiry",
      desc: "Your chosen professional receives the request. If they decline or do not respond within 2 minutes, you can easily select the next available technician without losing your job details.",
    },
    {
      num: "04",
      icon: CheckCircle2,
      title: "Approve Quote & Settle in Cash",
      desc: "The technician visits and diagnoses the problem. If extra parts or work are needed, they submit an itemized quote in the app. Once you approve, they complete the work and you pay cash on-site.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 max-w-4xl">
      <div className="text-center space-y-4 mb-14">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          How Smart Mazdur Works
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          A Yango-style marketplace where you stay in control of who enters your home and how much you pay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm relative">
              <span className="text-3xl font-black text-teal-100 absolute top-4 right-5 select-none">
                {s.num}
              </span>
              <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-teal-800 text-white p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Ready to try the service in Karachi?</h2>
        <p className="text-xs text-teal-100 max-w-lg mx-auto">
          Join our pilot and experience upfront visit pricing and certified technicians.
        </p>
        <Link
          href="/customer/requests/new"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-teal-900 hover:bg-teal-50 transition"
        >
          Book a Technician Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
