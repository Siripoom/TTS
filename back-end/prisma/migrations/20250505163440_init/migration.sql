/*
  Warnings:

  - Added the required column `productId` to the `InvoiceSupplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceSupplier" ADD COLUMN     "productId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "InvoiceSupplier" ADD CONSTRAINT "InvoiceSupplier_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
