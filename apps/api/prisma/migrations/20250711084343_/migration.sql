/*
  Warnings:

  - You are about to alter the column `tokens` on the `Redemption` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tokens` on the `Reward` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Redemption" ALTER COLUMN "tokens" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Reward" ALTER COLUMN "tokens" SET DATA TYPE INTEGER;
