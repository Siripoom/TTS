-- DropForeignKey
ALTER TABLE "Cost" DROP CONSTRAINT "Cost_driverId_fkey";

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
