import express from "express";
import {login, changePassword, googleLogin} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/login", login);

router.put("/change-password", verifyToken, changePassword);

router.put("/change-password", authMiddleware, changePassword);

router.post("/google",googleLogin);



export default router;