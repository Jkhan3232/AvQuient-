import app from "../src/app.js";
import connectDB from "../src/config/db.js";

let dbConnectionPromise;

const handler = async (req, res) => {
  // Let CORS preflight requests return immediately without waiting on DB.
  if (req.method === "OPTIONS") {
    return app(req, res);
  }

  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }

  await dbConnectionPromise;
  return app(req, res);
};

export default handler;
