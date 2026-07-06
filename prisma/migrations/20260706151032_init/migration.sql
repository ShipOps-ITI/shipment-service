-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('Pending', 'Loaded', 'InTransit', 'Delivered', 'Delayed', 'Cancelled');

-- CreateTable
CREATE TABLE "shipments" (
    "id" SERIAL NOT NULL,
    "shipmentNumber" TEXT NOT NULL,
    "shipId" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo" (
    "id" SERIAL NOT NULL,
    "shipmentId" INTEGER NOT NULL,
    "cargoName" TEXT NOT NULL,
    "cargoType" TEXT NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "containerNumber" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipments_shipmentNumber_key" ON "shipments"("shipmentNumber");

-- AddForeignKey
ALTER TABLE "cargo" ADD CONSTRAINT "cargo_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
