import { Router } from "express";
import { signin, updateAccessToken, signup, getUserInfo, logout } from "../controllers/authController";
import { deleteFile, getFiles, uploadFile, getFileInfo, downloadFile, updateFile } from "../controllers/fileController";
import { upload } from "../utils/storage";

const router = Router();

router.post("/signin", signin);
router.post("/signin/new_token", updateAccessToken);
router.post("/signup", signup);
router.get("/info", getUserInfo);
router.get("/logout", logout);

router.post("/file/upload", upload.single("file"), uploadFile);
router.get("/file/list", getFiles);
router.delete("/file/delete/:id", deleteFile);
router.get("/file/:id", getFileInfo);
router.get("/file/download/:id", downloadFile);
router.put("/file/update/:id", upload.single("file"), updateFile);

export default router;
