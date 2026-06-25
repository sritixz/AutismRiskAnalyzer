import { WIZARD_STEP_ORDER } from "../../utils/constants";

const STEP_LABELS = {
  "child-info": "Child Info",
  questionnaire: "Questionnaire",
  upload: "Video Upload",
};

const Stepper = ({ currentStep }) => {
  const currentIndex = WIZARD_STEP_ORDER.indexOf(currentStep);

  return (
    <ol className="mx-auto flex w-full max-w-2xl items-center justify-between px-6">
      {WIZARD_STEP_ORDER.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold
                  ${isComplete ? "bg-brand-600 text-white" : ""}
                  ${isCurrent ? "bg-brand-100 text-brand-700 ring-2 ring-brand-500" : ""}
                  ${!isComplete && !isCurrent ? "bg-calm-100 text-calm-600" : ""}
                `}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isComplete ? "✓" : index + 1}
              </div>
              <span className="text-xs font-medium text-calm-600">
                {STEP_LABELS[step]}
              </span>
            </div>

            {index < WIZARD_STEP_ORDER.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  isComplete ? "bg-brand-600" : "bg-calm-100"
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
