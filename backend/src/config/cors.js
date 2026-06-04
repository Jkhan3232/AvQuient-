const parseList = (...values) =>
  values
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

const allowedOrigins = new Set(
  parseList(
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "https://avquient.pages.dev",
  ),
);

const allowedOriginPatterns = parseList(process.env.CORS_ORIGIN_PATTERNS).map(
  (pattern) => new RegExp(pattern),
);

export const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  return (
    allowedOrigins.has(origin) ||
    allowedOriginPatterns.some((pattern) => pattern.test(origin))
  );
};

export const getCorsHeaders = (origin) => {
  if (!isOriginAllowed(origin)) {
    return null;
  }

  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
};
