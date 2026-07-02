-- CreateTable
CREATE TABLE "Approvisionnement" (
    "id" SERIAL NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantite" DECIMAL(65,30) NOT NULL,
    "prixAchat" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Approvisionnement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Approvisionnement" ADD CONSTRAINT "Approvisionnement_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
