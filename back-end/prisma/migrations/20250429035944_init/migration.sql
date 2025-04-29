/*
  Warnings:

  - You are about to drop the column `brithDay` on the `Driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "brithDay",
ADD COLUMN     "birthDay" TIMESTAMP(3);
