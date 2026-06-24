import path from "path";
import Screening from "../models/Screening.js";
import { notifyProcessingService } from "../services/fastApiService.js";

/**
 * @route   POST /api/screening/questionnaire
 * @desc    Submit parent questionnaire answers (M-CHAT-R/F style),
 *          calculate the total score, and persist a new screening record.
 * @access  Private
 */
const submitQuestionnaire = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message:
          "answers must be an object mapping question keys to boolean (Yes/No) responses.",
      });
    }

    const answerEntries = Object.entries(answers);

    if (answerEntries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one questionnaire answer is required.",
      });
    }

    // Validate every value is strictly boolean before scoring.
    // M-CHAT-R/F scoring: most items score 1 point on a "risk" answer.
    // The exact at-risk direction per item should be defined by a
    // clinically-reviewed scoring key, not inferred here — this is a
    // generic placeholder that simply sums "true" responses. Replace
    // SCORING_KEY logic once clinical sign-off is in place.
    let totalScore = 0;
    const sanitizedAnswers = {};

    for (const [question, value] of answerEntries) {
      if (typeof value !== "boolean") {
        return res.status(400).json({
          success: false,
          message: `Answer for "${question}" must be a boolean (true/false).`,
        });
      }

      sanitizedAnswers[question] = value;

      if (value === true) {
        totalScore += 1;
      }
    }

    const screening = await Screening.create({
      userId: req.user._id,
      questionnaireAnswers: {
        answers: sanitizedAnswers,
        totalScore,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Questionnaire submitted successfully.",
      data: {
        screeningId: screening._id,
        totalScore,
      },
    });
  } catch (error) {
    console.error("Submit Questionnaire Error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving the questionnaire.",
    });
  }
};

/**
 * @route   POST /api/screening/upload/:screeningId
 * @desc    Accept a validated video upload (handled by uploadMiddleware),
 *          attach its metadata to an existing screening record, set status
 *          to 'Pending', and notify the FastAPI processing service.
 * @access  Private
 *
 * Expects uploadMiddleware (handleVideoUpload) to have already run,
 * populating req.file with the saved disk file.
 */
const uploadScreeningVideo = async (req, res) => {
  try {
    const { screeningId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file was received.",
      });
    }

    const screening = await Screening.findOne({
      _id: screeningId,
      userId: req.user._id,
    });

    if (!screening) {
      return res.status(404).json({
        success: false,
        message: "Screening record not found for this user.",
      });
    }

    screening.videoMetadata = {
      originalFilename: req.file.originalname,
      // storageUrl is a local path placeholder today; swap for an S3 key/URL
      // when migrating to cloud storage.
      storageUrl: path.join("uploads", "screenings", req.file.filename),
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date(),
      processingStatus: "Pending",
    };

    await screening.save();

    // Fire-and-forget style notification to the ML service. Failure to
    // reach the ML service should not fail the upload itself — the video
    // is safely stored and can be retried/reprocessed later.
    notifyProcessingService(screening._id.toString(), screening.videoMetadata.storageUrl)
      .catch((err) => {
        console.error("FastAPI Notify Error:", err.message);
      });

    return res.status(200).json({
      success: true,
      message: "Video uploaded successfully and queued for processing.",
      data: {
        screeningId: screening._id,
        videoMetadata: screening.videoMetadata,
      },
    });
  } catch (error) {
    console.error("Upload Screening Video Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while uploading the video.",
    });
  }
};

/**
 * @route   POST /api/screening/webhook/results
 * @desc    Internal webhook for the Python FastAPI ML service to push
 *          completed (or failed) analysis results back to the Node API.
 * @access  Internal (should be locked down via a shared secret/header
 *          in production — see note below)
 */
const receiveProcessingResults = async (req, res) => {
  try {
    // NOTE: In production, verify a shared secret header (e.g.
    // x-internal-service-key) here before trusting this payload, since
    // this route is not protected by the standard user JWT middleware.
    const {
      screeningId,
      status, // 'Completed' | 'Failed'
      aiRiskScore,
      detectedAnomalies,
      gradCamOverlayUrl,
      summaryMessage,
    } = req.body;

    if (!screeningId || !status) {
      return res.status(400).json({
        success: false,
        message: "screeningId and status are required.",
      });
    }

    const screening = await Screening.findById(screeningId);

    if (!screening) {
      return res.status(404).json({
        success: false,
        message: "Screening record not found.",
      });
    }

    screening.videoMetadata.processingStatus = status;

    if (status === "Completed") {
      screening.results = {
        aiRiskScore: typeof aiRiskScore === "number" ? aiRiskScore : null,
        detectedAnomalies: Array.isArray(detectedAnomalies)
          ? detectedAnomalies
          : [],
        gradCamOverlayUrl: gradCamOverlayUrl || "",
        summaryMessage: summaryMessage || "",
        generatedAt: new Date(),
      };
    }

    await screening.save();

    return res.status(200).json({
      success: true,
      message: "Screening results updated.",
    });
  } catch (error) {
    console.error("Receive Processing Results Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving the processing results.",
    });
  }
};

/**
 * @route   GET /api/screening/:screeningId
 * @desc    Fetch a single screening (questionnaire + video + results)
 *          for the authenticated user's dashboard view.
 * @access  Private
 */
const getScreeningById = async (req, res) => {
  try {
    const { screeningId } = req.params;

    const screening = await Screening.findOne({
      _id: screeningId,
      userId: req.user._id,
    });

    if (!screening) {
      return res.status(404).json({
        success: false,
        message: "Screening record not found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      data: { screening },
    });
  } catch (error) {
    console.error("Get Screening Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the screening.",
    });
  }
};

/**
 * @route   GET /api/screening
 * @desc    List all screenings belonging to the authenticated user,
 *          most recent first.
 * @access  Private
 */
const listScreenings = async (req, res) => {
  try {
    const screenings = await Screening.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: { screenings },
    });
  } catch (error) {
    console.error("List Screenings Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching screenings.",
    });
  }
};

export {
  submitQuestionnaire,
  uploadScreeningVideo,
  receiveProcessingResults,
  getScreeningById,
  listScreenings,
};
