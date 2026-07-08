-- Prevent the SECURITY DEFINER keepalive function from being callable via the API.
REVOKE ALL ON FUNCTION public.touch_keepalive() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.touch_keepalive() FROM anon;
REVOKE ALL ON FUNCTION public.touch_keepalive() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.touch_keepalive() TO service_role;
GRANT EXECUTE ON FUNCTION public.touch_keepalive() TO postgres;