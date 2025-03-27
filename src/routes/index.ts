import { Router } from "express";
import { signin, updateAccessToken, signup, getUserInfo, logout } from "../controllers/authController";
import { uploadFile } from "../controllers/fileController";

const router = Router();

router.post("/signin", signin);
router.post("/signin/new_token", updateAccessToken);
router.post("/signup", signup);
router.get("/info", getUserInfo);
router.get("/logout", logout);

router.post("/file/upload", uploadFile);

export default router;
