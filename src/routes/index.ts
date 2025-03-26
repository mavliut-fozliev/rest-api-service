import { Router } from "express";
import { signin, updateAccessToken, signup, getUserInfo, logout } from "../controllers/authController";

const router = Router();

router.post("/signin", signin);
router.post("/signin/new_token", updateAccessToken);
router.post("/signup", signup);
router.get("/info", getUserInfo);
router.get("/logout", logout);

export default router;
