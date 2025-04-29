-- AlterTable
ALTER TABLE "DriverDetails" ADD COLUMN     "vehicleId" UUID;

-- AlterTable
ALTER TABLE "DriverPayment" ADD COLUMN     "vehicleId" UUID;

-- AddForeignKey
ALTER TABLE "DriverDetails" ADD CONSTRAINT "DriverDetails_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverPayment" ADD CONSTRAINT "DriverPayment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
