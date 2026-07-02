import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        email: true,
        nom: true,
        telephone: true,
        role: true,
        actif: true,
        googleEnabled: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    res.json(users);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        username: true,
        email: true,
        nom: true,
        telephone: true,
        role: true,
        actif: true,
        googleEnabled: true,
        mustChangePassword: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Utilisateur introuvable",
      });
    }

    res.json(user);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
    console.log("CREATE USER EXECUTÉ");
  try {

    const {
      username,
      email,
      password,
      nom,
      telephone,
      role,
      googleEnabled,
    } = req.body;

    const existingUsername =
      await prisma.user.findUnique({
        where: {
          username,
        },
      });

    if (existingUsername) {
      return res.status(400).json({
        error: "Nom d'utilisateur déjà utilisé",
      });
    }

    if (email) {
      const existingEmail =
        await prisma.user.findUnique({
          where: {
            email,
          },
        });

      if (existingEmail) {
        return res.status(400).json({
          error: "Email déjà utilisé",
        });
      }
    }

    const hash =
      await bcrypt.hash(password, 10);

    const user =
      await prisma.user.create({
        data: {
          username,
          email,
          password: hash,
          nom,
          telephone,
          role,
          googleEnabled:
            googleEnabled || false,
          actif: true,
          mustChangePassword: true,
        },
      });

    res.status(201).json({
      message: "Utilisateur créé",
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      username,
      email,
      nom,
      telephone,
      role,
      googleEnabled,
    } = req.body;

    const user =
      await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          username,
          email,
          nom,
          telephone,
          role,
          googleEnabled,
        },
      });

    res.json({
      message: "Utilisateur modifié",
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const disableUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user =
      await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          actif: false,
        },
      });

    res.json({
      message: "Utilisateur désactivé",
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const enableUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user =
      await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          actif: true,
        },
      });

    res.json({
      message: "Utilisateur réactivé",
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const resetUserPassword = async (req, res) => {
  try {

    const { id } = req.params;

    const passwordHash =
      await bcrypt.hash(
        "admin123",
        10
      );

    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        password: passwordHash,
        mustChangePassword: true,
      },
    });

    res.json({
      message:
        "Mot de passe réinitialisé à admin123",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Utilisateur supprimé",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const updateProfileImage = async (req, res) => {
  try {

    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        error: "Aucune image envoyée"
      });
    }

    cloudinary.uploader.upload_stream(
      { folder: "profiles" },
      async (error, result) => {

        if (error) {
          return res.status(500).json({ error });
        }

        const user = await prisma.user.update({
          where: { id: userId },
          data: {
            imageUrl: result.secure_url,
          },
        });

        return res.json({
          message: "Photo mise à jour",
          user,
        });

      }
    ).end(req.file.buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
