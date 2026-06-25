import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WizardLayout from "../../components/wizard/WizardLayout";
import NavigationButtons from "../../components/wizard/NavigationButtons";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import * as authApi from "../../api/authApi";
import {
  validateChildName,
  validateChildAgeMonths,
} from "../../utils/validators";
import { notify } from "../../components/common/Toast";
import { ROUTES, WIZARD_STEPS } from "../../utils/constants";

const ChildInfo = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [childName, setChildName] = useState(user?.childName || "");
  const [childAgeMonths, setChildAgeMonths] = useState(
    user?.childAgeMonths ?? ""
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    const nameError = validateChildName(childName);
    const ageError = validateChildAgeMonths(childAgeMonths);

    if (nameError || ageError) {
      setErrors({ childName: nameError, childAgeMonths: ageError });
      return;
    }

    setErrors({});

    // Only hit the API if something actually changed from the stored profile.
    const hasChanges =
      childName !== user?.childName ||
      Number(childAgeMonths) !== user?.childAgeMonths;

    if (hasChanges) {
      setIsSaving(true);
      try {
        await authApi.updateProfile({
          childName,
          childAgeMonths: Number(childAgeMonths),
        });
        await refreshProfile();
      } catch (err) {
        notify.error(
          err.response?.data?.message || "Couldn't save changes. Please try again."
        );
        setIsSaving(false);
        return;
      }
      setIsSaving(false);
    }

    navigate(ROUTES.WIZARD_QUESTIONNAIRE);
  };

  return (
    <WizardLayout currentStep={WIZARD_STEPS.CHILD_INFO}>
      <h2 className="text-xl font-semibold text-calm-800">
        Let's confirm a few details
      </h2>
      <p className="mt-1 text-calm-600">
        This helps us tailor the screening to your child's age.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <Input
          id="childName"
          label="Child's name"
          required
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          error={errors.childName}
        />

        <Input
          id="childAgeMonths"
          label="Child's age (in months)"
          type="number"
          required
          min={24}
          max={36}
          value={childAgeMonths}
          onChange={(e) => setChildAgeMonths(e.target.value)}
          error={errors.childAgeMonths}
        />
      </div>

      <NavigationButtons
        hideBack
        onNext={handleNext}
        isLoading={isSaving}
        nextLabel="Continue"
      />
    </WizardLayout>
  );
};

export default ChildInfo;
