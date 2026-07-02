/*
  Warnings:

  - Added the required column `stockApres` to the `Approvisionnement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockAvant` to the `Approvisionnement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Approvisionnement" ADD COLUMN     "stockApres" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "stockAvant" DECIMAL(65,30) NOT NULL;
