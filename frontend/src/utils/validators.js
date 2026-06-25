import { UPLOAD_CONSTRAINTS } from "./constants";

export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email is required.";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) return "Enter a valid email address.";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  // Mirrors the >= 8 character check in backend/src/controllers/authController.js
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
};

export const validateChildName = (name) => {
  if (!name || !name.trim()) return "Child's name is required.";
  return null;
};

/**
 * Mirrors the min/max in backend/src/models/User.js childAgeMonths field
 * (24-36 months). Keep these two in sync if the schema ever changes.
 */
export const validateChildAgeMonths = (ageMonths) => {
  const value = Number(ageMonths);

  if (ageMonths === "" || ageMonths === null || ageMonths === undefined) {
    return "Child's age in months is required.";
  }

  if (Number.isNaN(value)) return "Age must be a number.";

  if (value < 24 || value > 36) {
    return "This screener is intended for children 24–36 months old.";
  }

  return null;
};

/**
 * Mirrors backend/src/middleware/uploadMiddleware.js exactly (extension +
 * MIME type allowlist, max size). Validating here lets us reject an
 * obviously-bad file before spending bandwidth uploading it, but the
 * backend check is still the authoritative one — never trust this alone.
 */
export const validateVideoFile = (file) => {
  if (!file) return "Please select a video file.";

  const extension = `.${file.name.split(".").pop().toLowerCase()}`;
  const extensionOk =
    UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension);
  const mimeOk = UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.type);

  if (!extensionOk || !mimeOk) {
    return "Only MP4 or MOV video files are accepted.";
  }

  if (file.size > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
    return "Video file is too large. Maximum size is 250MB.";
  }

  return null;
};
