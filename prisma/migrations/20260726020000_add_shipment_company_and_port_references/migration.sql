-- AlterTable
ALTER TABLE "shipments" ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "destinationPortId" INTEGER,
ADD COLUMN     "originPortId" INTEGER;

-- CreateIndex
CREATE INDEX "shipments_companyId_idx" ON "shipments"("companyId");

-- CreateIndex
CREATE INDEX "shipments_shipId_idx" ON "shipments"("shipId");

-- CreateIndex
CREATE INDEX "shipments_originPortId_idx" ON "shipments"("originPortId");

-- CreateIndex
CREATE INDEX "shipments_destinationPortId_idx" ON "shipments"("destinationPortId");
