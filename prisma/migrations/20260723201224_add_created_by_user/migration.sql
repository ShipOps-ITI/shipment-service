/*
  Warnings:

  - Added the required column `createdByUserId` to the `cargo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CargoStatus" AS ENUM ('Pending', 'Loaded', 'InTransit', 'Delivered', 'Damaged');

-- AlterTable
ALTER TABLE "cargo" ADD COLUMN     "createdByUserId" INTEGER NOT NULL,
ADD COLUMN     "status" "CargoStatus" NOT NULL DEFAULT 'Pending';
