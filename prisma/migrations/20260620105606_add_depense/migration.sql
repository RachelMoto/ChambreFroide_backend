-- CreateTable
CREATE TABLE "Depense" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" DECIMAL(65,30) NOT NULL,
    "categorie" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Depense_pkey" PRIMARY KEY ("id")
);
