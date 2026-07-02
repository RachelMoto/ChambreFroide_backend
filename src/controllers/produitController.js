import prisma from "../config/prisma.js";

export const getProduits = async (req, res) => {
  try {
    const produits = await prisma.produit.findMany();

    res.json(produits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduit = async (req, res) => {
  console.log("🔥 POST REÇU :", req.body);
  try {
    

    const produit = await prisma.produit.create({
      data: {
        nom: req.body.nom,
        categorie: req.body.categorie,
        stockInitial: Number(req.body.stockInitial),
        stockActuel: Number(req.body.stockActuel),
        prixCarton: Number(req.body.prixCarton),
      },
    });

    res.status(201).json(produit);
  } catch (error) {
    console?.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduit = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.produit.update({
      where: { id: Number(id) },
      data: {
        actif: false, // 🔥 on désactive au lieu de supprimer
      },
    });

    res.json({ message: "Produit désactivé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const reactiverProduit = async (req, res) => {
  try {
    const { id } = req.params;

    const produit = await prisma.produit.update({
      where: { id: Number(id) },
      data: { actif: true },
    });

    res.json(produit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduit = async (req, res) => {
  try {

    const produit = await prisma.produit.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        categorie: req.body.categorie,
        prixCarton: Number(req.body.prixCarton),
      },
    });

    res.json(produit);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};