"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  fileData: string,
  user_id: string,
  public_id: string
) {
  const options = {
    asset_folder: `tms-app/${user_id}`,
    public_id: public_id,
  };
  return await cloudinary.uploader.upload(fileData, options);
}
