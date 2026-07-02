-- CreateTable
CREATE TABLE "Vente" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER,
    "type" TEXT NOT NULL,
    "montant" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneVente" (
    "id" SERIAL NOT NULL,
    "venteId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaire" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "LigneVente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vente" ADD CONSTRAINT "Vente_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneVente" ADD CONSTRAINT "LigneVente_venteId_fkey" FOREIGN KEY ("venteId") REFERENCES "Vente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneVente" ADD CONSTRAINT "LigneVente_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
