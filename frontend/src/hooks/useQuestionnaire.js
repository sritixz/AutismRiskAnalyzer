import { useState, useCallback } from "react";
import { useContext } from "react";
import { ScreeningContext } from "../context/ScreeningContext";
import * as screeningApi from "../api/screeningApi";

/**
 * ============================================================================
 * PLACEHOLDER QUESTION SET — DO NOT USE WITH REAL USERS AS-IS
 * ============================================================================
 * These 20 questions are generic stand-ins for UI/wizard development only.
 * The M-CHAT-R/F is a copyrighted, validated clinical instrument that its
 * authors require be used "in its entirety and with no modifications"
 * (see mchatscreen.com for the official, licensed item text and the
 * required Follow-Up interview protocol for medium-risk results).
 *
 * Before this touches a real parent/child:
 *   1. Replace `text` below with the official M-CHAT-R/F item wording.
 *   2. Set `atRiskAnswer` per item — for the real instrument, every item
 *      is "no" = at-risk EXCEPT items 2, 5, and 12, which are "yes" = at-risk.
 *      The keys/order below are placeholders and do NOT correspond to the
 *      real M-CHAT-R/F item numbering — re-derive this mapping from the
 *      official source, not from this file.
 *   3. Get the final mapping reviewed by a clinician before launch.
 * ============================================================================
 */
const QUESTION_SET = Array.from({ length: 20 }, (_, i) => ({
  key: `q${i + 1}`,
  text: `Placeholder developmental question ${i + 1} — replace with licensed M-CHAT-R/F item text.`,
  // For the real instrument this varies per item (see warning above).
  // Defaulting all to "no" here is a stand-in, not a clinical claim.
  atRiskAnswer: false,
}));

export const useQuestionnaire = () => {
  const screeningContext = useContext(ScreeningContext);

  if (!screeningContext) {
    throw new Error(
      "useQuestionnaire must be used within a ScreeningProvider"
    );
  }

  const { questionnaireAnswers, setAnswer, setScreeningId, setTotalScore } =
    screeningContext;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const currentQuestion = QUESTION_SET[currentIndex];
  const totalQuestions = QUESTION_SET.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  const answerCurrent = useCallback(
    (value) => {
      setAnswer(currentQuestion.key, value);
    },
    [currentQuestion, setAnswer]
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  }, [totalQuestions]);

  const goBack = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const allQuestionsAnswered = QUESTION_SET.every(
    (q) => questionnaireAnswers[q.key] !== undefined
  );

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await screeningApi.submitQuestionnaire(
        questionnaireAnswers
      );
      const { screeningId, totalScore } = response.data;
      setScreeningId(screeningId);
      setTotalScore(totalScore);
      return response;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong submitting the questionnaire. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [questionnaireAnswers, setScreeningId, setTotalScore]);

  return {
    questions: QUESTION_SET,
    currentQuestion,
    currentIndex,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    answers: questionnaireAnswers,
    answerCurrent,
    goNext,
    goBack,
    allQuestionsAnswered,
    submit,
    isSubmitting,
    error,
  };
};
