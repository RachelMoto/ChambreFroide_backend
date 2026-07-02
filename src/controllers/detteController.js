import prisma from "../config/prisma.js";

export const getDettes = async (req, res) => {
  try {
    const dettes = await prisma.dette.findMany({
      include: {
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(dettes);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const payerDette = async (req, res) => {
  try {
    const { montant } = req.body;

    const dette = await prisma.dette.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!dette) {
      return res.status(404).json({
        error: "Dette introuvable",
      });
    }

    const montantNum = Number(montant);

    const nouveauMontantPaye =
      Number(dette.montantPaye) + montantNum;

    const nouveauReste =
      Number(dette.resteAPayer) - montantNum;

    if (nouveauReste < 0) {
      return res.status(400).json({
        error: "Montant invalide",
      });
    }

    const detteMaj = await prisma.dette.update({
      where: {
        id: dette.id,
      },
      data: {
        montantPaye: nouveauMontantPaye,
        resteAPayer: nouveauReste,
        statut:
          nouveauReste === 0 ? "PAYEE" : "EN_COURS",
      },
    });

    // 🔥 DÉTERMINATION DU MODE
    let modePaiement = "ACOMPTE";

    if (nouveauMontantPaye >= Number(dette.montantTotal)) {
      modePaiement = "SOLDE";
    }

    // 🔥 AJOUT MANQUANT (IMPORTANT)
    await prisma.paiement.create({
      data: {
        detteId: dette.id,
        montant: montantNum,
        modePaiement,
      },
    });

    // caisse
    await prisma.caisse.create({
      data: {
        type: "ENTREE",
        montant: montantNum,
        description: "Paiement dette client",
      },
    });

    return res.json(detteMaj);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};