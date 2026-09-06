import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_CERT_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export type UploadResult = {
  url: string | null;
  error: string | null;
};

export async function uploadFile(
  file: File,
  bucket: 'certificates' | 'project-images',
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const allowedTypes = bucket === 'certificates' ? ALLOWED_CERT_TYPES : ALLOWED_IMAGE_TYPES;

  if (!allowedTypes.includes(file.type)) {
    return {
      url: null,
      error: bucket === 'certificates'
        ? 'Only PDF, JPG, and PNG files are allowed'
        : 'Only JPG, PNG, and WebP files are allowed',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { url: null, error: 'File size must be under 10MB' };
  }

  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  onProgress?.(10);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  onProgress?.(80);

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

  onProgress?.(100);

  return { url: urlData.publicUrl, error: null };
}
