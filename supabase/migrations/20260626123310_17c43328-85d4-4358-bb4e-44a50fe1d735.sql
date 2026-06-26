ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS video_url_2 text,
  ADD COLUMN IF NOT EXISTS drone_video_url text,
  ADD COLUMN IF NOT EXISTS virtual_tour_url text,
  ADD COLUMN IF NOT EXISTS virtual_tour_iframe text,
  ADD COLUMN IF NOT EXISTS show_video boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_virtual_tour boolean NOT NULL DEFAULT true;