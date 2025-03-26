import { Router } from "express";
import { signin, updateAccessToken, signup } from "../controllers/authController";

const router = Router();

router.post("/signin", signin);
router.post("/signin/new_token", updateAccessToken);
router.post("/signup", signup);

export default router;
