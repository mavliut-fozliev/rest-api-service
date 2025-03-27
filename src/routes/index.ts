import { Router } from "express";
import { signin, updateAccessToken, signup, getUserInfo, logout } from "../controllers/authController";
import { deleteFile, getFiles, uploadFile, getFileInfo } from "../controllers/fileController";

const router = Router();

router.post("/signin", signin);
router.post("/signin/new_token", updateAccessToken);
router.post("/signup", signup);
router.get("/info", getUserInfo);
router.get("/logout", logout);

router.post("/file/upload", uploadFile);
router.get("/file/list", getFiles);
router.delete("/file/delete/:id", deleteFile);
router.get("/file/:id", getFileInfo);

export default router;
