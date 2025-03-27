import { Request } from "express";
import multer from "multer";
import path from "path";
import File from "../models/File";

const folder = "uploads";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, `./${folder}/`);
  },
  filename: async (req: Request, file: Express.Multer.File, cb: Function) => {
    const { id } = req.params;
    const existingFile = await File.findByPk(id);

    if (existingFile) {
      cb(null, existingFile.id);
    } else {
      const fileName = String(Date.now());
      cb(null, fileName);
    }
  },
});

export const upload = multer({ storage });

export const getStoragePath = () => path.join(__dirname, "..", "..", folder);
