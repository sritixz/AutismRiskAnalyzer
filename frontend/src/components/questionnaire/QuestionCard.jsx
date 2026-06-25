const QuestionCard = ({ question, selectedAnswer, onAnswer }) => {
  return (
    <div className="flex flex-col items-center gap-8 py-6 text-center">
      <p className="text-xl font-medium text-calm-800">{question.text}</p>

      <div className="flex w-full gap-4">
        <button
          type="button"
          onClick={() => onAnswer(true)}
          aria-pressed={selectedAnswer === true}
          className={`flex-1 rounded-2xl border-2 py-6 text-lg font-semibold transition-colors
            ${
              selectedAnswer === true
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-calm-100 text-calm-800 hover:border-brand-300"
            }`}
        >
          Yes
        </button>

        <button
          type="button"
          onClick={() => onAnswer(false)}
          aria-pressed={selectedAnswer === false}
          className={`flex-1 rounded-2xl border-2 py-6 text-lg font-semibold transition-colors
            ${
              selectedAnswer === false
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-calm-100 text-calm-800 hover:border-brand-300"
            }`}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
