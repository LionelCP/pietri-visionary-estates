-- Harden property publishing RPC grants.
-- can_manage_properties(uuid) intentionally remains executable by anon while the
-- public SELECT policy on properties calls it to distinguish admins from public users.

REVOKE EXECUTE ON FUNCTION
  public.validate_property_for_publication(uuid),
  public.publish_property(uuid),
  public.unpublish_property(uuid),
  public.archive_property(uuid)
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION
  public.validate_property_for_publication(uuid),
  public.publish_property(uuid),
  public.unpublish_property(uuid),
  public.archive_property(uuid)
TO authenticated, service_role;
