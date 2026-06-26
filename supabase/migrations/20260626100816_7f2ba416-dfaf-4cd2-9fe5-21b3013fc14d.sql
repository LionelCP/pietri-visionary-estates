
REVOKE EXECUTE ON FUNCTION public.purge_old_visit_logs() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.purge_old_visit_logs() FROM anon;
REVOKE EXECUTE ON FUNCTION public.purge_old_visit_logs() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.purge_old_visit_logs() TO service_role;
