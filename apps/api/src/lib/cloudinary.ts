import { Readable } from 'node:stream';

import { type UploadApiOptions, type UploadApiResponse, v2 as cloudinary } from 'cloudinary';

import logger from '@/config/logger';

cloudinary.config();

export async function uploadFromBuffer(
  buffer: Buffer,
  options: UploadApiOptions = {},
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      const err = new Error('Invalid or empty buffer provided for upload');
      logger.error({ err }, 'Cloudinary upload aborted: invalid buffer');
      return reject(err);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error || !result) {
          const uploadError = error ?? new Error('Cloudinary upload failed: empty result');
          logger.error(
            { err: uploadError, folder: options.folder, bytes: buffer.length },
            'Failed to upload asset to Cloudinary',
          );
          return reject(uploadError);
        }

        logger.debug(
          { publicId: result.public_id, bytes: result.bytes, folder: options.folder },
          'Asset uploaded successfully to Cloudinary',
        );

        resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  options: UploadApiOptions = {},
): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      ...options,
    });

    if (result.result !== 'ok' && result.result !== 'not found') {
      logger.warn({ publicId, result }, 'Cloudinary destroy returned non-ok result');
      return false;
    }

    logger.debug({ publicId }, 'Asset deleted successfully from Cloudinary');

    return true;
  } catch (error) {
    logger.warn({ err: error, publicId }, 'Failed to delete asset from Cloudinary');
    return false;
  }
}

export default cloudinary;
