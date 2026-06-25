// Base URL for the Express API. Set VITE_API_BASE_URL in .env for
// different environments (local backend vs deployed).
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Keys used for localStorage persistence. Centralized here so a typo
// can't silently create two different storage entries.
export const STORAGE_KEYS = {
  AUTH_TOKEN: "ara_auth_token",
  AUTH_USER: "ara_auth_user",
  SCREENING_DRAFT: "ara_screening_draft",
};

// Route paths, centralized to avoid magic strings scattered across
// <Link> and navigate() calls.
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  WIZARD: "/screening",
  WIZARD_CHILD_INFO: "/screening/child-info",
  WIZARD_QUESTIONNAIRE: "/screening/questionnaire",
  WIZARD_UPLOAD: "/screening/upload",
  DASHBOARD: "/dashboard/:screeningId",
};

// Must mirror backend/src/middleware/uploadMiddleware.js exactly —
// if these drift apart, users will see a "such file accepted" success
// state on a file the backend then rejects.
export const UPLOAD_CONSTRAINTS = {
  ALLOWED_MIME_TYPES: ["video/mp4", "video/quicktime"],
  ALLOWED_EXTENSIONS: [".mp4", ".mov"],
  MAX_FILE_SIZE_BYTES: 250 * 1024 * 1024, // 250MB
};

// Screening processing states — mirrors the enum in
// backend/src/models/Screening.js videoMetadata.processingStatus
export const PROCESSING_STATUS = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

// Wizard step identifiers, in order. Used by Stepper/ScreeningContext
// to know current position and validate forward navigation.
export const WIZARD_STEPS = {
  CHILD_INFO: "child-info",
  QUESTIONNAIRE: "questionnaire",
  UPLOAD: "upload",
};

export const WIZARD_STEP_ORDER = [
  WIZARD_STEPS.CHILD_INFO,
  WIZARD_STEPS.QUESTIONNAIRE,
  WIZARD_STEPS.UPLOAD,
];
