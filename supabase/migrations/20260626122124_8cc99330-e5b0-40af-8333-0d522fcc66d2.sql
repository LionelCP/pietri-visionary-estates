ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS video_file_url text,
  ADD COLUMN IF NOT EXISTS hero_video_url text;