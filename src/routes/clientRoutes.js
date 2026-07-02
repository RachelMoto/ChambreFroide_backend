import express from "express";
import { getClients } from "../controllers/clientController.js";

const router = express.Router();

// 🔥 GET /api/clients
router.get("/", getClients);

export default router;