// Helper function to normalize photo filenames to match performer names
export function normalizePhotoName(filename: string): string {
  // Remove extension
  const name = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  
  // Remove common suffixes like (1), @, etc.
  let normalized = name.replace(/\([0-9]+\)/g, '').replace(/@/g, '').trim();
  
  // Convert to lowercase and remove spaces/hyphens/special chars
  normalized = normalized.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return normalized;
}

// Helper function to normalize performer name for photo matching
export function normalizePerformerNameForPhoto(name: string): string {
  // Remove accents and special characters, convert to lowercase
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]/g, ''); // Remove all non-alphanumeric
}

// Map photo filename to performer photo import
export function getPhotoPath(filename: string): string {
  // Import photos dynamically - Vite will handle this
  return `/src/assets/images/performers/${filename}`;
}

