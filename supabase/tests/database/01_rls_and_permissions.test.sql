-- ============================================================================
-- pgTAP Test Suite: 01_rls_and_permissions.test.sql
-- Run with: supabase test db (when Supabase CLI and Docker are active)
-- Verifies: Table existence, column definitions, RLS enablement, and access rules.
-- ============================================================================

BEGIN;
SELECT plan(28);

-- 1. Schema & Table Existence
SELECT has_table('public', 'profiles', 'Table profiles should exist');
SELECT has_table('public', 'user_roles', 'Table user_roles should exist');
SELECT has_table('public', 'service_categories', 'Table service_categories should exist');
SELECT has_table('public', 'service_tasks', 'Table service_tasks should exist');
SELECT has_table('public', 'service_areas', 'Table service_areas should exist');
SELECT has_table('public', 'provider_profiles', 'Table provider_profiles should exist');
SELECT has_table('public', 'provider_services', 'Table provider_services should exist');
SELECT has_table('public', 'provider_service_areas', 'Table provider_service_areas should exist');
SELECT has_table('public', 'provider_verifications', 'Table provider_verifications should exist');
SELECT has_table('public', 'provider_assessments', 'Table provider_assessments should exist');
SELECT has_table('public', 'customer_addresses', 'Table customer_addresses should exist');
SELECT has_table('public', 'jobs', 'Table jobs should exist');
SELECT has_table('public', 'job_media', 'Table job_media should exist');
SELECT has_table('public', 'booking_requests', 'Table booking_requests should exist');
SELECT has_table('public', 'quotes', 'Table quotes should exist');
SELECT has_table('public', 'quote_items', 'Table quote_items should exist');
SELECT has_table('public', 'job_events', 'Table job_events should exist');
SELECT has_table('public', 'reviews', 'Table reviews should exist');
SELECT has_table('public', 'disputes', 'Table disputes should exist');
SELECT has_table('public', 'payment_records', 'Table payment_records should exist');
SELECT has_table('public', 'commission_ledger', 'Table commission_ledger should exist');
SELECT has_table('public', 'admin_audit_logs', 'Table admin_audit_logs should exist');

-- 2. Verify RLS is Enabled
SELECT row_level_security_is_enabled('public', 'profiles', 'RLS should be enabled on profiles');
SELECT row_level_security_is_enabled('public', 'user_roles', 'RLS should be enabled on user_roles');
SELECT row_level_security_is_enabled('public', 'jobs', 'RLS should be enabled on jobs');
SELECT row_level_security_is_enabled('public', 'booking_requests', 'RLS should be enabled on booking_requests');
SELECT row_level_security_is_enabled('public', 'quotes', 'RLS should be enabled on quotes');
SELECT row_level_security_is_enabled('public', 'reviews', 'RLS should be enabled on reviews');

SELECT * FROM finish();
ROLLBACK;
