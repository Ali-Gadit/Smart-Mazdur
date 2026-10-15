export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Privacy & Data Handling Policy</h1>
      <p className="text-xs text-teal-800 bg-teal-50 p-3 rounded border border-teal-200">
        We respect user privacy and adhere to the principle of least-privilege access for all customer and worker data.
      </p>

      <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
        <h2 className="text-sm font-bold text-slate-800">1. Address and Location Data</h2>
        <p>
          Customer exact street addresses and apartment numbers are never exposed publicly on the shortlist or to unconfirmed providers. Only the coarse service neighbourhood is shown during initial matching. Exact addresses are revealed solely to the single professional who accepts your booking request.
        </p>

        <h2 className="text-sm font-bold text-slate-800">2. Professional Identification Data</h2>
        <p>
          Government identity documents (CNIC scans) submitted during technician onboarding are stored in private encrypted storage buckets with access restricted to authorized vetting personnel. CNIC numbers are never displayed on public profile cards.
        </p>

        <h2 className="text-sm font-bold text-slate-800">3. Job Media and Photos</h2>
        <p>
          Job photographs uploaded by customers are kept in private storage buckets and accessed via time-limited signed URLs only by the booking parties and support staff.
        </p>
      </div>
    </div>
  );
}
