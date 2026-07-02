import { ROLE_PERMISSIONS } from "../config/permissions.js";

export const hasPermission = (permission) => {
  return (req, res, next) => {
    console.log("Utilisateur :", req.user);
    console.log("Rôle reçu :", req.user.role);
    console.log("Permission demandée :", permission);

    const role = req.user.role;

    const permissions = ROLE_PERMISSIONS[role] || [];

    // ADMIN et SUPER_ADMIN
    if (permissions.includes("*")) {
      return next();
    }

    // Vérification des permissions du rôle
    if (permissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      error: "Accès refusé"
    });

  };
};