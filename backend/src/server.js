import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // connectDB already handles its own try/catch and process.exit(1)
  // on failure (see config/db.js), so a successful resolve here means
  // we're safe to start accepting traffic.
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });

  // ---- Safety nets ----

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Promise Rejection:", reason);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    server.close(() => process.exit(1));
  });

  // Graceful shutdown on container/orchestrator stop signals
  const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
