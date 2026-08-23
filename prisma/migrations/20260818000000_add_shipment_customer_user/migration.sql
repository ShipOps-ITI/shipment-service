ALTER TABLE "shipments" ADD COLUMN "customerUserId" INTEGER;

CREATE INDEX "shipments_customerUserId_idx" ON "shipments"("customerUserId");
