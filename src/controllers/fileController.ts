import { decodeAccessToken, getAccessToken } from "../utils/auth";
import { Request, Response } from "express";
import path from "path";
import File from "../models/File";
import { getStoragePath } from "../utils/storage";
import fs from "fs";

export const uploadFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = getAccessToken(req);

    const result = await decodeAccessToken(accessToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const id = path.parse(file.filename).name;
    const name = path.parse(file.originalname).name;

    const fileData = {
      id,
      name,
      extension: path.extname(file.originalname),
      mime_type: file.mimetype,
      size: file.size,
      upload_date: new Date(),
    };

    await File.create(fileData);

    res.status(200).json({ message: `File uploaded successfully, id: ${id}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFiles = async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = getAccessToken(req);

    const result = await decodeAccessToken(accessToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    const list_size = parseInt(String(req.query.list_size)) || 10;
    const page = parseInt(String(req.query.page)) || 1;

    const offset = (page - 1) * list_size;

    const { count, rows } = await File.findAndCountAll({
      limit: list_size,
      offset,
      order: [["upload_date", "DESC"]],
    });

    res.json({ total: count, page, list_size, total_pages: Math.ceil(count / list_size), files: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = getAccessToken(req);

    const result = await decodeAccessToken(accessToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    const { id } = req.params;
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(getStoragePath(), file.id + file.extension);

    fs.unlink(filePath, async (err) => {
      if (err && err.code !== "ENOENT") {
        console.error(err);
        return res.status(500).json({ message: "Error deleting file" });
      }

      await file.destroy();
      res.json({ message: "File successfully deleted" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFileInfo = async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = getAccessToken(req);

    const result = await decodeAccessToken(accessToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    const { id } = req.params;
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const downloadFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = getAccessToken(req);

    const result = await decodeAccessToken(accessToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    const { id } = req.params;
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(getStoragePath(), file.id + file.extension);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "The file is missing from the server" });
    }

    res.download(filePath, file.name + file.extension, (err) => {
      if (err) {
        console.error("Error while downloading:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
