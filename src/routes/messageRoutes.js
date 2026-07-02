import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { hasPermission } from "../middleware/permissionMiddleware.js";

import { PERMISSIONS } from "../config/permissions.js";

import {
  sendMessage,
  getConversation,
  getUnreadCount,
  getUsersForMessaging
} from "../controllers/messageController.js";

const router = express.Router();

/* =========================
   USERS POUR CHAT
========================= */
router.get(
  "/users",
  verifyToken,
  hasPermission(PERMISSIONS.MESSAGING_VIEW),
  getUsersForMessaging
);

/* =========================
   ENVOYER MESSAGE
========================= */
router.post(
  "/send",
  verifyToken,
  hasPermission(PERMISSIONS.MESSAGING_SEND),
  sendMessage
);

/* =========================
   CONVERSATION
========================= */
router.get(
  "/:otherUserId",
  verifyToken,
  hasPermission(PERMISSIONS.MESSAGING_VIEW),
  getConversation
);

/* =========================
   NON LUS
========================= */
router.get(
  "/unread-count",
  verifyToken,
  hasPermission(PERMISSIONS.MESSAGING_VIEW),
  getUnreadCount
);

export default router;