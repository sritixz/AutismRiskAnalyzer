import Stepper from "./Stepper";

const WizardLayout = ({ currentStep, children }) => {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Stepper currentStep={currentStep} />

      <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default WizardLayout;
