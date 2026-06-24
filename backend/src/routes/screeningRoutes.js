import express from "express";
import {
  submitQuestionnaire,
  uploadScreeningVideo,
  receiveProcessingResults,
  getScreeningById,
  listScreenings,
} from "../controllers/screeningController.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleVideoUpload } from "../middleware/uploadMiddleware.js";
import { verifyInternalService } from "../middleware/internalServiceMiddleware.js";

const router = express.Router();

// ---- Parent-facing routes (require a logged-in parent JWT) ----

router.get("/", protect, listScreenings);
router.get("/:screeningId", protect, getScreeningById);

router.post("/questionnaire", protect, submitQuestionnaire);

router.post(
  "/upload/:screeningId",
  protect,
  handleVideoUpload,
  uploadScreeningVideo
);

// ---- Internal route (FastAPI ML service -> Node, shared-secret auth) ----
// Deliberately NOT behind `protect`, since the ML service has no parent JWT.

router.post(
  "/webhook/results",
  verifyInternalService,
  receiveProcessingResults
);

export default router;
