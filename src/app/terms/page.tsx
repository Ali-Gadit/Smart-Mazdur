export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Terms of Service (Pilot Agreement)</h1>
      <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
        Draft pilot policy. These terms govern participation in the Smart Mazdur closed pilot in Karachi, Pakistan.
      </p>

      <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
        <h2 className="text-sm font-bold text-slate-800">1. Nature of the Marketplace</h2>
        <p>
          Smart Mazdur operates as a technology intermediary platform connecting independent skilled tradespeople with residential and commercial customers. Technicians are independent service providers and are not direct employees of the platform.
        </p>

        <h2 className="text-sm font-bold text-slate-800">2. Customer Responsibilities</h2>
        <p>
          Customers must provide a safe working environment, describe repair issues accurately, and pay the agreed visit fee and approved quotation amounts upon satisfactory completion.
        </p>

        <h2 className="text-sm font-bold text-slate-800">3. Quotations and Approvals</h2>
        <p>
          Technicians are strictly prohibited from commencing extra chargeable labour or purchasing materials on behalf of the customer until an itemized quotation is formally submitted and approved in the application.
        </p>

        <h2 className="text-sm font-bold text-slate-800">4. Settlement and Disputes</h2>
        <p>
          Pilot transactions are settled in cash directly between customer and professional. In the event of substandard work or unapproved billing, either party may file a dispute for internal administrative review.
        </p>
      </div>
    </div>
  );
}
