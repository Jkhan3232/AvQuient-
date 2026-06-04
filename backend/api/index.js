import app from "../src/app.js";
import { getCorsHeaders } from "../src/config/cors.js";
import connectDB from "../src/config/db.js";

let dbConnectionPromise;

const applyCorsHeaders = (req, res) => {
  const corsHeaders = getCorsHeaders(req.headers.origin);

  if (!corsHeaders) {
    return false;
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  return true;
};

const handler = async (req, res) => {
  applyCorsHeaders(req, res);

  // Let CORS preflight requests return immediately without waiting on DB.
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }

  await dbConnectionPromise;
  return app(req, res);
};

export default handler;
