// Helper function to normalize performer name for photo matching
export function normalizePerformerNameForPhoto(name: string): string {
  // Remove accents and special characters, convert to lowercase
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]/g, ''); // Remove all non-alphanumeric
}

