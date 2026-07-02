import express from "express";
import { createCaisse, getCaisse } from "../controllers/caisseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createCaisse);
router.get("/", verifyToken, getCaisse);

export default router;