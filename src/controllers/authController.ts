import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, getAccessToken, decodeAccessToken, validateCredentials, decodeRefreshToken } from "../utils/auth";
import Token from "../models/Token";
import { AppError } from "../utils/errorHandling";

export const signin = async (req: Request, res: Response): Promise<any> => {
  const { id, password, deviceId } = req.body;

  try {
    const validationError = validateCredentials(id, password, deviceId);
    if (validationError) return res.status(validationError.code).json({ message: validationError.error });

    const user = await User.findByPk(id);
    if (!user) return res.status(401).json({ message: "Invalid ID or password" });

    const isMatch = await user.validatePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid ID or password" });

    await Token.destroy({ where: { id, deviceId } });

    const accessToken = generateAccessToken(id, deviceId);
    const refreshToken = generateRefreshToken(id, deviceId);

    await Token.create({ id, accessToken, refreshToken, deviceId });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAccessToken = async (req: Request, res: Response): Promise<any> => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const result = await decodeRefreshToken(refreshToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    const accessToken = generateAccessToken(result.id, result.deviceId);

    await Token.update({ accessToken }, { where: { id: result.id, deviceId: result.deviceId } });

    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const signup = async (req: Request, res: Response): Promise<any> => {
  const { id, password, deviceId } = req.body;

  try {
    const validationError = validateCredentials(id, password, deviceId);
    if (validationError) return res.status(validationError.code).json({ message: validationError.error });

    const existingUser = await User.findByPk(id);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ id, password: hashedPassword });

    const accessToken = generateAccessToken(id, deviceId);
    const refreshToken = generateRefreshToken(id, deviceId);

    await Token.create({ id, accessToken, refreshToken, deviceId });

    return res.status(201).json({ message: "User registered successfully", accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<any> => {
  const accessToken = getAccessToken(req);

  try {
    const result = await decodeAccessToken(accessToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    return res.status(200).json({ id: result.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const accessToken = getAccessToken(req);

  try {
    const result = await decodeAccessToken(accessToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    await Token.destroy({ where: { id: result.id, deviceId: result.deviceId } });

    return res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
