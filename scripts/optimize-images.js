import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync, statSync } from 'fs';

const PERFORMERS_DIR = './src/assets/images/performers';
const QUALITY = 85; // WebP quality (0-100)
const MAX_WIDTH = 1200; // Max width in pixels to reduce file size
const MAX_HEIGHT = 1600; // Max height in pixels

async function optimizeImage(inputPath, outputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    
    // Calculate new dimensions maintaining aspect ratio
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
      if (width / MAX_WIDTH > height / MAX_HEIGHT) {
        width = MAX_WIDTH;
        height = Math.round((metadata.height / metadata.width) * MAX_WIDTH);
      } else {
        height = MAX_HEIGHT;
        width = Math.round((metadata.width / metadata.height) * MAX_HEIGHT);
      }
    }
    
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ 
        quality: QUALITY,
        effort: 6 // Higher effort = better compression but slower
      })
      .toFile(outputPath);
    
    const originalSize = statSync(inputPath).size;
    const newSize = statSync(outputPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`✓ ${basename(inputPath)} → ${basename(outputPath)} (${savings}% smaller)`);
    
    return { success: true, savings };
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function optimizeAllImages() {
  try {
    console.log('Starting image optimization...\n');
    
    const files = await readdir(PERFORMERS_DIR);
    const imageFiles = files.filter(file => {
      const ext = extname(file).toLowerCase();
      return (ext === '.jpg' || ext === '.jpeg' || ext === '.png') && 
             file.toLowerCase() !== 'nophoto.png'; // Skip nophoto.png
    });
    
    console.log(`Found ${imageFiles.length} images to optimize\n`);
    
    let successCount = 0;
    let failCount = 0;
    let totalOriginalSize = 0;
    let totalNewSize = 0;
    
    for (const file of imageFiles) {
      const inputPath = join(PERFORMERS_DIR, file);
      const fileName = basename(file, extname(file));
      const outputPath = join(PERFORMERS_DIR, `${fileName}.webp`);
      
      // Skip if webp already exists
      if (existsSync(outputPath)) {
        console.log(`⊘ ${file} → ${fileName}.webp (already exists, skipping)`);
        continue;
      }
      
      const result = await optimizeImage(inputPath, outputPath);
      
      if (result.success) {
        successCount++;
        totalOriginalSize += statSync(inputPath).size;
        totalNewSize += statSync(outputPath).size;
      } else {
        failCount++;
      }
    }
    
    console.log(`\n=== Optimization Complete ===`);
    console.log(`✓ Successfully optimized: ${successCount}`);
    console.log(`✗ Failed: ${failCount}`);
    if (totalOriginalSize > 0) {
      const totalSavings = ((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1);
      const originalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
      const newMB = (totalNewSize / 1024 / 1024).toFixed(2);
      console.log(`📦 Original size: ${originalMB} MB`);
      console.log(`📦 Optimized size: ${newMB} MB`);
      console.log(`💾 Total savings: ${totalSavings}%`);
    }
    
  } catch (error) {
    console.error('Error reading directory:', error);
    process.exit(1);
  }
}

optimizeAllImages();

