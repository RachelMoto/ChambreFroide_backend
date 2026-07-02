import express from "express";
import {
  getCommandes,
  createCommande,
  updateCommande,
  annulerCommande,
} from "../controllers/commandeController.js";

const router = express.Router();

router.get("/", getCommandes);
router.post("/", createCommande);
router.put("/:id", updateCommande); // ✅ OBLIGATOIRE
router.put("/annuler/:id", annulerCommande);

export default router;