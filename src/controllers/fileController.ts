import { decodeAccessToken, getAccessToken } from "../utils/auth";
import { Request, Response } from "express";
import path from "path";
import File from "../models/File";
import { getStoragePath } from "../middlewares/storage";
import fs from "fs";
import { handleServerError } from "../utils/errorHandling";

export const uploadFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const id = file.filename;
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
    return handleServerError(error, res);
  }
};

export const getFiles = async (req: Request, res: Response): Promise<any> => {
  try {
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
    return handleServerError(error, res);
  }
};

export const deleteFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(getStoragePath(), file.id);

    fs.unlink(filePath, async (err) => {
      if (err && err.code !== "ENOENT") {
        console.error(err);
        return res.status(500).json({ message: "Error deleting file" });
      }

      await file.destroy();
      res.json({ message: "File successfully deleted" });
    });
  } catch (error) {
    return handleServerError(error, res);
  }
};

export const getFileInfo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (error) {
    return handleServerError(error, res);
  }
};

export const downloadFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(getStoragePath(), file.id);

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
    return handleServerError(error, res);
  }
};

export const updateFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const existingFile = await File.findByPk(id);

    if (!existingFile) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const name = path.parse(file.originalname).name;

    const fileData = {
      name,
      extension: path.extname(file.originalname),
      mime_type: file.mimetype,
      size: file.size,
      upload_date: new Date(),
    };

    await existingFile.update(fileData);

    res.json({ message: "File updated successfully", file: existingFile });
  } catch (error) {
    return handleServerError(error, res);
  }
};
