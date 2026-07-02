import express from "express";
import {
  getProduits,
  createProduit,
  deleteProduit,
  updateProduit,
  reactiverProduit,
} from "../controllers/produitController.js";
import { hasPermission } from "../middleware/permissionMiddleware.js";
import { PERMISSIONS } from "../config/permissions.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProduits);
router.post(
  "/",
  verifyToken,
  hasPermission(PERMISSIONS.PRODUIT_CREATE),
  createProduit
);
router.delete("/:id", deleteProduit);
router.put(
  "/:id",
  verifyToken,
  hasPermission(PERMISSIONS.PRODUIT_UPDATE),
  updateProduit
);
router.put(
  "/reactiver/:id",
  verifyToken,
  hasPermission(PERMISSIONS.PRODUIT_REACTIVER),
  reactiverProduit
);

export default router;