import prisma from "../config/prisma.js";

const getRange = (type) => {
  const now = new Date();
  const start = new Date();

  if (type === "daily") {
    start.setHours(0, 0, 0, 0);
  }

  if (type === "weekly") {
    start.setDate(now.getDate() - 7);
  }

  if (type === "monthly") {
    start.setMonth(now.getMonth() - 1);
  }

  return start;
};

export const getReport = async (req, res) => {
  try {
    const { type } = req.query;
    const startDate = getRange(type);

    // ================= VENTES =================

    const ventes = await prisma.vente.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        client: true,
        lignes: {
          include: {
            produit: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ================= DEPENSES =================

    const depenses = await prisma.depense.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // ================= APPROVISIONNEMENTS =================

    const approvisionnements =
      await prisma.approvisionnement.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        include: {
          produit: true,
        },
      });

    // ================= PAIEMENTS =================

    const paiements = await prisma.paiement.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        dette: {
          include: {
            client: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ================= LISTES =================
    
    const ventesComptant = ventes.filter(
      (v) => v.type === "COMPTANT"
    );

    const ventesCredit = ventes.filter(
      (v) => v.type === "CREDIT"
    );

    // ================= TOTAUX =================

    const totalComptant = ventesComptant.reduce(
      (sum, vente) =>
        sum + Number(vente.montant),
      0
    );

    // uniquement les acomptes enregistrés lors de la vente

    const totalAcomptes = ventesCredit.reduce(
      (sum, vente) =>
        sum + Number(vente.acompte || 0),
      0
    );

    // uniquement les paiements effectués après la vente

    const totalPaiementDette = paiements.reduce(
      (sum, paiement) =>
        sum + Number(paiement.montant),
      0
    );

    const totalDepenses = depenses.reduce(
      (sum, depense) =>
        sum + Number(depense.montant),
      0
    );

    const totalAppro = approvisionnements.reduce(
      (sum, app) =>
        sum + Number(app.quantite),
      0
    );

    // argent réellement entré dans la caisse

    const totalEncaisse =
      totalComptant +
      totalAcomptes +
      totalPaiementDette;

    const totalAVerser =
      totalEncaisse -
      totalDepenses;

    return res.json({
      ventesComptant,
      ventesCredit,
      depenses,
      approvisionnements,

      paiements: paiements.map((p) => ({
        id: p.id,
        montant: Number(p.montant),
        createdAt: p.createdAt,
        client:
          p.dette?.client?.prenom || "Client",
      })),

      totalComptant,
      totalAcomptes,
      totalPaiementDette,
      totalDepenses,
      totalAppro,
      totalEncaisse,
      totalAVerser,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};