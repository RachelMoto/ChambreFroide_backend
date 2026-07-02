import prisma from "../config/prisma.js";

/**
 * 🔥 CRÉATION UNIQUE DE MOUVEMENT CAISSE
 */
export const createCaisse = async (req, res) => {
  try {
    const { type, montant, categorie, description } = req.body;

    if (!type || !montant) {
      return res.status(400).json({
        error: "type et montant obligatoires",
      });
    }

    const caisse = await prisma.caisse.create({
      data: {
        type, // ENTREE | SORTIE | ACOMPTE
        montant: Number(montant),
        categorie: categorie || "GENERAL",
        description: description || "",
      },
    });

    return res.status(201).json(caisse);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * 🔥 LISTE CAISSE
 */
export const getCaisse = async (req, res) => {
  try {
    const caisse = await prisma.caisse.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(caisse);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};