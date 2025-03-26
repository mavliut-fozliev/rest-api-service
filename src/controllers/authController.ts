import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, validateCredentials, verifyRefreshToken } from "../utils/auth";
import RefreshToken from "../models/RefreshToken";

export const signin = async (req: Request, res: Response): Promise<any> => {
  const { id, password } = req.body;

  try {
    const validationError = validateCredentials(id, password);
    if (validationError) return res.status(400).json(validationError);

    const user = await User.findByPk(id);
    if (!user) return res.status(401).json({ error: "Invalid ID or password" });

    const isMatch = await user.validatePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid ID or password" });

    await RefreshToken.destroy({ where: { id } });

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    await RefreshToken.create({ id, refreshToken });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateAccessToken = async (req: Request, res: Response): Promise<any> => {
  // const refreshToken = req.cookies?.refresh_token || req.headers?.authorization?.split(" ")[1];
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const result = verifyRefreshToken(refreshToken);
    if (!result.valid) return res.status(403).json({ message: result.reason === "expired" ? "Refresh token expired" : "Invalid refresh token" });

    const savedRefreshToken = await RefreshToken.findOne({ where: { refreshToken } });
    if (!savedRefreshToken) return res.status(403).json({ message: "Invalid refresh token" });

    const { userId } = result.decoded as Record<string, any>;
    const accessToken = generateAccessToken(userId);

    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const signup = async (req: Request, res: Response): Promise<any> => {
  const { id, password } = req.body;

  try {
    const validationError = validateCredentials(id, password);
    if (validationError) return res.status(400).json(validationError);

    const existingUser = await User.findByPk(id);
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ id, password: hashedPassword });

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    await RefreshToken.create({ id, refreshToken });

    return res.status(201).json({ message: "User registered successfully", accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
