import prisma from "../config/prisma.js";
import { createNotification } from "./notificationController.js";

export const createVente = async (req, res) => {
  try {
    const { client, produits, type, acompte = 0 } = req.body;

    // 1. CLIENT
    let clientDb = null;

// Recherche seulement si téléphone renseigné
if (client.telephone) {
  clientDb = await prisma.client.findUnique({
    where: {
      telephone: client.telephone,
    },
  });
}

await createNotification({
  titre: "Nouvelle vente",
  message: `Une vente a été effectuée`,
  type: "SUCCESS"
});

// Création si introuvable
if (!clientDb) {
  clientDb = await prisma.client.create({
    data: {
      prenom: client.prenom,
      telephone: client.telephone || null,
    },
  });
}

    // 2. VERIFICATION STOCK + TOTAL
    let total = 0;

    for (const p of produits) {
      const produit = await prisma.produit.findUnique({
        where: { id: Number(p.produitId) },
      });

      if (!produit) {
        return res.status(404).json({ error: "Produit introuvable" });
      }

      if (Number(produit.stockActuel) < Number(p.quantite)) {
        return res.status(400).json({
          error: `${produit.nom} : stock insuffisant (disponible ${produit.stockActuel})`,
        });
      }

      total += Number(p.prixUnitaire) * Number(p.quantite);
    }

    // 3. CREER vente 
    const vente = await prisma.vente.create({
      data: {
        clientId: clientDb.id,
        montant: total,
        type, // COMPTANT / CREDIT
      },
    });

    // 4. LIGNES + DIMINUTION STOCK
    for (const p of produits) {
      await prisma.ligneVente.create({
        data: {
          venteId: vente.id,
          produitId: Number(p.produitId),
          quantite: Number(p.quantite),
          prixUnitaire: Number(p.prixUnitaire),
        },
      });

      await prisma.produit.update({
        where: { id: Number(p.produitId) },
        data: {
          stockActuel: {
            decrement: Number(p.quantite),
          },
        },
      });
    }

    // 5. CAISSE + DETTE
    if (type === "COMPTANT") {
      await prisma.caisse.create({
        data: {
          type: "ENTREE",
          montant: total,
          description: "Vente comptant",
        },
      });
    }

    if (type === "CREDIT") {
      const reste = total - Number(acompte);

      const dette = await prisma.dette.create({
        data: {
          clientId: clientDb.id,
          montantTotal: total,
          montantPaye: Number(acompte),
          resteAPayer: reste,
          statut: reste <= 0 ? "PAYEE" : "EN_COURS",
        },
      });

      if (Number(acompte) > 0) {

        await prisma.caisse.create({
      data: {
        type: "ENTREE",
        montant: acompte,
        description: "Vente crédit",
      },
    });
  }
}

    // 6. RETOUR PROPRE (IMPORTANT pour frontend)
    return res.status(201).json({
      message: "Vente enregistrée avec succès",
      vente,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getVentes = async (req, res) => {
  try {
    const ventes = await prisma.vente.findMany({
      include: {
        client: {
          include: {
            dettes: true,
          },
        },
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

    res.json(ventes);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};