/**
 * Formats a questionnaire total score (0-20) into a risk-band label.
 *
 * IMPORTANT: This does NOT calculate risk — it only labels a score that
 * has already been calculated and returned by the backend. The actual
 * scoring logic (which answers count as "at-risk") must live in
 * backend/src/controllers/screeningController.js and be reviewed against
 * the official M-CHAT-R/F scoring key before this app is used with real
 * data. See the scoring band reference below.
 *
 * Official M-CHAT-R/F bands: 0-2 Low, 3-7 Medium, 8-20 High.
 */
export const formatQuestionnaireRiskBand = (totalScore) => {
  if (totalScore === null || totalScore === undefined) {
    return { label: "Not yet scored", colorVar: "var(--color-calm-600)" };
  }

  if (totalScore <= 2) {
    return { label: "Low concern", colorVar: "var(--color-concern-low)" };
  }

  if (totalScore <= 7) {
    return {
      label: "Medium concern — follow-up recommended",
      colorVar: "var(--color-concern-moderate)",
    };
  }

  return {
    label: "Elevated concern — further evaluation recommended",
    colorVar: "var(--color-concern-elevated)",
  };
};

/**
 * Formats the AI model's risk score (0.0–1.0) into a readable label.
 * Like the function above, this only labels a number the backend/ML
 * service already computed — it does not compute anything itself.
 */
export const formatAiRiskScore = (aiRiskScore) => {
  if (aiRiskScore === null || aiRiskScore === undefined) {
    return { label: "Analysis pending", percent: null };
  }

  const percent = Math.round(aiRiskScore * 100);

  let label = "Low concern";
  if (aiRiskScore > 0.66) {
    label = "Elevated concern";
  } else if (aiRiskScore > 0.33) {
    label = "Medium concern";
  }

  return { label, percent };
};

export const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatChildAge = (ageMonths) => {
  if (ageMonths === null || ageMonths === undefined) return "";
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  if (years === 0) return `${months} month${months === 1 ? "" : "s"}`;
  if (months === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years}y ${months}m`;
};
