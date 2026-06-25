import Button from "../common/Button";

const NavigationButtons = ({
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next",
  nextDisabled = false,
  isLoading = false,
  hideBack = false,
}) => {
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {!hideBack ? (
        <Button variant="secondary" onClick={onBack} disabled={isLoading}>
          {backLabel}
        </Button>
      ) : (
        <span />
      )}

      <Button onClick={onNext} disabled={nextDisabled} isLoading={isLoading}>
        {nextLabel}
      </Button>
    </div>
  );
};

export default NavigationButtons;
