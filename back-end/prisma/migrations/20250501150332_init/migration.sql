/*
  Warnings:

  - You are about to drop the column `lite` on the `FuelCost` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerLitre` on the `FuelCost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FuelCost" DROP COLUMN "lite",
DROP COLUMN "pricePerLitre",
ADD COLUMN     "liters" DOUBLE PRECISION,
ADD COLUMN     "pricePerLiter" DOUBLE PRECISION;
