-- Keep the database warm so the Supabase project does not pause due to inactivity.
-- pg_cron runs a trivial query on a schedule, generating regular DB activity.

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- A tiny table to record heartbeats (also acts as write activity).
CREATE TABLE IF NOT EXISTS public.keepalive (
  id boolean PRIMARY KEY DEFAULT true,
  last_ping timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT keepalive_singleton CHECK (id)
);

GRANT SELECT ON public.keepalive TO anon;
GRANT SELECT ON public.keepalive TO authenticated;
GRANT ALL ON public.keepalive TO service_role;

ALTER TABLE public.keepalive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Keepalive is readable by everyone" ON public.keepalive;
CREATE POLICY "Keepalive is readable by everyone"
ON public.keepalive FOR SELECT
USING (true);

INSERT INTO public.keepalive (id) VALUES (true)
ON CONFLICT (id) DO NOTHING;

-- Function that updates the heartbeat row.
CREATE OR REPLACE FUNCTION public.touch_keepalive()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.keepalive (id, last_ping)
  VALUES (true, now())
  ON CONFLICT (id) DO UPDATE SET last_ping = now();
$$;

-- Schedule: every day at 06:00 UTC, keep the project active.
SELECT cron.unschedule('keepalive-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'keepalive-daily');

SELECT cron.schedule(
  'keepalive-daily',
  '0 6 * * *',
  $$ SELECT public.touch_keepalive(); $$
);