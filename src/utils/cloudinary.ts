import type { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(imageBase64Code: string): Promise<string> {
  try {
    const imageData = await cloudinary.uploader.upload(imageBase64Code);
    return imageData.secure_url;
  } catch (error) {
    return error as string;
  }
}
