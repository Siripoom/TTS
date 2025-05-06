/*
  Warnings:

  - You are about to drop the column `greaseDate` on the `MaintenanceCost` table. All the data in the column will be lost.
  - Added the required column `maintenanceType` to the `MaintenanceCost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('pending', 'completed');

-- AlterTable
ALTER TABLE "MaintenanceCost" DROP COLUMN "greaseDate",
ADD COLUMN     "maintenanceType" TEXT NOT NULL,
ADD COLUMN     "status" "MaintenanceStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "technician" TEXT;
