import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, getAccessToken, getAccessTokenId, validateCredentials, getRefreshTokenId } from "../utils/auth";
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

    const result = await getRefreshTokenId(refreshToken);
    if (!result.valid) return res.status(403).json({ error: result.error });

    const id = result.id;
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
  const accessToken = getAccessToken(req);

  try {
    const result = await getAccessTokenId(accessToken);
    if (!result.valid) return res.status(403).json({ error: result.error });

    const id = result.id;

    return res.status(200).json({ id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const accessToken = getAccessToken(req);

  try {
    const result = await getAccessTokenId(accessToken);
    if (!result.valid) return res.status(403).json({ error: result.error });

    const id = result.id;

    await Token.destroy({ where: { id } });

    return res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
