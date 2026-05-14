import { supabase } from './supabase';
import { toast } from 'sonner';

export const uploadFile = async (file: File, folder: string = 'general'): Promise<string | null> => {
  try {
    const fileName = `${folder}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Failed to upload file');
    return null;
  }
};

export const uploadImage = async (file: File, folder: string = 'images'): Promise<string | null> => {
  if (!file.type.startsWith('image/')) {
    toast.error('Please select a valid image file');
    return null;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image must be smaller than 5MB');
    return null;
  }

  return uploadFile(file, folder);
};

export const uploadVideo = async (file: File, folder: string = 'videos'): Promise<string | null> => {
  if (!file.type.startsWith('video/')) {
    toast.error('Please select a valid video file');
    return null;
  }

  if (file.size > 100 * 1024 * 1024) {
    toast.error('Video must be smaller than 100MB');
    return null;
  }

  return uploadFile(file, folder);
};

export const deleteFile = async (url: string): Promise<boolean> => {
  try {
    const path = url.split('/storage/v1/object/public/media/')[1];
    if (!path) return false;

    const { error } = await supabase.storage
      .from('media')
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};
