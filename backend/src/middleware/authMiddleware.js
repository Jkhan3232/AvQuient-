import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Not authorized. Token is missing.");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      const error = new Error("Not authorized. User no longer exists.");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.statusCode) {
      throw err;
    }

    const error = new Error("Not authorized. Token is invalid or expired.");
    error.statusCode = 401;
    throw error;
  }
});

export default protect;
