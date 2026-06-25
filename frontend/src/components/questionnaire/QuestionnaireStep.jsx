import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import NavigationButtons from "../wizard/NavigationButtons";

const QuestionnaireStep = ({
  currentQuestion,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onBack,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <ProgressBar current={currentIndex + 1} total={totalQuestions} />

      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswer={onAnswer}
      />

      <NavigationButtons
        onBack={onBack}
        onNext={onNext}
        hideBack={isFirstQuestion}
        nextLabel={isLastQuestion ? "Finish" : "Next"}
        nextDisabled={selectedAnswer === undefined}
        isLoading={isLastQuestion && isSubmitting}
      />
    </div>
  );
};

export default QuestionnaireStep;
