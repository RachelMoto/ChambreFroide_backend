import { Router } from "express";
import { createVente, getVentes, } from "../controllers/venteController.js";

const router = Router();

router.post("/", createVente);
router.get("/", getVentes);

export default router;