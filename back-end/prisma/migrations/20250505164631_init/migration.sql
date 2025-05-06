/*
  Warnings:

  - Added the required column `cost` to the `InvoiceSupplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `InvoiceSupplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceSupplier" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;
