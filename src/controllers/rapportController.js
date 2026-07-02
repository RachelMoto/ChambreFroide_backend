import prisma from "../config/prisma.js";

const getRange = (type) => {
  const now = new Date();
  let start = new Date();

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
      where: { createdAt: { gte: startDate } },
      include: {
        client: { include: { dettes: true } },
        lignes: { include: { produit: true } }
      }
    });

    // ================= DEPENSES =================
    const depenses = await prisma.depense.findMany({
      where: { createdAt: { gte: startDate } }
    });

    // ================= APPRO =================
    const approvisionnements = await prisma.approvisionnement.findMany({
      where: { createdAt: { gte: startDate } },
      include: { produit: true }
    });

    // ================= PAIEMENTS =================
    const paiements = await prisma.paiement.findMany({
      where: { createdAt: { gte: startDate } },
      include: {
        dette: { include: { client: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    // ================= FORMAT PAIEMENTS =================
    const paiementsFormates = paiements.map((p) => ({
      id: p.id,
      montant: Number(p.montant || 0),
      createdAt: p.createdAt,
      client: p.dette?.client
        ? `${p.dette.client.prenom || ""} ${p.dette.client.nom || ""}`.trim()
        : "Client inconnu"
    }));

    // ================= VENTES =================
    const ventesComptant = ventes.filter(v => v.type === "COMPTANT");
    const ventesCredit = ventes.filter(v => v.type === "CREDIT");

    let totalComptant = 0;
    let totalAcomptes = 0;

    ventesComptant.forEach(v => {
      totalComptant += Number(v.montant || 0);
    });

    ventesCredit.forEach(v => {
      const dette = v.client?.dettes?.find(
        d => Number(d.montantTotal) === Number(v.montant)
      );

      totalAcomptes += Number(dette?.montantPaye || 0);
    });

    // ================= PAIEMENTS DETTES =================
    const totalPaiementDette = paiementsFormates.reduce(
      (sum, p) => sum + Number(p.montant || 0),
      0
    );

    // ================= DEPENSES =================
    const totalDepenses = depenses.reduce(
      (sum, d) => sum + Number(d.montant || 0),
      0
    );

    // ================= APPRO =================
    const totalAppro = approvisionnements.reduce(
      (sum, a) => sum + Number(a.quantite || 0),
      0
    );

    // ================= TOTAL =================
    const totalAVerser =
      totalComptant +
      totalAcomptes +
      totalPaiementDette -
      totalDepenses;

    // ================= RESPONSE PROPRE =================
    return res.json({
      ventesComptant,
      ventesCredit,
      depenses,
      approvisionnements,
      paiements: paiementsFormates,

      totalComptant,
      totalAcomptes,
      totalPaiementDette,
      totalDepenses,
      totalAppro,
      totalAVerser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message
    });
  }
};