import { Readable } from 'node:stream';

import { type UploadApiOptions, type UploadApiResponse, v2 as cloudinary } from 'cloudinary';

cloudinary.config();

export function uploadFromBuffer(
  buffer: Buffer,
  options: UploadApiOptions = {},
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error('Invalid or empty buffer provided for upload'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error('Cloudinary upload failed'));
        }
        resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
