import { describe, expect, it } from 'vitest';

import { buildCloudinaryUrl, getCloudinarySrcSet } from '@/utils/cloudinary';

describe('buildCloudinaryUrl', () => {
  describe('Success cases', () => {
    it('transforms standard URL with version', () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/v1612345678/sample.jpg';
      const result = buildCloudinaryUrl(url, { width: 300, height: 200 });

      expect(result).toBe(
        'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,dpr_1.0,w_300,h_200,c_fill,g_auto/v1612345678/sample.jpg',
      );
    });

    it('transforms URL without version', () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
      const result = buildCloudinaryUrl(url, { width: 300, height: 200 });

      expect(result).toBe(
        'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,dpr_1.0,w_300,h_200,c_fill,g_auto/sample.jpg',
      );
    });

    it('handles nested folder path containing "upload"', () => {
      const url =
        'https://res.cloudinary.com/demo/image/upload/v12345/user_upload_folder/upload_item.jpg';
      const result = buildCloudinaryUrl(url, { preset: 'avatarHeader' });

      expect(result).toBe(
        'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,dpr_1.0,w_40,h_40,c_fill,g_face/v12345/user_upload_folder/upload_item.jpg',
      );
    });

    it('handles video upload URLs', () => {
      const url = 'https://res.cloudinary.com/demo/video/upload/promo.mp4';
      const result = buildCloudinaryUrl(url, { width: 640 });

      expect(result).toBe(
        'https://res.cloudinary.com/demo/video/upload/f_auto,q_auto,dpr_1.0,w_640,c_fill,g_auto/promo.mp4',
      );
    });

    it('applies custom DPR and crops correctly', () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/recipe.jpg';
      const result = buildCloudinaryUrl(url, {
        width: 400,
        height: 300,
        crop: 'fit',
        gravity: 'face',
        dpr: 2,
      });

      expect(result).toBe(
        'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,dpr_2.0,w_400,h_300,c_fit,g_face/recipe.jpg',
      );
    });

    it('uses predefined presets (e.g. categoryTablet, recipeCard)', () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/dish.jpg';
      const result = buildCloudinaryUrl(url, { preset: 'categoryTablet', dpr: 2 });

      expect(result).toBe(
        'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,dpr_2.0,w_704,h_369,c_fill,g_auto/dish.jpg',
      );
    });
  });

  describe('Non-matching / Failure cases (safe fallback)', () => {
    it('returns empty string when url is null or undefined', () => {
      expect(buildCloudinaryUrl(null)).toBe('');
      expect(buildCloudinaryUrl(undefined)).toBe('');
      expect(buildCloudinaryUrl('')).toBe('');
    });

    it('returns original URL if domain is not cloudinary.com', () => {
      const externalUrl = 'https://images.unsplash.com/image/upload/photo.jpg';
      expect(buildCloudinaryUrl(externalUrl)).toBe(externalUrl);
    });

    it('returns original URL if path is not a valid upload route', () => {
      const nonUploadUrl = 'https://res.cloudinary.com/demo/image/authenticated/sample.jpg';
      expect(buildCloudinaryUrl(nonUploadUrl)).toBe(nonUploadUrl);
    });

    it('returns original relative or local paths intact', () => {
      const localPath = '/images/categories/desserts.webp';
      expect(buildCloudinaryUrl(localPath)).toBe(localPath);
    });
  });
});

describe('getCloudinarySrcSet', () => {
  it('generates 1x and 2x responsive srcSet for preset', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/category.jpg';
    const { src, srcSet } = getCloudinarySrcSet(url, 'categoryMobile');

    expect(src).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,dpr_1.0,w_343,h_250,c_fill,g_auto/category.jpg',
    );
    expect(srcSet).toBe(
      `${src} 1x, https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,dpr_2.0,w_343,h_250,c_fill,g_auto/category.jpg 2x`,
    );
  });
});
