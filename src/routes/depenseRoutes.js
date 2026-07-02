import express from "express";
import {
  createDepense,
  getDepenses,
} from "../controllers/depenseController.js";

const router = express.Router();

router.post("/", createDepense);
router.get("/", getDepenses);

export default router;