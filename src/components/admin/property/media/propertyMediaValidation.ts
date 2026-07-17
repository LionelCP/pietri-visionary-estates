export const PROPERTY_IMAGE_MAX_SIZE_BYTES = 10 * 1024 * 1024;

export const PROPERTY_IMAGE_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type PropertyImageValidationError = "invalid-type" | "too-large" | "duplicate";

export type PropertyImageValidationResult = {
  valid: File[];
  errors: Array<{ file: File; reason: PropertyImageValidationError; message: string }>;
};

export function validatePropertyImage(file: File) {
  if (!PROPERTY_IMAGE_ACCEPTED_TYPES.includes(file.type as (typeof PROPERTY_IMAGE_ACCEPTED_TYPES)[number])) {
    return {
      reason: "invalid-type" as const,
      message: `${file.name} : format non accepté. Utilisez JPEG, PNG ou WebP.`,
    };
  }

  if (file.size > PROPERTY_IMAGE_MAX_SIZE_BYTES) {
    return {
      reason: "too-large" as const,
      message: `${file.name} : fichier trop volumineux. Limite : 10 Mo.`,
    };
  }

  return null;
}

export function validatePropertyImages(files: File[]): PropertyImageValidationResult {
  const seen = new Set<string>();
  const valid: File[] = [];
  const errors: PropertyImageValidationResult["errors"] = [];

  for (const file of files) {
    const key = getFileKey(file);
    if (seen.has(key)) {
      errors.push({ file, reason: "duplicate", message: `${file.name} : fichier déjà présent dans cette sélection.` });
      continue;
    }
    seen.add(key);

    const error = validatePropertyImage(file);
    if (error) errors.push({ file, ...error });
    else valid.push(file);
  }

  return { valid, errors };
}

function getFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}
