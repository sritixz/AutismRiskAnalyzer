import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";
import Button from "../components/common/Button";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold text-calm-800 sm:text-4xl">
        A gentle first step in understanding your child's development
      </h1>

      <p className="mt-4 text-lg text-calm-600">
        Combine a short questionnaire with a brief home video to get a
        clear, explainable developmental screening — designed to be
        supportive, not alarming.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link to={isAuthenticated ? ROUTES.WIZARD_CHILD_INFO : ROUTES.REGISTER}>
          <Button>Start a screening</Button>
        </Link>
        {!isAuthenticated && (
          <Link to={ROUTES.LOGIN}>
            <Button variant="secondary">I already have an account</Button>
          </Link>
        )}
      </div>

      <p className="mt-10 text-sm text-calm-600">
        This is a screening aid, not a diagnostic tool, and does not
        replace professional medical evaluation.
      </p>
    </div>
  );
};

export default Home;
