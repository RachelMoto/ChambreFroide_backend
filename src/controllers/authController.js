import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

export const login = async (req, res) => {
  try {
     console.log(req.body);

    const { username, password } = req.body;
    console.log("Username reçu :", username);
    console.log("Password reçu :", password);
    

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    console.log("Utilisateur trouvé :", user);

    if (!user) {
      return res.status(400).json({
        error: "Utilisateur introuvable",
      });
    }

    const validPassword = await bcrypt.compare( password, user.password );
    console.log("Password valide :", validPassword);

    if (!validPassword) {
      return res.status(400).json({
        error: "Mot de passe incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user,
      mustChangePassword:
        user.mustChangePassword,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {

  try {

    const { password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        password: hash,
        mustChangePassword: false,
      },
    });

    res.json({
      message: "Mot de passe modifié",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: "Token Google manquant",
      });
    }

    const ticket =
      await client.verifyIdToken({
        idToken: token,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload = ticket.getPayload();

    const email = payload.email;

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return res.status(403).json({
        error:
          "Votre compte Google n'est pas autorisé",
      });
    }

    if (!user.actif) {
      return res.status(403).json({
        error:
          "Votre compte est désactivé",
      });
    }

    if (!user.googleEnabled) {
      return res.status(403).json({
        error:
          "Connexion Google non activée pour ce compte",
      });
    }

    if (
      user.role !== "SUPER_ADMIN" &&
      user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        error:
          "Connexion Google réservée aux administrateurs",
      });
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      token: jwtToken,
      user,
      mustChangePassword:
        user.mustChangePassword,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        "Erreur lors de la connexion Google",
    });
  }
};