/*
  Warnings:

  - You are about to drop the column `reference` on the `Paiement` table. All the data in the column will be lost.
  - You are about to drop the column `actif` on the `Produit` table. All the data in the column will be lost.
  - Added the required column `type` to the `Commande` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commande" ADD COLUMN     "acompte" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LigneVente" ALTER COLUMN "quantite" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Paiement" DROP COLUMN "reference";

-- AlterTable
ALTER TABLE "Produit" DROP COLUMN "actif";
