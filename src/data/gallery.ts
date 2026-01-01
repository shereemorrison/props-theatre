// Gallery images for each stage
// Images are imported from assets and bundled with the app

// Import all images dynamically using Vite's glob import
// @ts-ignore - Vite provides import.meta.glob at runtime
const stageoneImages = import.meta.glob('../assets/images/stageone/*.webp', { eager: true });
// @ts-ignore - Vite provides import.meta.glob at runtime
const stagetwoImages = import.meta.glob('../assets/images/stagetwo/*.webp', { eager: true });
// @ts-ignore - Vite provides import.meta.glob at runtime
const stagethreeImages = import.meta.glob('../assets/images/stagethree/*.webp', { eager: true });

// Helper to convert glob results to sorted array of paths
function getSortedImagePaths(images: Record<string, any>): string[] {
  const paths = Object.values(images)
    .map((img: any) => {
      // Handle Vite's glob import format
      if (img && typeof img === 'object') {
        return img.default || img;
      }
      return img;
    })
    .filter((path: any) => {
      // Filter out undefined, null, and non-string values
      if (!path) return false;
      if (typeof path !== 'string') {
        console.warn('[getSortedImagePaths] Non-string path found:', path);
        return false;
      }
      return true;
    })
    .sort((a: string, b: string) => {
      // Extract numbers from filenames for proper sorting
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  
  return paths;
}

// Get all images sorted by filename number, excluding "copy" files
const allStageoneImages = getSortedImagePaths(stageoneImages).filter((path: string) => 
  !path.includes(' copy')
);
const allStagetwoImages = getSortedImagePaths(stagetwoImages).filter((path: string) => 
  !path.includes(' copy')
);
const allStagethreeImages = getSortedImagePaths(stagethreeImages).filter((path: string) => 
  !path.includes(' copy')
);

// Pre-compute image arrays for each stage type
const stageOneImageArray = allStageoneImages.slice(0, 8).map((path, index) => ({
  id: `stageone${index + 1}`,
  path
}));

const stageTwoImageArray = [
  allStagetwoImages.find((p: string) => p.includes('stagetwo2')) || allStagetwoImages[0],
  allStagetwoImages.find((p: string) => p.includes('stagetwo4')) || allStagetwoImages[1],
  allStagetwoImages.find((p: string) => p.includes('stagetwo5')) || allStagetwoImages[2],
  allStagetwoImages.find((p: string) => p.includes('stagetwo6')) || allStagetwoImages[3],
  allStagetwoImages.find((p: string) => p.includes('stagetwo7')) || allStagetwoImages[4],
  allStagetwoImages.find((p: string) => p.includes('stagetwo8')) || allStagetwoImages[5],
  allStagetwoImages.find((p: string) => p.includes('stagetwo9')) || allStagetwoImages[6],
  allStagetwoImages.find((p: string) => p.includes('stagetwo10')) || allStagetwoImages[7],
].map((path, index) => ({
  id: ['stagetwo2', 'stagetwo4', 'stagetwo5', 'stagetwo6', 'stagetwo7', 'stagetwo8', 'stagetwo9', 'stagetwo10'][index],
  path
}));

const stageThreeImageArray = [
  allStagethreeImages.find((p: string) => p.includes('stagethree2')) || allStagethreeImages[0],
  allStagethreeImages.find((p: string) => p.includes('stagethree4')) || allStagethreeImages[1],
  allStagethreeImages.find((p: string) => p.includes('stagethree5')) || allStagethreeImages[2],
  allStagethreeImages.find((p: string) => p.includes('stagethree6')) || allStagethreeImages[3],
  allStagethreeImages.find((p: string) => p.includes('stagethree7')) || allStagethreeImages[4],
  allStagethreeImages.find((p: string) => p.includes('stagethree8')) || allStagethreeImages[5],
  allStagethreeImages.find((p: string) => p.includes('stagethree9')) || allStagethreeImages[6],
  allStagethreeImages.find((p: string) => p.includes('stagethree10')) || allStagethreeImages[7],
].map((path, index) => ({
  id: ['stagethree2', 'stagethree4', 'stagethree5', 'stagethree6', 'stagethree7', 'stagethree8', 'stagethree9', 'stagethree10'][index],
  path
}));

// Gallery item interface
export interface GalleryImage {
  id: string;
  path: string;
}

// Map stage IDs to their stage type (one, two, or three)
function getStageTypeFromId(stageId: string): 'one' | 'two' | 'three' | null {
  if (stageId.startsWith('stage-one-')) return 'one';
  if (stageId.startsWith('stage-two-')) return 'two';
  if (stageId.startsWith('stage-three-')) return 'three';
  return null;
}

// Generate gallery images for a stage ID
function generateGalleryImages(stageId: string): GalleryImage[] {
  const stageType = getStageTypeFromId(stageId);
  
  switch (stageType) {
    case 'one':
      return stageOneImageArray;
    case 'two':
      return stageTwoImageArray;
    case 'three':
      return stageThreeImageArray;
    default:
      console.warn(`Unknown stage type for stageId: ${stageId}`);
      return [];
  }
}

// Gallery data organized by stage ID - generated dynamically to avoid duplication
export const galleryImages: Record<string, GalleryImage[]> = {
  // Stage One images (same for all days)
  'stage-one-monday': generateGalleryImages('stage-one-monday'),
  'stage-one-tuesday': generateGalleryImages('stage-one-tuesday'),
  'stage-one-wednesday': generateGalleryImages('stage-one-wednesday'),
  'stage-one-thursday': generateGalleryImages('stage-one-thursday'),
  
  // Stage Two images (same for all days)
  'stage-two-monday': generateGalleryImages('stage-two-monday'),
  'stage-two-tuesday': generateGalleryImages('stage-two-tuesday'),
  'stage-two-wednesday': generateGalleryImages('stage-two-wednesday'),
  'stage-two-thursday-our-space': generateGalleryImages('stage-two-thursday-our-space'),
  'stage-two-thursday-bad-side': generateGalleryImages('stage-two-thursday-bad-side'),
  'stage-two-thursday-pirated': generateGalleryImages('stage-two-thursday-pirated'),
  
  // Stage Three images (same for all days)
  'stage-three-monday': generateGalleryImages('stage-three-monday'),
  'stage-three-tuesday': generateGalleryImages('stage-three-tuesday'),
  'stage-three-wednesday': generateGalleryImages('stage-three-wednesday'),
};

