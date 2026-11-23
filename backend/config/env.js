import "dotenv/config";

const required = [
  "JWT_SECRET",
  "DATABASE_URL",
  "DIRECT_URL",
  "CLIENT_URL",
  "CORS_ORIGINS",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
];

export const validateEnvironment = () => {
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};
