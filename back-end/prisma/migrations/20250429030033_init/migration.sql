/*
  Warnings:

  - You are about to drop the column `brithDate` on the `Driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "brithDate",
ADD COLUMN     "brithDay" TIMESTAMP(3);
