/*
  Warnings:

  - You are about to drop the column `userId` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TruckQueue" DROP CONSTRAINT "TruckQueue_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_userId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "TruckQueue" ADD CONSTRAINT "TruckQueue_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
