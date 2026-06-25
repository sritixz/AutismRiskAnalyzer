import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-50 px-6 py-12">
      <Link
        to={ROUTES.HOME}
        className="mb-8 text-xl font-semibold text-brand-700"
      >
        Early Steps Screening
      </Link>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        {title && (
          <h1 className="text-2xl font-semibold text-calm-800">{title}</h1>
        )}
        {subtitle && <p className="mt-2 text-calm-600">{subtitle}</p>}

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
