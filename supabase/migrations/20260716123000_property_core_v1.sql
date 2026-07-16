-- PR 1 — Socle Biens V1
-- Additive migration: keep legacy status/gallery/main_image_url fields intact.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'property_publication_status'
  ) THEN
    CREATE TYPE public.property_publication_status AS ENUM ('draft', 'published', 'archived');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'property_transaction_type'
  ) THEN
    CREATE TYPE public.property_transaction_type AS ENUM ('sale', 'rent', 'seasonal_rent');
  END IF;
END $$;

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS publication_status public.property_publication_status NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS reference text,
  ADD COLUMN IF NOT EXISTS title_fr text,
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS description_fr text,
  ADD COLUMN IF NOT EXISTS description_en text,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'France',
  ADD COLUMN IF NOT EXISTS transaction_type public.property_transaction_type,
  ADD COLUMN IF NOT EXISTS land_area_m2 numeric,
  ADD COLUMN IF NOT EXISTS amenities text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS seo_title_fr text,
  ADD COLUMN IF NOT EXISTS seo_title_en text,
  ADD COLUMN IF NOT EXISTS seo_description_fr text,
  ADD COLUMN IF NOT EXISTS seo_description_en text,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

-- Backfill new editorial fields from legacy production fields.
-- Mapping:
-- - legacy 'masque' remains private as 'draft'
-- - all other legacy statuses were already public via status <> 'masque', so they become 'published'
UPDATE public.properties
SET
  publication_status = CASE
    WHEN status = 'masque' THEN 'draft'::public.property_publication_status
    ELSE 'published'::public.property_publication_status
  END,
  reference = COALESCE(reference, NULLIF(internal_ref, '')),
  title_fr = COALESCE(title_fr, NULLIF(title, '')),
  title_en = COALESCE(title_en, NULLIF(title, '')),
  description_fr = COALESCE(description_fr, NULLIF(long_description, ''), NULLIF(short_description, '')),
  description_en = COALESCE(description_en, NULLIF(long_description_en, ''), NULLIF(short_description_en, '')),
  seo_title_fr = COALESCE(seo_title_fr, NULLIF(seo_title, '')),
  seo_title_en = COALESCE(seo_title_en, NULLIF(seo_title, '')),
  seo_description_fr = COALESCE(seo_description_fr, NULLIF(seo_description, '')),
  seo_description_en = COALESCE(seo_description_en, NULLIF(seo_description, '')),
  amenities = CASE
    WHEN amenities = '{}'::text[] THEN highlights
    ELSE amenities
  END,
  published_at = CASE
    WHEN status <> 'masque' AND published_at IS NULL THEN updated_at
    ELSE published_at
  END
WHERE title_fr IS NULL
   OR description_fr IS NULL
   OR reference IS NULL
   OR seo_title_fr IS NULL
   OR seo_description_fr IS NULL
   OR amenities = '{}'::text[]
   OR published_at IS NULL;

CREATE INDEX IF NOT EXISTS properties_publication_status_idx ON public.properties (publication_status);
CREATE INDEX IF NOT EXISTS properties_slug_idx ON public.properties (slug);
CREATE INDEX IF NOT EXISTS properties_display_order_idx ON public.properties (display_order);

CREATE OR REPLACE FUNCTION public.can_manage_properties(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin', 'super_admin')
  )
$$;

