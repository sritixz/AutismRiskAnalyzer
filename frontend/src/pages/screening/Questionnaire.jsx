import { useNavigate } from "react-router-dom";
import WizardLayout from "../../components/wizard/WizardLayout";
import QuestionnaireStep from "../../components/questionnaire/QuestionnaireStep";
import { useQuestionnaire } from "../../hooks/useQuestionnaire";
import { notify } from "../../components/common/Toast";
import { ROUTES, WIZARD_STEPS } from "../../utils/constants";

const Questionnaire = () => {
  const navigate = useNavigate();
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    answerCurrent,
    goNext,
    goBack,
    isFirstQuestion,
    isLastQuestion,
    submit,
    isSubmitting,
  } = useQuestionnaire();

  const selectedAnswer = answers[currentQuestion.key];

  const handleBack = () => {
    if (isFirstQuestion) {
      navigate(ROUTES.WIZARD_CHILD_INFO);
    } else {
      goBack();
    }
  };

  const handleNext = async () => {
    if (selectedAnswer === undefined) return;

    if (isLastQuestion) {
      try {
        await submit();
        navigate(ROUTES.WIZARD_UPLOAD);
      } catch {
        notify.error(
          "We couldn't save the questionnaire. Please try again."
        );
      }
    } else {
      goNext();
    }
  };

  return (
    <WizardLayout currentStep={WIZARD_STEPS.QUESTIONNAIRE}>
      <QuestionnaireStep
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        selectedAnswer={selectedAnswer}
        onAnswer={answerCurrent}
        onBack={handleBack}
        onNext={handleNext}
        isFirstQuestion={false}
        isLastQuestion={isLastQuestion}
        isSubmitting={isSubmitting}
      />
    </WizardLayout>
  );
};

export default Questionnaire;
