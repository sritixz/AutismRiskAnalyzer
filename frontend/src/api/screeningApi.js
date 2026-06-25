import axiosInstance from "./axios";

/**
 * @param {Record<string, boolean>} answers - question key -> yes/no boolean
 */
export const submitQuestionnaire = async (answers) => {
  const { data } = await axiosInstance.post("/screening/questionnaire", {
    answers,
  });
  return data;
};

/**
 * Uploads a screening video as multipart/form-data.
 * @param {string} screeningId
 * @param {File} videoFile
 * @param {(percent: number) => void} [onProgress] - optional upload progress callback (0-100)
 */
export const uploadScreeningVideo = async (
  screeningId,
  videoFile,
  onProgress
) => {
  const formData = new FormData();
  formData.append("video", videoFile);

  const { data } = await axiosInstance.post(
    `/screening/upload/${screeningId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      },
    }
  );

  return data;
};

export const getScreeningById = async (screeningId) => {
  const { data } = await axiosInstance.get(`/screening/${screeningId}`);
  return data;
};

export const listScreenings = async () => {
  const { data } = await axiosInstance.get("/screening");
  return data;
};
