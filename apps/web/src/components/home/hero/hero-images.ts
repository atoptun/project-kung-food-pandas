// Small dish
import img1DeskAvif1x from '@/assets/hero/avif/image-1-desktop.avif';
import img1DeskAvif2x from '@/assets/hero/avif/image-1-desktop@2x.avif';
import img1MobAvif1x from '@/assets/hero/avif/image-1-mobile.avif';
import img1MobAvif2x from '@/assets/hero/avif/image-1-mobile@2x.avif';
import img2DeskAvif1x from '@/assets/hero/avif/image-2-desktop.avif';
import img2DeskAvif2x from '@/assets/hero/avif/image-2-desktop@2x.avif';
import img2MobAvif1x from '@/assets/hero/avif/image-2-mobile.avif';
import img2MobAvif2x from '@/assets/hero/avif/image-2-mobile@2x.avif';
import img1DeskJpg1x from '@/assets/hero/jpeg/image-1-desktop.jpg';
import img1DeskJpg2x from '@/assets/hero/jpeg/image-1-desktop@2x.jpg';
import img1MobJpg1x from '@/assets/hero/jpeg/image-1-mobile.jpg';
import img1MobJpg2x from '@/assets/hero/jpeg/image-1-mobile@2x.jpg';
import img2DeskJpg1x from '@/assets/hero/jpeg/image-2-desktop.jpg';
import img2DeskJpg2x from '@/assets/hero/jpeg/image-2-desktop@2x.jpg';
//Large dish
import img2MobJpg1x from '@/assets/hero/jpeg/image-2-mobile.jpg';
import img2MobJpg2x from '@/assets/hero/jpeg/image-2-mobile@2x.jpg';
import img1DeskWebp1x from '@/assets/hero/webp/image-1-desktop.webp';
import img1DeskWebp2x from '@/assets/hero/webp/image-1-desktop@2x.webp';
import img1MobWebp1x from '@/assets/hero/webp/image-1-mobile.webp';
import img1MobWebp2x from '@/assets/hero/webp/image-1-mobile@2x.webp';
import img2DeskWebp1x from '@/assets/hero/webp/image-2-desktop.webp';
import img2DeskWebp2x from '@/assets/hero/webp/image-2-desktop@2x.webp';
import img2MobWebp1x from '@/assets/hero/webp/image-2-mobile.webp';
import img2MobWebp2x from '@/assets/hero/webp/image-2-mobile@2x.webp';

export const heroImages = {
  image1: {
    desktop: {
      avif: `${img1DeskAvif1x} 1x, ${img1DeskAvif2x} 2x`,
      webp: `${img1DeskWebp1x} 1x, ${img1DeskWebp2x} 2x`,
      jpeg: `${img1DeskJpg1x} 1x, ${img1DeskJpg2x} 2x`,
    },
    mobile: {
      avif: `${img1MobAvif1x} 1x, ${img1MobAvif2x} 2x`,
      webp: `${img1MobWebp1x} 1x, ${img1MobWebp2x} 2x`,
      jpeg: `${img1MobJpg1x} 1x, ${img1MobJpg2x} 2x`,
    },
    defaultSrc: img1DeskJpg1x,
  },
  image2: {
    desktop: {
      avif: `${img2DeskAvif1x} 1x, ${img2DeskAvif2x} 2x`,
      webp: `${img2DeskWebp1x} 1x, ${img2DeskWebp2x} 2x`,
      jpeg: `${img2DeskJpg1x} 1x, ${img2DeskJpg2x} 2x`,
    },
    mobile: {
      avif: `${img2MobAvif1x} 1x, ${img2MobAvif2x} 2x`,
      webp: `${img2MobWebp1x} 1x, ${img2MobWebp2x} 2x`,
      jpeg: `${img2MobJpg1x} 1x, ${img2MobJpg2x} 2x`,
    },
    defaultSrc: img2DeskJpg1x,
  },
};
