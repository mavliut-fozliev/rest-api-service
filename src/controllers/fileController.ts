import { decodeAccessToken, getAccessToken } from "../utils/auth";
import { Request, Response } from "express";
import path from "path";
import File from "../models/File";

export const uploadFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = getAccessToken(req);

    const result = await decodeAccessToken(accessToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileData = {
      name: file.originalname,
      extension: path.extname(file.originalname),
      mime_type: file.mimetype,
      size: file.size,
      upload_date: new Date(),
    };

    await File.create(fileData);

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
