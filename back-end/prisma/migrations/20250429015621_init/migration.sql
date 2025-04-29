/*
  Warnings:

  - You are about to drop the column `driverId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `DriverDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DriverDetails" DROP CONSTRAINT "DriverDetails_userId_fkey";

-- DropForeignKey
ALTER TABLE "DriverDetails" DROP CONSTRAINT "DriverDetails_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_driverId_fkey";

-- AlterTable
ALTER TABLE "FuelCost" ADD COLUMN     "driverId" UUID,
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "lite" DOUBLE PRECISION,
ADD COLUMN     "pricePerLitre" DOUBLE PRECISION,
ALTER COLUMN "cost" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "driverId",
ADD COLUMN     "userId" UUID;

-- DropTable
DROP TABLE "DriverDetails";

-- CreateTable
CREATE TABLE "Driver" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "licenseType" TEXT,
    "licenseExpire" TIMESTAMP(3),
    "phone" TEXT,
    "brithDate" TIMESTAMP(3),
    "workStart" TIMESTAMP(3),
    "vehicleId" UUID,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNo_key" ON "Driver"("licenseNo");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelCost" ADD CONSTRAINT "FuelCost_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
