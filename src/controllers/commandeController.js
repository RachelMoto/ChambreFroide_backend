import prisma from "../config/prisma.js";

export const createCommande = async (req, res) => {
  try {
    const {
      prenom,
      telephone,
      produits,
    } = req.body;

    let client = null;

if (telephone?.trim()) {
  client = await prisma.client.findUnique({
    where: {
      telephone: telephone.trim(),
    },
  });
}

if (!client) {
  client = await prisma.client.create({
    data: {
      prenom,
      telephone: telephone?.trim() || null,
    },
  });
}

    let montantTotal = 0;

    // Calcul du montant total
    for (const p of produits) {
      const produit = await prisma.produit.findUnique({
        where: {
          id: Number(p.produitId),
        },
      });

      if (!produit) {
        return res.status(404).json({
          error: "Produit introuvable",
        });
      }

      montantTotal +=
        Number(produit.prixCarton) *
        Number(p.quantite);
    }

    // Création de la commande
    const commande = await prisma.commande.create({
      data: {
        clientId: client.id,
        statut: "EN_COURS",
        type: "COMPTANT",
        montant: montantTotal,
        acompte: 0,
      },
    });

    // Création des lignes de commande
    for (const p of produits) {
      const produit = await prisma.produit.findUnique({
        where: {
          id: Number(p.produitId),
        },
      });

      await prisma.ligneCommande.create({
        data: {
          commandeId: commande.id,
          produitId: Number(p.produitId),
          quantite: Number(p.quantite),
          prixUnitaire: Number(produit.prixCarton),
        },
      });
    }

    return res.status(201).json({
      message: "Commande enregistrée avec succès",
      commande,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getCommandes = async (req, res) => {
  try {
    const commandes = await prisma.commande.findMany({
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

    res.json(commandes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const getCommandeById = async (req, res) => {
  try {
    const commande = await prisma.commande.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        client: true,
        lignes: {
          include: {
            produit: true,
          },
        },
      },
    });

    if (!commande) {
      return res.status(404).json({
        error: "Commande introuvable",
      });
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const annulerCommande = async (req, res) => {
  try {
    const commande = await prisma.commande.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        statut: "ANNULEE",
      },
    });

    res.json({
      message: "Commande annulée",
      commande,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const updateCommande = async (req, res) => {
  try {
    const { quantites } = req.body;

    const commandeId = Number(req.params.id);

    const commande = await prisma.commande.findUnique({
      where: { id: commandeId },
      include: { lignes: true },
    });

    if (!commande) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    // ANNULATION SIMPLE
if (req.body.statut === "ANNULEE") {
  await prisma.commande.update({
    where: { id: commandeId },
    data: {
      statut: "ANNULEE",
    },
  });

  return res.json({
    message: "Commande annulée",
  });
}

    let nouveauMontant = 0;



    // Mise à jour des quantités ligne par ligne
    for (const ligne of commande.lignes) {
  const nouvelleQuantite = quantites?.[ligne.id];

  if (nouvelleQuantite !== undefined) {
    const qteValidee = Number(nouvelleQuantite);
    const ancienneQte = Number(ligne.quantite);

    if (qteValidee > ancienneQte) {
      return res.status(400).json({
        error: `Impossible : ${qteValidee} > ${ancienneQte}`,
      });
    }

    const reste = ancienneQte - qteValidee;

    await prisma.ligneCommande.update({
      where: { id: ligne.id },
      data: {
        quantite: reste,
      },
    });

    nouveauMontant += reste * Number(ligne.prixUnitaire);
  }
}
  

    // IMPORTANT : statut reste EN_COURS tant que tout n'est pas 0
    const lignesRestantes = await prisma.ligneCommande.findMany({
      where: { commandeId },
    });

    const totalRestant = lignesRestantes.reduce(
      (sum, l) => sum + Number(l.quantite),
      0
    );

    await prisma.commande.update({
  where: { id: commandeId },
  data: {
    statut: totalRestant === 0 ? "VENDUE" : "EN_COURS",
    montant: nouveauMontant, // 🔥 IMPORTANT
  },
});

    res.json({ message: "Commande mise à jour" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};