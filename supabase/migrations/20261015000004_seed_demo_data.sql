-- ============================================================================
-- Migration: 20261015000004_seed_demo_data.sql
-- Description: Seed initial categories, tasks, Karachi pilot service areas,
-- and demo profiles for local development and staging testing.
-- All demo records are explicitly prefixed with [DEMO].
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PILOT SERVICE AREAS (Karachi, Pakistan)
-- ----------------------------------------------------------------------------

INSERT INTO public.service_areas (id, name, city, is_active) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Gulshan-e-Iqbal (Blocks 1-13)', 'Karachi', true),
  ('a1000000-0000-0000-0000-000000000002', 'Clifton (Blocks 1-9)', 'Karachi', true),
  ('a1000000-0000-0000-0000-000000000003', 'PECHS & Tariq Road Area', 'Karachi', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active;

-- ----------------------------------------------------------------------------
-- 2. SERVICE CATEGORIES (Plumbing, Electrical, AC Repair)
-- ----------------------------------------------------------------------------

INSERT INTO public.service_categories (id, name, slug, description, icon_key, is_active, sort_order) VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'Plumbing',
    'plumbing',
    'Water leaks, sanitary fittings, pipe repairs, and pump diagnostics.',
    'Wrench',
    true,
    1
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'Electrical Work',
    'electrical',
    'Short circuits, breaker boards, UPS/wiring, fans, and socket installation.',
    'Zap',
    true,
    2
  ),
  (
    'c1000000-0000-0000-0000-000000000003',
    'AC Repair & Maintenance',
    'ac-repair',
    'Split AC servicing, cooling diagnosis, gas leak test & refill.',
    'Wind',
    true,
    3
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;

-- ----------------------------------------------------------------------------
-- 3. DEFINED SERVICE TASKS
-- ----------------------------------------------------------------------------

INSERT INTO public.service_tasks (
  id, category_id, name, slug, description, pricing_mode, fixed_price, visit_fee, currency,
  scope_inclusions, scope_exclusions, requires_skill_assessment, is_active
) VALUES
  (
    't1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Tap / Mixer Replacement or Repair',
    'tap-replacement',
    'Replace faulty basin or kitchen mixer, spindle, or washers.',
    'fixed',
    800.00,
    500.00,
    'PKR',
    'Labour to remove existing fixture and install 1 new unit. Testing for leaks.',
    'New mixer tap, flex pipes, and additional plumbing valves must be provided by customer or quoted separately.',
    true,
    true
  ),
  (
    't1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'Plumbing Inspection & Leak Diagnosis',
    'plumbing-leak-diagnosis',
    'Physical inspection of concealed or surface leak, low water pressure, or drainage blockage.',
    'inspection_quote',
    NULL,
    500.00,
    'PKR',
    'Up to 45 mins physical inspection to pinpoint problem. Submission of itemized repair quote.',
    'Breakage/tile cutting, repair labour, and materials are not included in initial visit fee.',
    true,
    true
  ),
  (
    't1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000002',
    'Electrical Fault & Short Circuit Diagnosis',
    'electrical-fault-diagnosis',
    'Tripping breaker, burned wire detection, or localized power outage inspection.',
    'inspection_quote',
    NULL,
    600.00,
    'PKR',
    'Multimeter testing of circuits, DB panel check, isolation of short circuit fault.',
    'Wire replacement and breaker hardware are quoted separately.',
    true,
    true
  ),
  (
    't1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000003',
    'Split AC Master Servicing (Indoor & Outdoor)',
    'ac-master-servicing',
    'High-pressure chemical wash of indoor blower coil, filters, and outdoor condenser.',
    'fixed',
    2000.00,
    800.00,
    'PKR',
    'Full pressure wash of 1 split AC (indoor + outdoor), drain line flush, operating temperature test.',
    'Refrigerant gas top-up or electrical capacitor replacements are separate.',
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  fixed_price = EXCLUDED.fixed_price,
  visit_fee = EXCLUDED.visit_fee,
  scope_inclusions = EXCLUDED.scope_inclusions,
  scope_exclusions = EXCLUDED.scope_exclusions;
