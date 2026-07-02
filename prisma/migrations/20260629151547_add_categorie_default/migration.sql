/*
  Warnings:

  - You are about to drop the column `referenceId` on the `Caisse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Caisse" DROP COLUMN "referenceId",
ADD COLUMN     "categorie" TEXT NOT NULL DEFAULT 'VENTE';
