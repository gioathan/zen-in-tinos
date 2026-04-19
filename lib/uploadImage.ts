import imageCompression from 'browser-image-compression';
import { supabaseClient } from "./supabase";

export async function uploadImage(
  file: File,
  folder: string = "houses"
): Promise<string | null> {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
      return null;
    }

    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    const compressedFile = await imageCompression(file, options);
    
    const fileExt = 'webp';
    const sanitizedName = file.name
      .replace(/\s+/g, '_')
      .replace(/[^\w.-]/g, '')
      .toLowerCase()
      .replace(/\.\w+$/, '');
    
    const fileName = `${folder}/${Date.now()}_${sanitizedName}.${fileExt}`;
    
    const { error } = await supabaseClient.storage
      .from("zen-in-tinos")
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return null;
    }

    const { data: { publicUrl } } = supabaseClient.storage
      .from("zen-in-tinos")
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    return null;
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const path = url.split('/storage/v1/object/public/zen-in-tinos/')[1];
    
    if (path) {
      const { error } = await supabaseClient.storage.from("zen-in-tinos").remove([path]);
    }
  } catch (error) {
  }
}