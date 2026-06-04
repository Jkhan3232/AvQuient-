import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import logger from "./config/logger.js";
import { isOriginAllowed } from "./config/cors.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    const error = new Error(`CORS blocked origin: ${origin}`);
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const morganStream = {
  write: (message) => logger.info(message.trim()),
};

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: morganStream,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  logger.info("Health check route accessed");
  res.status(200).json({
    success: true,
    message: "Task Management API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
