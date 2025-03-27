import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, validateCredentials, decodeRefreshToken } from "../utils/auth";
import Token from "../models/Token";
import { handleServerError } from "../utils/errorHandling";

export const signin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, password, deviceId } = req.body;

    const validationError = validateCredentials(id, password, deviceId);
    if (validationError) return res.status(validationError.code).json({ message: validationError.error });

    const user = await User.findByPk(id);
    if (!user) return res.status(401).json({ message: "Invalid ID or password" });

    const isMatch = await user.validatePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid ID or password" });

    await Token.destroy({ where: { userId: id, deviceId } });

    const accessToken = generateAccessToken(id, deviceId);
    const refreshToken = generateRefreshToken(id, deviceId);

    await Token.create({ userId: id, accessToken, refreshToken, deviceId });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    return handleServerError(error, res);
  }
};

export const updateAccessToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const result = await decodeRefreshToken(refreshToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    const accessToken = generateAccessToken(result.id, result.deviceId);

    await Token.update({ accessToken }, { where: { userId: result.id, deviceId: result.deviceId } });

    return res.json({ accessToken });
  } catch (error) {
    return handleServerError(error, res);
  }
};

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, password, deviceId } = req.body;

    const validationError = validateCredentials(id, password, deviceId);
    if (validationError) return res.status(validationError.code).json({ message: validationError.error });

    const existingUser = await User.findByPk(id);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ id, password: hashedPassword });

    const accessToken = generateAccessToken(id, deviceId);
    const refreshToken = generateRefreshToken(id, deviceId);

    await Token.create({ userId: id, accessToken, refreshToken, deviceId });

    return res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    return handleServerError(error, res);
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<any> => {
  try {
    return res.status(200).json({ id: req.params.userId });
  } catch (error) {
    return handleServerError(error, res);
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    await Token.destroy({ where: { userId: req.params.userId, deviceId: req.params.deviceId } });
    return res.status(200).json({ message: "User logged out" });
  } catch (error) {
    return handleServerError(error, res);
  }
};
