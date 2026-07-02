import express from "express";
import {
  createPaiement,
  getPaiements,
} from "../controllers/paiementController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 CREATE PAIEMENT
router.post(
  "/",
  verifyToken,
  createPaiement
);

// 🔥 GET PAIEMENTS
router.get(
  "/",
  verifyToken,
  getPaiements
);

export default router;