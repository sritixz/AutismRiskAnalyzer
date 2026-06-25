import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ScreeningContext } from "../../context/ScreeningContext";
import ChildInfo from "./ChildInfo";
import Questionnaire from "./Questionnaire";
import VideoUpload from "./VideoUpload";
import Loader from "../../components/common/Loader";
import { ROUTES } from "../../utils/constants";

/**
 * Guards the Upload step: a screeningId only exists once the
 * questionnaire has been successfully submitted (see useQuestionnaire's
 * submit()), so jumping straight to /screening/upload without that
 * would crash the upload call. Redirect back to the questionnaire
 * instead.
 */
const RequireScreeningId = ({ children }) => {
  const screening = useContext(ScreeningContext);

  if (!screening?.isHydrated) {
    return <Loader label="Loading your screening..." />;
  }

  if (!screening.screeningId) {
    return <Navigate to={ROUTES.WIZARD_QUESTIONNAIRE} replace />;
  }

  return children;
};

const ScreeningWizard = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="child-info" replace />} />
      <Route path="child-info" element={<ChildInfo />} />
      <Route path="questionnaire" element={<Questionnaire />} />
      <Route
        path="upload"
        element={
          <RequireScreeningId>
            <VideoUpload />
          </RequireScreeningId>
        }
      />
    </Routes>
  );
};

export default ScreeningWizard;
