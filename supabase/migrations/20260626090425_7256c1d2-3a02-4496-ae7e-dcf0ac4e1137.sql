
-- Enums
CREATE TYPE public.property_status AS ENUM ('disponible','sous_offre','vendu','reserve','masque');
CREATE TYPE public.property_type AS ENUM ('appartement','maison','villa','terrain','local_commercial','programme','autre');
CREATE TYPE public.property_region AS ENUM ('corse','continent','monaco','bali','autre');
CREATE TYPE public.app_role AS ENUM ('admin');

-- Properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status public.property_status NOT NULL DEFAULT 'disponible',
  property_type public.property_type,
  region public.property_region,
  city TEXT,
  sector TEXT,
  price_amount NUMERIC,
  price_display TEXT,
  price_on_request BOOLEAN NOT NULL DEFAULT false,
  area_m2 NUMERIC,
  rooms INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  floor TEXT,
  has_terrace BOOLEAN NOT NULL DEFAULT false,
  has_garden BOOLEAN NOT NULL DEFAULT false,
  has_balcony BOOLEAN NOT NULL DEFAULT false,
  has_sea_view BOOLEAN NOT NULL DEFAULT false,
  has_mountain_view BOOLEAN NOT NULL DEFAULT false,
  has_open_view BOOLEAN NOT NULL DEFAULT false,
  short_description TEXT,
  long_description TEXT,
  short_description_en TEXT,
  long_description_en TEXT,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  energy_class TEXT,
  main_image_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  plan_pdf_url TEXT,
  internal_ref TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  coup_de_coeur BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  matterport_id TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX properties_status_idx ON public.properties (status);
CREATE INDEX properties_featured_idx ON public.properties (featured) WHERE featured = true;
CREATE INDEX properties_display_order_idx ON public.properties (display_order);

GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER properties_set_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Policies: user_roles
CREATE POLICY "users_read_own_roles" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "admins_read_all_roles" ON public.user_roles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policies: properties
CREATE POLICY "public_read_visible_properties" ON public.properties
FOR SELECT TO anon, authenticated
USING (status <> 'masque' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_insert_properties" ON public.properties
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_update_properties" ON public.properties
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_delete_properties" ON public.properties
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
