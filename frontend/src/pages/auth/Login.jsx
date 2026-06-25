import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail, validatePassword } from "../../utils/validators";
import { notify } from "../../components/common/Toast";
import { ROUTES } from "../../utils/constants";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [parentEmail, setParentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || ROUTES.WIZARD_CHILD_INFO;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(parentEmail);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ parentEmail: emailError, password: passwordError });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await login({ parentEmail, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to log in. Please try again.";
      notify.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your child's screening."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="parentEmail"
          label="Email"
          type="email"
          required
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
          error={errors.parentEmail}
          placeholder="you@example.com"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-calm-600">
        Don't have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
