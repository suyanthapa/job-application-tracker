import "dotenv/config";
import express from "express";
import cors from "cors";
import applicationRouter from "./routes/application.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import prisma from "./config/prisma";
import { DatabaseError } from "./utils/errors";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// CORS Configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  }),
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is running." });
});

// Routes (base)
app.use("/api/applications", applicationRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const start = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log(" Database connected.");

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
    });
  } catch (err) {
    console.error(" Failed to start server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();
