import axios from "axios";

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || "http://localhost:8000";

/**
 * Notifies the Python FastAPI ML service that a new video is ready
 * for processing. This is a thin placeholder — the actual ML service
 * isn't built yet, so this just performs the handoff call described
 * in the original spec ("mockup webhook/route to communicate
 * internally with the Python FastAPI service").
 *
 * Expected FastAPI contract (to be finalized when that service exists):
 *   POST {FASTAPI_BASE_URL}/process
 *   { screeningId: string, videoPath: string }
 *
 * @param {string} screeningId - Mongo _id of the Screening document
 * @param {string} videoPath - storage path/URL of the uploaded video
 */
const notifyProcessingService = async (screeningId, videoPath) => {
  try {
    const response = await axios.post(
      `${FASTAPI_BASE_URL}/process`,
      { screeningId, videoPath },
      { timeout: 5000 }
    );

    return response.data;
  } catch (error) {
    // Swallow connection errors here (e.g. ECONNREFUSED while FastAPI
    // service doesn't exist yet) — caller decides how to handle/log it.
    throw new Error(
      `Failed to notify FastAPI service: ${error.message}`
    );
  }
};

export { notifyProcessingService };
