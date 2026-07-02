import express from "express";

import {
  createApprovisionnement,
  getApprovisionnements,
} from "../controllers/approvisionnementController.js";
import { hasPermission } from "../middleware/permissionMiddleware.js";
import { PERMISSIONS } from "../config/permissions.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  hasPermission(PERMISSIONS.APPROVISIONNEMENT_CREATE),
  createApprovisionnement
);

router.get(
  "/",
  getApprovisionnements
);

export default router;