REVOKE EXECUTE ON FUNCTION public.can_manage_properties(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_manage_properties(uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.validate_property_for_publication(property_id uuid)
RETURNS text[]
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  p public.properties%ROWTYPE;
  errors text[] := '{}';
BEGIN
  SELECT * INTO p FROM public.properties WHERE id = property_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bien introuvable.';
  END IF;

  IF COALESCE(NULLIF(p.reference, ''), NULLIF(p.internal_ref, '')) IS NULL THEN
    errors := array_append(errors, 'La référence est obligatoire.');
  END IF;
  IF NULLIF(p.slug, '') IS NULL THEN
    errors := array_append(errors, 'Le slug est obligatoire.');
  END IF;
  IF COALESCE(NULLIF(p.title_fr, ''), NULLIF(p.title, '')) IS NULL THEN
    errors := array_append(errors, 'Le titre FR est obligatoire.');
  END IF;
  IF COALESCE(NULLIF(p.description_fr, ''), NULLIF(p.long_description, ''), NULLIF(p.short_description, '')) IS NULL THEN
    errors := array_append(errors, 'La description FR est obligatoire.');
  END IF;
  IF NULLIF(p.city, '') IS NULL THEN
    errors := array_append(errors, 'La ville est obligatoire.');
  END IF;
  IF p.region IS NULL THEN
    errors := array_append(errors, 'La région est obligatoire.');
  END IF;
  IF NULLIF(p.country, '') IS NULL THEN
    errors := array_append(errors, 'Le pays est obligatoire.');
  END IF;
  IF p.property_type IS NULL THEN
    errors := array_append(errors, 'Le type de bien est obligatoire.');
  END IF;
  IF p.transaction_type IS NULL THEN
    errors := array_append(errors, 'Le type de transaction est obligatoire.');
  END IF;
  IF COALESCE(NULLIF(p.currency, ''), '') = '' THEN
    errors := array_append(errors, 'La devise est obligatoire.');
  END IF;
  IF p.price_on_request IS NOT TRUE AND p.price_amount IS NULL THEN
    errors := array_append(errors, 'Le prix est obligatoire, sauf si prix sur demande.');
  END IF;

  RETURN errors;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.validate_property_for_publication(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_property_for_publication(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.prevent_direct_property_publication_status_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (
    OLD.publication_status IS DISTINCT FROM NEW.publication_status
    OR OLD.published_at IS DISTINCT FROM NEW.published_at
    OR OLD.archived_at IS DISTINCT FROM NEW.archived_at
  ) AND COALESCE(current_setting('app.property_publication_rpc', true), '') <> 'on' THEN
    RAISE EXCEPTION 'Les changements de publication doivent passer par les actions Publier, Dépublier ou Archiver.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS properties_publication_status_guard ON public.properties;
CREATE TRIGGER properties_publication_status_guard
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.prevent_direct_property_publication_status_change();

CREATE OR REPLACE FUNCTION public.publish_property(property_id uuid)
RETURNS public.properties
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  errors text[];
  updated_property public.properties%ROWTYPE;
BEGIN
  IF NOT public.can_manage_properties(auth.uid()) THEN
    RAISE EXCEPTION 'Seuls les administrateurs peuvent publier un bien.';
  END IF;

  errors := public.validate_property_for_publication(property_id);
  IF array_length(errors, 1) IS NOT NULL THEN
    RAISE EXCEPTION 'Publication impossible: %', array_to_string(errors, ' ');
  END IF;

  PERFORM set_config('app.property_publication_rpc', 'on', true);

  UPDATE public.properties
  SET
    publication_status = 'published',
    published_at = COALESCE(published_at, now()),
    archived_at = NULL,
    updated_by = auth.uid()
  WHERE id = property_id
  RETURNING * INTO updated_property;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bien introuvable.';
  END IF;

  RETURN updated_property;
END;
$$;

CREATE OR REPLACE FUNCTION public.unpublish_property(property_id uuid)
RETURNS public.properties
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_property public.properties%ROWTYPE;
BEGIN
  IF NOT public.can_manage_properties(auth.uid()) THEN
    RAISE EXCEPTION 'Seuls les administrateurs peuvent dépublier un bien.';
  END IF;

  PERFORM set_config('app.property_publication_rpc', 'on', true);

  UPDATE public.properties
  SET
    publication_status = 'draft',
    updated_by = auth.uid()
  WHERE id = property_id
  RETURNING * INTO updated_property;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bien introuvable.';
  END IF;

  RETURN updated_property;
END;
$$;

CREATE OR REPLACE FUNCTION public.archive_property(property_id uuid)
RETURNS public.properties
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_property public.properties%ROWTYPE;
BEGIN
  IF NOT public.can_manage_properties(auth.uid()) THEN
    RAISE EXCEPTION 'Seuls les administrateurs peuvent archiver un bien.';
  END IF;

  PERFORM set_config('app.property_publication_rpc', 'on', true);

  UPDATE public.properties
  SET
    publication_status = 'archived',
    archived_at = COALESCE(archived_at, now()),
    updated_by = auth.uid()
  WHERE id = property_id
  RETURNING * INTO updated_property;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bien introuvable.';
  END IF;

  RETURN updated_property;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.publish_property(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.unpublish_property(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.archive_property(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_property(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.unpublish_property(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.archive_property(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "public_read_visible_properties" ON public.properties;
DROP POLICY IF EXISTS "admins_insert_properties" ON public.properties;
DROP POLICY IF EXISTS "admins_update_properties" ON public.properties;
DROP POLICY IF EXISTS "admins_delete_properties" ON public.properties;

CREATE POLICY "public_read_published_properties" ON public.properties
FOR SELECT TO anon, authenticated
USING (publication_status = 'published' OR public.can_manage_properties(auth.uid()));

CREATE POLICY "admins_insert_properties" ON public.properties
FOR INSERT TO authenticated
WITH CHECK (public.can_manage_properties(auth.uid()));

CREATE POLICY "admins_update_properties" ON public.properties
FOR UPDATE TO authenticated
USING (public.can_manage_properties(auth.uid()))
WITH CHECK (public.can_manage_properties(auth.uid()));

-- No DELETE policy in V1: properties must be archived, never physically deleted from the normal app flow.
