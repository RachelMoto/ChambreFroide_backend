import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
};

export const verifyToken = (
  req,
  res,
  next
) => {

  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token manquant",
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      error: "Token invalide",
    });
  }
};