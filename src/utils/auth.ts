import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request } from "express";
import Token from "../models/Token";

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

export function validateCredentials(id: string, password: string) {
  if (!id || !password) {
    return { error: "ID and password are required" };
  }

  if (typeof id !== "string" || typeof password !== "string") {
    return { error: "ID and password must be a string" };
  }

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

export async function getAccessTokenId(accessToken: string) {
  const result = verifyToken(accessToken);
  if (!result.valid) return { valid: false, error: result.reason === "expired" ? "Access token expired" : "Invalid access token" };

  const savedToken = await Token.findOne({ where: { accessToken } });
  if (!savedToken) return { valid: false, error: "Invalid access token" };

  return { valid: true, id: (result.decoded as Record<string, any>).id };
}

export async function getRefreshTokenId(refreshToken: string) {
  const result = verifyToken(refreshToken);
  if (!result.valid) return { valid: false, error: result.reason === "expired" ? "Refresh token expired" : "Invalid refresh token" };

  const savedToken = await Token.findOne({ where: { refreshToken } });
  if (!savedToken) return { valid: false, error: "Invalid refresh token" };

  return { valid: true, id: (result.decoded as Record<string, any>).id };
}
