-- ============================================================================
-- Migration: 20261015000003_atomic_booking_acceptance.sql
-- Description: Transactional, race-condition-safe stored procedure for booking acceptance.
-- Enforces:
-- 1. Caller authentication and provider ownership verification.
-- 2. Approved provider status and active service qualification.
-- 3. Row locking (FOR UPDATE) on booking_requests and jobs.
-- 4. Expiry check against server timestamp.
-- 5. Prevention of two providers accepting the same job.
-- 6. Schedule conflict detection for the provider.
-- 7. Atomic state transition and timeline event logging.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.rpc_accept_booking_request(
  p_request_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_auth_uid uuid;
  v_provider_id uuid;
  v_app_status provider_app_status;
  
  -- Request row fields
  v_req_id uuid;
  v_job_id uuid;
  v_req_provider_id uuid;
  v_req_status booking_request_status_type;
  v_expires_at timestamptz;
  
  -- Job row fields
  v_locked_job_id uuid;
  v_category_id uuid;
  v_job_status job_status_type;
  v_accepted_provider_id uuid;
  v_urgency text;
  v_scheduled_for timestamptz;
  v_new_job_status job_status_type;
BEGIN
  -- 1. Check Authentication
  v_auth_uid := auth.uid();
  IF v_auth_uid IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'UNAUTHENTICATED',
      'message', 'Authentication required'
    );
  END IF;

  -- 2. Resolve and Validate Provider Identity & Approval
  SELECT id, application_status 
  INTO v_provider_id, v_app_status
  FROM public.provider_profiles
  WHERE user_id = v_auth_uid;

  IF v_provider_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'NOT_A_PROVIDER',
      'message', 'User does not have an active professional profile'
    );
  END IF;

  IF v_app_status != 'approved' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'PROVIDER_NOT_APPROVED',
      'message', 'Provider account is not approved for marketplace operations'
    );
  END IF;

  -- 3. Lock and Inspect Booking Request
  SELECT id, job_id, provider_id, status, expires_at
  INTO v_req_id, v_job_id, v_req_provider_id, v_req_status, v_expires_at
  FROM public.booking_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF v_req_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'REQUEST_NOT_FOUND',
      'message', 'Booking request was not found'
    );
  END IF;

  -- Verify caller is the intended provider
  IF v_req_provider_id != v_provider_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'UNAUTHORIZED_PROVIDER',
      'message', 'You can only respond to booking requests addressed to you'
    );
  END IF;

  -- Verify request is pending
  IF v_req_status != 'pending' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'REQUEST_ALREADY_RESOLVED',
      'message', 'This request is already ' || v_req_status::text
    );
  END IF;

  -- Check Expiry (2-minute server-enforced timeout)
  IF now() >= v_expires_at THEN
    UPDATE public.booking_requests
    SET status = 'expired',
        responded_at = now(),
        response_reason = 'Response timeout expired'
    WHERE id = p_request_id;

    RETURN jsonb_build_object(
      'success', false,
      'error', 'REQUEST_EXPIRED',
      'message', 'This booking request has expired'
    );
  END IF;

  -- 4. Lock and Validate Job Record
  SELECT id, category_id, job_status, accepted_provider_id, urgency, scheduled_for
  INTO v_locked_job_id, v_category_id, v_job_status, v_accepted_provider_id, v_urgency, v_scheduled_for
  FROM public.jobs
  WHERE id = v_job_id
  FOR UPDATE;

  IF v_locked_job_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'JOB_NOT_FOUND',
      'message', 'Referenced job does not exist'
    );
  END IF;

  -- Invariant: Job must be in request_pending or open state with NO accepted provider
  IF v_job_status NOT IN ('open', 'request_pending') OR v_accepted_provider_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'JOB_ALREADY_CLAIMED',
      'message', 'Job is no longer open for acceptance'
    );
  END IF;

  -- 5. Verify Provider is Qualified & Active for This Category
  IF NOT EXISTS (
    SELECT 1 
    FROM public.provider_services 
    WHERE provider_id = v_provider_id 
      AND category_id = v_category_id 
      AND is_active = true
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'INELIGIBLE_SERVICE',
      'message', 'You are not approved or configured to service this category'
    );
  END IF;

  -- 6. Check for Conflicting Active Bookings for this Provider
  IF v_urgency = 'asap' THEN
    IF EXISTS (
      SELECT 1 FROM public.jobs
      WHERE accepted_provider_id = v_provider_id
        AND job_status IN ('confirmed', 'en_route', 'arrived', 'inspection_in_progress', 'in_progress')
    ) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'SCHEDULE_CONFLICT',
        'message', 'You currently have another active job in progress'
      );
    END IF;
  ELSIF v_urgency = 'scheduled' AND v_scheduled_for IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.jobs
      WHERE accepted_provider_id = v_provider_id
        AND job_status IN ('confirmed', 'scheduled', 'in_progress')
        AND scheduled_for IS NOT NULL
        AND scheduled_for BETWEEN (v_scheduled_for - interval '2 hours') AND (v_scheduled_for + interval '2 hours')
    ) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'SCHEDULE_CONFLICT',
        'message', 'You have a conflicting scheduled appointment within 2 hours of this slot'
      );
    END IF;
  END IF;

  -- 7. Execute Atomic State Updates
  v_new_job_status := CASE WHEN v_urgency = 'scheduled' THEN 'scheduled'::job_status_type ELSE 'confirmed'::job_status_type END;

  -- Accept the request
  UPDATE public.booking_requests
  SET status = 'accepted',
      responded_at = now()
  WHERE id = p_request_id;

  -- Attach accepted provider and transition job status
  UPDATE public.jobs
  SET job_status = v_new_job_status,
      accepted_provider_id = v_provider_id,
      accepted_at = now(),
      updated_at = now()
  WHERE id = v_job_id;

  -- Cancel any other lingering pending requests for this job (safety invariant)
  UPDATE public.booking_requests
  SET status = 'cancelled',
      responded_at = now(),
      response_reason = 'Another provider request was accepted'
  WHERE job_id = v_job_id AND id != p_request_id AND status = 'pending';

  -- Record audit timeline event
  INSERT INTO public.job_events (
    job_id,
    actor_user_id,
    event_type,
    old_status,
    new_status,
    metadata
  ) VALUES (
    v_job_id,
    v_auth_uid,
    'provider_accepted_request',
    v_job_status::text,
    v_new_job_status::text,
    jsonb_build_object(
      'request_id', p_request_id,
      'provider_id', v_provider_id,
      'urgency', v_urgency,
      'accepted_at', now()
    )
  );

  -- 8. Return Success Payload
  RETURN jsonb_build_object(
    'success', true,
    'job_id', v_job_id,
    'status', v_new_job_status::text,
    'accepted_at', now(),
    'message', 'Booking successfully accepted and confirmed'
  );
END;
$$;

-- Restrict execution to authenticated users
REVOKE ALL ON FUNCTION public.rpc_accept_booking_request(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rpc_accept_booking_request(uuid) TO authenticated;
