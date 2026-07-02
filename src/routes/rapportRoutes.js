import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { hasPermission } from "../middleware/permissionMiddleware.js";
import { PERMISSIONS } from "../config/permissions.js";
import { getReport} from "../controllers/rapportController.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  hasPermission(PERMISSIONS.RAPPORT_VIEW),
  getReport
);

export default router;