import prisma from "../config/prisma.js";
import { createNotification } from "./notificationController.js";

export const createVente = async (req, res) => {
  try {
    const { client, produits, type, acompte = 0 } = req.body;

    let clientDb = null;

    if (client.telephone) {
      clientDb = await prisma.client.findUnique({
        where: {
          telephone: client.telephone,
        },
      });
    }

    await createNotification({
      titre: "Nouvelle vente",
      message: "Une vente a été effectuée",
      type: "SUCCESS",
    });

    if (!clientDb) {
      clientDb = await prisma.client.create({
        data: {
          prenom: client.prenom,
          telephone: client.telephone || null,
        },
      });
    }

    let total = 0;

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

      if (Number(produit.stockActuel) < Number(p.quantite)) {
        return res.status(400).json({
          error: `${produit.nom} : stock insuffisant (disponible ${produit.stockActuel})`,
        });
      }

      total += Number(p.prixUnitaire) * Number(p.quantite);
    }
     console.log("BODY :", req.body);
     console.log("ACOMPTE REÇU :", acompte);
    const vente = await prisma.vente.create({
      data: {
        clientId: clientDb.id,
        montant: total,
        type,
        acompte: Number(acompte),
      },
    });
    console.log("VENTE CREEE :", vente);

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
        where: {
          id: Number(p.produitId),
        },
        data: {
          stockActuel: {
            decrement: Number(p.quantite),
          },
        },
      });
    }

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

      await prisma.dette.create({
        data: {
          clientId: clientDb.id,
          montantTotal: total,
          montantPaye: Number(acompte),
          acompteInitial: Number(acompte),
          resteAPayer: reste,
          statut: reste <= 0 ? "PAYEE" : "EN_COURS",
        },
      });

      if (Number(acompte) > 0) {
        await prisma.caisse.create({
          data: {
            type: "ENTREE",
            montant: Number(acompte),
            description: "Vente crédit",
          },
        });
      }
    }

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

    const ventesFormatees = ventes.map((vente) => ({
      ...vente,
      acompte: Number(vente.acompte || 0),
    }));

    return res.json(ventesFormatees);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};