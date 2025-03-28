import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request } from "express";
import Token from "../models/Token";
import { ValidationError } from "./types";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

function generateJWT(payload: object, expiresIn: any) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function generateAccessToken(id: string, deviceId: string) {
  return generateJWT({ id, deviceId }, "10m");
}

export function generateRefreshToken(id: string, deviceId: string) {
  return generateJWT({ id, deviceId }, "7d");
}

const validateString = (value: string, fieldName: string): ValidationError | null => {
  if (typeof value !== "string") {
    return { code: 422, error: `${fieldName} must be a string` };
  }
  return null;
};

export function validateCredentials(id: string, password: string, deviceId: string): ValidationError | null {
  if (!id || !password) {
    return { code: 400, error: "ID and password are required" };
  }

  if (!deviceId) {
    return { code: 400, error: "deviceId is required" };
  }

  const idError = validateString(id, "ID");
  if (idError) return idError;

  const passwordError = validateString(password, "Password");
  if (passwordError) return passwordError;

  const deviceIdError = validateString(deviceId, "deviceId");
  if (deviceIdError) return deviceIdError;

  return null;
}

function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { valid: true, decoded };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return { valid: false, reason: "expired" };
    }
    return { valid: false, reason: "invalid" };
  }
}

export function getAccessToken(req: Request) {
  return req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];
}

export async function decodeAccessToken(accessToken: string) {
  const result = verifyToken(accessToken);
  if (!result.valid) return { valid: false, error: result.reason === "expired" ? "Access token expired" : "Invalid access token" };

  const savedToken = await Token.findOne({ where: { accessToken } });
  if (!savedToken) return { valid: false, error: "Invalid access token" };

  const decoded = result.decoded as Record<string, any>;
  return { valid: true, id: decoded.id, deviceId: decoded.deviceId };
}

export async function decodeRefreshToken(refreshToken: string) {
  const result = verifyToken(refreshToken);
  if (!result.valid) return { valid: false, error: result.reason === "expired" ? "Refresh token expired" : "Invalid refresh token" };

  const savedToken = await Token.findOne({ where: { refreshToken } });
  if (!savedToken) return { valid: false, error: "Invalid refresh token" };

  const decoded = result.decoded as Record<string, any>;
  return { valid: true, id: decoded.id, deviceId: decoded.deviceId };
}
