import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import WizardLayout from "../../components/wizard/WizardLayout";
import NavigationButtons from "../../components/wizard/NavigationButtons";
import UploadZone from "../../components/upload/UploadZone";
import VideoPreview from "../../components/upload/VideoPreview";
import UploadProgress from "../../components/upload/UploadProgress";
import { useUpload } from "../../hooks/useUpload";
import { ScreeningContext } from "../../context/ScreeningContext";
import { notify } from "../../components/common/Toast";
import { ROUTES, WIZARD_STEPS } from "../../utils/constants";

const VideoUpload = () => {
  const navigate = useNavigate();
  const screening = useContext(ScreeningContext);
  const {
    file,
    selectFile,
    clearFile,
    validationError,
    progress,
    isUploading,
    uploadError,
    isComplete,
    upload,
  } = useUpload(screening?.screeningId);

  const handleNext = async () => {
    if (!file) {
      notify.error("Please select a video to continue.");
      return;
    }

    try {
      await upload();
      notify.success("Video uploaded — analysis has started.");
      const screeningId = screening.screeningId;
      screening.clearDraft();
      navigate(ROUTES.DASHBOARD.replace(":screeningId", screeningId));
    } catch {
      // uploadError state already set by the hook; nothing further needed.
    }
  };

  return (
    <WizardLayout currentStep={WIZARD_STEPS.UPLOAD}>
      <h2 className="text-xl font-semibold text-calm-800">
        Upload a short home video
      </h2>
      <p className="mt-1 text-calm-600">
        A 1–2 minute clip of your child at play is ideal. This helps our
        analysis alongside your questionnaire answers.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {!file ? (
          <UploadZone onFileSelected={selectFile} error={validationError} />
        ) : (
          <VideoPreview
            file={file}
            onRemove={clearFile}
            disabled={isUploading || isComplete}
          />
        )}

        {(isUploading || isComplete) && (
          <UploadProgress progress={progress} isComplete={isComplete} />
        )}

        {uploadError && (
          <p className="text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      <NavigationButtons
        onBack={() => navigate(ROUTES.WIZARD_QUESTIONNAIRE)}
        onNext={handleNext}
        nextLabel="Submit for analysis"
        nextDisabled={!file || isComplete}
        isLoading={isUploading}
      />
    </WizardLayout>
  );
};

export default VideoUpload;
