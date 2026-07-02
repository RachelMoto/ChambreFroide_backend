import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { hasPermission } from "../middleware/permissionMiddleware.js";

import { PERMISSIONS } from "../config/permissions.js";
import { upload } from "../middleware/uploadMiddleware.js";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  disableUser,
  enableUser,
  resetUserPassword,
  deleteUser,
  updateProfileImage 
} from "../controllers/userController.js";

const router = express.Router();

/* ===============================
   CREATE USER
================================ */

router.post(
  "/",
  verifyToken,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  hasPermission(PERMISSIONS.USER_MANAGE),
  createUser
);

/* ===============================
   GET USERS
================================ */

router.get(
  "/",
  verifyToken,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  hasPermission(PERMISSIONS.USER_MANAGE),
  getUsers
);

/* ===============================
   GET ONE USER
================================ */

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  hasPermission(PERMISSIONS.USER_MANAGE),
  getUserById
);

/* ===============================
   UPDATE USER
================================ */

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  hasPermission(PERMISSIONS.USER_MANAGE),
  updateUser
);

/* ===============================
   DISABLE USER
================================ */

router.put(
  "/disable/:id",
  verifyToken,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  hasPermission(PERMISSIONS.USER_MANAGE),
  disableUser
);

/* ===============================
   ENABLE USER
================================ */

router.put(
  "/enable/:id",
  verifyToken,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  hasPermission(PERMISSIONS.USER_MANAGE),
  enableUser
);

/* ===============================
   RESET PASSWORD
================================ */

router.put(
  "/reset-password/:id",
  verifyToken,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  hasPermission(PERMISSIONS.USER_MANAGE),
  resetUserPassword
);

/* ===============================
   DELETE USER
================================ */

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("SUPER_ADMIN"),
  hasPermission(PERMISSIONS.USER_MANAGE),
  deleteUser
);

router.put(
  "/profile-image",
  verifyToken,
  upload.single("image"),
  updateProfileImage
);


export default router;