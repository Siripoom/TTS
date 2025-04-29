-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "supplierId" UUID;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
