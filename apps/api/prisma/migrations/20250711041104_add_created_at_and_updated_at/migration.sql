/*
  Warnings:

  - You are about to drop the column `redeemedAt` on the `Redemption` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Redemption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Redemption" DROP COLUMN "redeemedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
