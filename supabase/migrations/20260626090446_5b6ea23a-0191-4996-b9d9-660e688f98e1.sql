
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;

-- Storage policies for property-images and property-documents
CREATE POLICY "public_read_property_images" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'property-images');

CREATE POLICY "admins_write_property_images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_update_property_images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_delete_property_images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_read_property_documents" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'property-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_write_property_documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'property-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_update_property_documents" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'property-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_delete_property_documents" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'property-documents' AND public.has_role(auth.uid(), 'admin'));
