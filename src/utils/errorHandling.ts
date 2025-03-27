import { Response } from "express";

export function handleServerError(error: unknown, res: Response) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
