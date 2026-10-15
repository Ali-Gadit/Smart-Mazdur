# Open Questions & Operational Assumptions

This document tracks unresolved business, legal, and operational questions for the Skilled Labour Marketplace pilot in Karachi, Pakistan.
Each item lists the MVP working assumption, responsible owner, and required validation action.

---

### 1. Final Product Name, Domain, and Visual Identity
- **Status:** Open
- **MVP Assumption:** Configurable placeholder `Smart Mazdur` with generic trusted green/teal styling.
- **Owner:** Product / Brand Lead
- **Next Action:** Finalize trademark registration, local domain (.pk), and brand identity prior to public marketing.

---

### 2. Exact First Service Area in Karachi
- **Status:** Open
- **MVP Assumption:** Initial pilot focused on a specific single pilot zone (e.g., Gulshan-e-Iqbal or Clifton/Defence) rather than entire city.
- **Owner:** Operations Lead
- **Next Action:** Select pilot zone based on initial technician supply density and customer test cohort.

---

### 3. Verification Standard and Practical Assessment Logistics
- **Status:** Open
- **MVP Assumption:** MVP separates manual identity document review from practical trade skills assessment. Admins record specific checks performed. No false claims of direct NADRA API integration or government certification.
- **Owner:** Operations & Safety Lead
- **Next Action:** Partner with reputable master technicians or vocational institutes (e.g., TEVTA/NAVTTC affiliated assessors) to establish trade checklists.

---

### 4. Phone Verification Timing
- **Status:** Open
- **MVP Assumption:** Email/password or magic link for initial account creation; verified phone required before confirming a booking or dispatching a professional.
- **Owner:** Product / UX Lead
- **Next Action:** Test SMS cost and delivery reliability in Pakistan before mandating OTP on initial discovery.

---

### 5. Visit Fee, Cancellation, and No-Show Rules
- **Status:** Open
- **MVP Assumption:** Clear visit/inspection fee disclosed upfront before booking. Customer can cancel without penalty before provider acceptance. Post-acceptance cancellations are logged for operational review. No automated punitive charges without clear payment mechanism.
- **Owner:** Operations & Legal
- **Next Action:** Document written policy reviewed by local legal counsel.

---

### 6. Commission Rate and Cash Settlement Reconciliation
- **Status:** Open
- **MVP Assumption:** System tracks expected platform commission in a ledger for reporting and unit economics modeling; does not claim automated collection. Direct cash settlement between customer and worker for the pilot.
- **Owner:** Finance Lead
- **Next Action:** Validate worker willingness to pay commission via manual weekly reconciliation or upfront balance during pilot.

---

### 7. Cash Payment Dual-Confirmation
- **Status:** Open
- **MVP Assumption:** Professional reports payment collected; customer confirms payment. Discrepancies flagged for support rather than auto-overwritten.
- **Owner:** Product Lead
- **Next Action:** Test friction of dual-confirmation with pilot cohort.

---

### 8. Customer Support Operating Hours & Escalation Path
- **Status:** Open
- **MVP Assumption:** Fixed pilot operating hours (e.g., 9:00 AM – 7:00 PM PKT) with direct phone/WhatsApp escalation to operations manager.
- **Owner:** Customer Support Lead
- **Next Action:** Set up dedicated support hotline and define on-call emergency escalation rules.

---

### 9. Map Provider vs. Manual Address/Locality Entry
- **Status:** Open
- **MVP Assumption:** Full manual address and neighbourhood selection fallback. Maps/geocoding optional via standard adapter if keys are provided.
- **Owner:** Engineering Lead
- **Next Action:** Evaluate cost and accuracy of Google Maps / Mapbox vs. local neighbourhood drop-downs in Karachi.

---

### 10. Notification Channels & Cost
- **Status:** Open
- **MVP Assumption:** Real-time in-app notifications and dashboard polling for MVP; SMS/WhatsApp adapters ready for provider configuration.
- **Owner:** Engineering / Ops
- **Next Action:** Secure compliant WhatsApp Business API / SMS gateway rates for Pakistan.

---

### 11. Data Retention & Privacy for Identity Evidence
- **Status:** Open
- **MVP Assumption:** Verification evidence stored in private Supabase buckets accessible only to authorized reviewers; CNIC numbers not displayed publicly or exposed in API responses.
- **Owner:** Legal & Compliance
- **Next Action:** Draft official data retention and deletion policy complying with applicable privacy legislation.

---

### 12. Local Legal, Business Registration, and Worker Arrangement
- **Status:** Open
- **MVP Assumption:** Independent contractor / marketplace intermediary model.
- **Owner:** Legal Counsel
- **Next Action:** Review independent contractor terms, tax withholding requirements (FBR / SRB), and marketplace liability disclaimers.

---

### 13. Pilot Numeric Pass/Fail Targets
- **Status:** Open
- **MVP Assumption:** Initial baseline: 30 completed pilot jobs, >80% technician response rate, <10% dispute rate.
- **Owner:** General Manager
- **Next Action:** Formalize scorecard with investor / management team before cohort launch.

---

### 14. Service Guarantee and Rework Policy
- **Status:** Open
- **MVP Assumption:** No unbacked "guarantee" or insurance claims. Platform provides structured dispute mediation and admin follow-up.
- **Owner:** Legal & Ops
- **Next Action:** Determine if an escrow fund or platform rework subsidy is financially feasible post-pilot.
