import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import Button from "./Button";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="border-b border-calm-100 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to={ROUTES.HOME}
          className="text-lg font-semibold text-brand-700"
        >
          Early Steps Screening
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-calm-600 sm:inline">
                Hi, {user?.childName ? `${user.childName}'s parent` : "there"}
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-medium text-calm-800 hover:text-brand-600"
              >
                Log in
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button>Get started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
