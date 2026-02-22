-- Create the marketplace storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marketplace',
  'marketplace',
  true,                          -- public bucket so image URLs work without auth
  5242880,                       -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view/read images (public bucket)
CREATE POLICY "Public read access for marketplace images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'marketplace');

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload marketplace images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketplace');

-- Policy: Users can update their own uploaded images
CREATE POLICY "Users can update their own marketplace images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'marketplace' AND auth.uid() = owner);

-- Policy: Users can delete their own uploaded images
CREATE POLICY "Users can delete their own marketplace images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'marketplace' AND auth.uid() = owner);
