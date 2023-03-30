import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(imageUrl: string): Promise<{
  secureUrl: string;
  width: number;
  height: number;
}> {
  const imageData = await cloudinary.uploader.upload(imageUrl);
  return {
    secureUrl: imageData.secure_url,
    width: imageData.width,
    height: imageData.height,
  };
}
