import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
import bcrypt from "bcryptjs";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const signin = async (req: Request, res: Response): Promise<any> => {
  const { id, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(401).json({ error: "Invalid ID or password" });
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid ID or password" });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "10m" });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const signup = async (req: Request, res: Response): Promise<any> => {
  const { id, password } = req.body;

  try {
    if (!id || !password) {
      return res.status(400).json({ error: "ID and password are required" });
    }

    if (typeof id !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "ID and password must be a string" });
    }

    const existingUser = await User.findByPk(id);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ id, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
