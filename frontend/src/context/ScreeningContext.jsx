import { createContext, useState, useEffect, useCallback } from "react";
import { getItem, setItem, removeItem } from "../utils/localStorageHelper";
import { STORAGE_KEYS, WIZARD_STEPS } from "../utils/constants";

export const ScreeningContext = createContext(null);

const DEFAULT_DRAFT = {
  currentStep: WIZARD_STEPS.CHILD_INFO,
  screeningId: null, // set once the questionnaire is submitted and a Screening doc exists
  questionnaireAnswers: {}, // { questionKey: boolean }
  totalScore: null,
};

export const ScreeningProvider = ({ children }) => {
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load any in-progress draft on mount, so refreshing mid-wizard
  // doesn't wipe out answers the parent already gave.
  useEffect(() => {
    const stored = getItem(STORAGE_KEYS.SCREENING_DRAFT);
    if (stored) {
      setDraft({ ...DEFAULT_DRAFT, ...stored });
    }
    setIsHydrated(true);
  }, []);

  // Persist on every change, once initial hydration has happened (avoids
  // overwriting a real stored draft with the default state during the
  // brief window before useEffect above runs).
  useEffect(() => {
    if (isHydrated) {
      setItem(STORAGE_KEYS.SCREENING_DRAFT, draft);
    }
  }, [draft, isHydrated]);

  const setStep = useCallback((step) => {
    setDraft((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setAnswer = useCallback((questionKey, value) => {
    setDraft((prev) => ({
      ...prev,
      questionnaireAnswers: {
        ...prev.questionnaireAnswers,
        [questionKey]: value,
      },
    }));
  }, []);

  const setScreeningId = useCallback((screeningId) => {
    setDraft((prev) => ({ ...prev, screeningId }));
  }, []);

  const setTotalScore = useCallback((totalScore) => {
    setDraft((prev) => ({ ...prev, totalScore }));
  }, []);

  // Called once a full screening (questionnaire + video) is submitted
  // and the parent has moved on to viewing results — clears the draft
  // so starting a new screening later doesn't resurrect stale answers.
  const clearDraft = useCallback(() => {
    removeItem(STORAGE_KEYS.SCREENING_DRAFT);
    setDraft(DEFAULT_DRAFT);
  }, []);

  const value = {
    ...draft,
    isHydrated,
    setStep,
    setAnswer,
    setScreeningId,
    setTotalScore,
    clearDraft,
  };

  return (
    <ScreeningContext.Provider value={value}>
      {children}
    </ScreeningContext.Provider>
  );
};
