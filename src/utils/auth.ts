import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

function generateJWT(payload: object, expiresIn: any) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function generateAccessToken(id: string) {
  return generateJWT({ id }, "10m");
}

export function generateRefreshToken(id: string) {
  return generateJWT({ id }, "7d");
}

export function verifyRefreshToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, SECRET_KEY);
    return { valid: true, decoded };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return { valid: false, reason: "expired" };
    }
    return { valid: false, reason: "invalid" };
  }
}

export function validateCredentials(id: string, password: string) {
  if (!id || !password) {
    return { error: "ID and password are required" };
  }

  if (typeof id !== "string" || typeof password !== "string") {
    return { error: "ID and password must be a string" };
  }

  return null;
}
