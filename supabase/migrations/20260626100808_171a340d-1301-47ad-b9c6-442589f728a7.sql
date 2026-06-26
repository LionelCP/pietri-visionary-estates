
CREATE TABLE public.visit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  ip_truncated TEXT,
  country TEXT,
  city TEXT,
  page TEXT NOT NULL,
  referrer TEXT,
  device TEXT,
  browser TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_visit_logs_created_at ON public.visit_logs (created_at DESC);
CREATE INDEX idx_visit_logs_session_id ON public.visit_logs (session_id);
CREATE INDEX idx_visit_logs_page ON public.visit_logs (page);

GRANT SELECT ON public.visit_logs TO authenticated;
GRANT ALL ON public.visit_logs TO service_role;

ALTER TABLE public.visit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_read_visit_logs"
  ON public.visit_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins_delete_visit_logs"
  ON public.visit_logs
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Purge function (called periodically; can be invoked from edge function)
CREATE OR REPLACE FUNCTION public.purge_old_visit_logs()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.visit_logs WHERE created_at < now() - INTERVAL '13 months';
$$;
