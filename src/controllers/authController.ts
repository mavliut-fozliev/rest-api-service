import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, validateCredentials, verifyToken } from "../utils/auth";
import Token from "../models/Token";

export const signin = async (req: Request, res: Response): Promise<any> => {
  const { id, password } = req.body;

  try {
    const validationError = validateCredentials(id, password);
    if (validationError) return res.status(400).json(validationError);

    const user = await User.findByPk(id);
    if (!user) return res.status(401).json({ error: "Invalid ID or password" });

    const isMatch = await user.validatePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid ID or password" });

    await Token.destroy({ where: { id } });

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    await Token.create({ id, accessToken, refreshToken });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateAccessToken = async (req: Request, res: Response): Promise<any> => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

    const result = verifyToken(refreshToken);
    if (!result.valid) return res.status(403).json({ error: result.reason === "expired" ? "Refresh token expired" : "Invalid refresh token" });

    const savedToken = await Token.findOne({ where: { refreshToken } });
    if (!savedToken) return res.status(403).json({ error: "Invalid refresh token" });

    const { id } = result.decoded as Record<string, any>;
    const accessToken = generateAccessToken(id);

    await Token.update({ accessToken }, { where: { id: id } });

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

    await Token.create({ id, accessToken, refreshToken });

    return res.status(201).json({ message: "User registered successfully", accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<any> => {
  const accessToken = req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];

  try {
    const result = verifyToken(accessToken);
    if (!result.valid) return res.status(403).json({ error: result.reason === "expired" ? "Access token expired" : "Invalid access token" });

    const savedToken = await Token.findOne({ where: { accessToken } });
    if (!savedToken) return res.status(403).json({ error: "Invalid access token" });

    const { id } = result.decoded as Record<string, any>;

    return res.status(200).json({ id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
