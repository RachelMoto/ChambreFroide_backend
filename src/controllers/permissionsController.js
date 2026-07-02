import { permissions } from "../config/permissions.js";

export const authorizePermission = (perm) => {
  return (req, res, next) => {

    const role = req.user.role;

    const userPermissions =
      permissions[role] || [];

    if (
      userPermissions.includes("*") ||
      userPermissions.includes(perm)
    ) {
      return next();
    }

    return res.status(403).json({
      error: "Accès refusé",
    });
  };
};