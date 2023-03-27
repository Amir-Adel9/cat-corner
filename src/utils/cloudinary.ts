import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(imageUrl: string): Promise<string> {
  ('7amada');
  try {
    ('7amo');
    const imageData = await cloudinary.uploader.upload(imageUrl);

    return imageData.secure_url;
  } catch (error) {
    ('da error');
    return error as string;
  }
}
