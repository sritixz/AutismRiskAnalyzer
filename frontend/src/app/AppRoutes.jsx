import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ScreeningWizard from "../pages/screening/ScreeningWizard";
import ResultsDashboard from "../pages/dashboard/ResultsDashboard";

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/screening/*"
          element={
            <ProtectedRoute>
              <ScreeningWizard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/:screeningId"
          element={
            <ProtectedRoute>
              <ResultsDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;
