/*
  Warnings:

  - You are about to drop the column `vehicleId` on the `DriverDetails` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CostStatus" AS ENUM ('pending', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "PaymentBy" AS ENUM ('company', 'driver');

-- DropForeignKey
ALTER TABLE "DriverDetails" DROP CONSTRAINT "DriverDetails_vehicleId_fkey";

-- AlterTable
ALTER TABLE "DriverDetails" DROP COLUMN "vehicleId";

-- CreateTable
CREATE TABLE "Cost" (
    "id" UUID NOT NULL,
    "vehicleId" UUID NOT NULL,
    "driverId" UUID,
    "costType" TEXT NOT NULL,
    "billNo" TEXT,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentBy" "PaymentBy" NOT NULL DEFAULT 'driver',
    "status" "CostStatus" NOT NULL DEFAULT 'pending',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
