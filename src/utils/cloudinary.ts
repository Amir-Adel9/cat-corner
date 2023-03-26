import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(imageBase64Code: string): Promise<string> {
  console.log('7amada');
  try {
    console.log('7amo');
    const imageData = await cloudinary.uploader.upload(imageBase64Code);
    console.log('imageData', imageData);
    return imageData.secure_url;
  } catch (error) {
    console.log('da error');
    return error as string;
  }
}
