export const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    console.log("ROLE UTILISATEUR :", req.user.role);
    console.log("ROLES AUTORISÉS :", roles);

    if (
      !roles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        error: "Accès refusé",
      });
    }

    next();
  };