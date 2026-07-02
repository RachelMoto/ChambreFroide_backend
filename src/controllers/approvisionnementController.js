import prisma from "../config/prisma.js";

export const createApprovisionnement = async (req, res) => {
  try {
    const {
      produitId,
      quantite,
      prixAchat,
      fournisseur,
    } = req.body;

    const produit = await prisma.produit.findUnique({
      where: {
        id: Number(produitId),
      },
    });

    if (!produit) {
      return res.status(404).json({
        error: "Produit introuvable",
      });
    }

    const stockAvant = Number(produit.stockActuel || 0);

    const stockApres = stockAvant + Number(quantite);

    const approvisionnement =
      await prisma.approvisionnement.create({
        data: {
          produitId: Number(produitId),
          quantite: Number(quantite),
          prixAchat: prixAchat
            ? Number(prixAchat)
            : null,
          fournisseur,

          stockAvant,
          stockApres,
        },
      });

    await prisma.produit.update({
      where: {
        id: Number(produitId),
      },
      data: {
        stockActuel: stockApres,
      },
    });

    res.status(201).json(
      approvisionnement
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getApprovisionnements =
  async (req, res) => {
    try {
      const approvisionnements =
        await prisma.approvisionnement.findMany({
          include: {
            produit: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(
        approvisionnements
      );
    } catch (error) {
     console.error(error);
      res.status(500).json({
        error: error.message,
      });
    }
  };