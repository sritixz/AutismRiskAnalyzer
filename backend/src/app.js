import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import screeningRoutes from "./routes/screeningRoutes.js";

const app = express();

// ---- Core middleware ----

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ---- Health check ----

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Autism Risk Analyzer API is running.",
  });
});

// ---- Routes ----

app.use("/api/auth", authRoutes);
app.use("/api/screening", screeningRoutes);

// ---- 404 handler (no route matched) ----

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ---- Centralized error handler ----
// Catches anything passed to next(err), plus body-parser/JSON syntax
// errors, so individual controllers don't need their own catch-all.
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Malformed JSON body from express.json()
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON in request body.",
    });
  }

  // Mongoose invalid ObjectId (e.g. bad :screeningId param)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred on the server.",
  });
});

export default app;
