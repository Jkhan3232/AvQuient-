import logger from "../config/logger.js";

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || res.statusCode;
  let message = err.message || "Server error.";
  let errors = err.errors;

  if (!statusCode || statusCode < 400) {
    statusCode = 500;
  }

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found.";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
    errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field.charAt(0).toUpperCase()}${field.slice(1)} already exists.`;
  }

  const response = {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  logger.error(message, {
    statusCode,
    method: _req.method,
    url: _req.originalUrl,
    ip: _req.ip,
    stack: err.stack,
  });

  res.status(statusCode).json(response);
};
