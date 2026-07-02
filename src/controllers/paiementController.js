import prisma from "../config/prisma.js";

export const createPaiement = async (req, res) => {
  try {
    const { detteId, montant } = req.body;

    if (!detteId || !montant) {
      return res.status(400).json({
        error: "detteId et montant obligatoires",
      });
    }

    const montantNum = Number(montant);

    const dette = await prisma.dette.findUnique({
      where: { id: Number(detteId) },
    });

    if (!dette) {
      return res.status(404).json({
        error: "Dette introuvable",
      });
    }

    const nouveauMontantPaye =
      Number(dette.montantPaye) + montantNum;

    const nouveauReste =
      Number(dette.montantTotal) - nouveauMontantPaye;

    const modePaiement =
      nouveauMontantPaye >= Number(dette.montantTotal)
        ? "SOLDE"
        : "PAIEMENT_DETTE";

    const detteMaj = await prisma.dette.update({
      where: { id: Number(detteId) },
      data: {
        montantPaye: nouveauMontantPaye,
        resteAPayer: nouveauReste < 0 ? 0 : nouveauReste,
        statut: nouveauReste <= 0 ? "PAYEE" : "EN_COURS",
      },
    });

    const paiement = await prisma.paiement.create({
      data: {
        detteId: Number(detteId),
        montant: montantNum,
        modePaiement,
      },
    });

    await prisma.caisse.create({
      data: {
        type: "ENTREE",
        categorie: "PAIEMENT_DETTE",
        montant: montantNum,
        description: `Paiement dette #${dette.id}`,
      },
    });

    return res.status(201).json({
      message: "Paiement enregistré",
      paiement,
      dette: detteMaj,
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getPaiements = async (req, res) => {
  try {
    const paiements = await prisma.paiement.findMany({
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

    res.json(paiements);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};