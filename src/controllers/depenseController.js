import prisma from "../config/prisma.js";

export const createDepense = async (req, res) => {
  try {
    const {
      libelle,
      montant,
      categorie,
      description,
    } = req.body;

    if (!libelle || !montant) {
      return res.status(400).json({
        error: "Libellé et montant requis",
      });
    }

    // 1️⃣ Enregistrer dans la table Depense
    const depense = await prisma.depense.create({
      data: {
        libelle,
        montant: Number(montant),
        categorie,
        description,
      },
    });

    // 2️⃣ Enregistrer le mouvement dans la caisse
    await prisma.caisse.create({
      data: {
        type: "SORTIE",
        categorie: "DEPENSE",
        montant: Number(montant),
        description: libelle,
      },
    });

    res.status(201).json(depense);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getDepenses = async (req, res) => {
  try {
    const depenses =
      await prisma.depense.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(depenses);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};