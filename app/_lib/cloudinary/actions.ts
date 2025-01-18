"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

/**
 * Cloudinaryに画像をアップロードする関数です。
 *
 * @param {string} fileData アップロードする画像データ。
 * @param {string} user_id ユーザーの一意識別子。
 * @param {string} public_id アップロードされた画像の公開識別子。
 * @returns {Promise} アップロード結果を含むPromise。
 */
export async function uploadImage(
	fileData: string,
	user_id: string,
	public_id: string,
) {
	const env = process.env.NODE_ENV ?? "development";
	const folder = env === "production" ? "dosuru" : `dosuru-${env}`;
	const options = {
		asset_folder: `${folder}/${user_id}`,
		public_id: public_id,
	};
	return await cloudinary.uploader.upload(fileData, options);
}
