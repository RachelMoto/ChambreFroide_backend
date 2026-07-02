import { Router } from "express";
import {
  getDettes,
  payerDette,
} from "../controllers/detteController.js";

const router = Router();

router.get("/", getDettes);
router.put("/:id/payer", payerDette);

export default router;