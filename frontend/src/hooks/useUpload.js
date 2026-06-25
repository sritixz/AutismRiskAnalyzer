import { useState, useCallback } from "react";
import * as screeningApi from "../api/screeningApi";
import { validateVideoFile } from "../utils/validators";

export const useUpload = (screeningId) => {
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const selectFile = useCallback((selectedFile) => {
    const error = validateVideoFile(selectedFile);

    if (error) {
      setValidationError(error);
      setFile(null);
      return;
    }

    setValidationError(null);
    setFile(selectedFile);
    setIsComplete(false);
    setUploadError(null);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setValidationError(null);
    setProgress(0);
    setIsComplete(false);
    setUploadError(null);
  }, []);

  const upload = useCallback(async () => {
    if (!file) {
      setUploadError("Please select a video file first.");
      return;
    }

    if (!screeningId) {
      setUploadError(
        "Missing screening reference — please complete the questionnaire step first."
      );
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setProgress(0);

    try {
      const response = await screeningApi.uploadScreeningVideo(
        screeningId,
        file,
        (percent) => setProgress(percent)
      );
      setIsComplete(true);
      return response;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong uploading the video. Please try again.";
      setUploadError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [file, screeningId]);

  return {
    file,
    selectFile,
    clearFile,
    validationError,
    progress,
    isUploading,
    uploadError,
    isComplete,
    upload,
  };
};
