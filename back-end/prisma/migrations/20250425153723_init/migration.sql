-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "type" TEXT;

-- CreateTable
CREATE TABLE "DriverDetails" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "licenseType" TEXT,
    "licenseExpire" TIMESTAMP(3),
    "phone" TEXT,
    "brithDate" TIMESTAMP(3),
    "workStart" TIMESTAMP(3),
    "vehicleId" UUID,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriverDetails_licenseNo_key" ON "DriverDetails"("licenseNo");

-- AddForeignKey
ALTER TABLE "DriverDetails" ADD CONSTRAINT "DriverDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverDetails" ADD CONSTRAINT "DriverDetails_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
