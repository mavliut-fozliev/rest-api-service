import { Request } from "express";
import multer from "multer";
import path from "path";

const folder = "uploads";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, `./${folder}/`);
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = Date.now() + fileExtension;
    cb(null, fileName);
  },
});

export const upload = multer({ storage });

export const getStoragePath = () => path.join(__dirname, "..", "..", folder);
