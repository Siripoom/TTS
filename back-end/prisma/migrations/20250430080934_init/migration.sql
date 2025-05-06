-- DropForeignKey
ALTER TABLE "FuelCost" DROP CONSTRAINT "FuelCost_driverId_fkey";

-- AddForeignKey
ALTER TABLE "FuelCost" ADD CONSTRAINT "FuelCost_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
