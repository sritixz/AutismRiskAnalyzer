import mongoose from "mongoose";

const screeningSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    questionnaireAnswers: {
      answers: {
        type: Map,
        of: Boolean,
        default: {}
      },

      totalScore: {
        type: Number,
        default: 0
      }
    },

    videoMetadata: {
      originalFilename: {
        type: String,
        default: ""
      },

      storageUrl: {
        type: String,
        default: ""
      },

      fileSize: {
        type: Number,
        default: 0
      },

      mimeType: {
        type: String,
        default: ""
      },

      uploadedAt: {
        type: Date
      },

      processingStatus: {
        type: String,
        enum: [
          "Pending",
          "Processing",
          "Completed",
          "Failed"
        ],
        default: "Pending"
      }
    },

    results: {
      aiRiskScore: {
        type: Number,
        min: 0,
        max: 1,
        default: null
      },

      detectedAnomalies: [
        {
          type: String
        }
      ],

      gradCamOverlayUrl: {
        type: String,
        default: ""
      },

      summaryMessage: {
        type: String,
        default: ""
      },

      generatedAt: {
        type: Date
      }
    }
  },
  {
    timestamps: true
  }
);

const Screening = mongoose.model(
  "Screening",
  screeningSchema
);

export default Screening;
