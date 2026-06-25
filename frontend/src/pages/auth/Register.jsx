import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import {
  validateEmail,
  validatePassword,
  validateChildName,
  validateChildAgeMonths,
} from "../../utils/validators";
import { notify } from "../../components/common/Toast";
import { ROUTES } from "../../utils/constants";

const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    parentEmail: "",
    password: "",
    childName: "",
    childAgeMonths: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      parentEmail: validateEmail(form.parentEmail),
      password: validatePassword(form.password),
      childName: validateChildName(form.childName),
      childAgeMonths: validateChildAgeMonths(form.childAgeMonths),
    };

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await signup({
        ...form,
        childAgeMonths: Number(form.childAgeMonths),
      });
      navigate(ROUTES.WIZARD_CHILD_INFO, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to create your account. Please try again.";
      notify.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Just a few details to get started — this takes less than a minute."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="parentEmail"
          label="Your email"
          type="email"
          required
          value={form.parentEmail}
          onChange={handleChange("parentEmail")}
          error={errors.parentEmail}
          placeholder="you@example.com"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
          placeholder="At least 8 characters"
        />

        <Input
          id="childName"
          label="Child's name"
          required
          value={form.childName}
          onChange={handleChange("childName")}
          error={errors.childName}
          placeholder="e.g. Maya"
        />

        <Input
          id="childAgeMonths"
          label="Child's age (in months)"
          type="number"
          required
          min={24}
          max={36}
          value={form.childAgeMonths}
          onChange={handleChange("childAgeMonths")}
          error={errors.childAgeMonths}
          placeholder="24–36"
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-calm-600">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
