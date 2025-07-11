/*
  Warnings:

  - The primary key for the `Redemption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Redemption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Redemption" DROP CONSTRAINT "Redemption_pkey",
DROP COLUMN "id",
ADD COLUMN     "cuid" SERIAL NOT NULL,
ADD CONSTRAINT "Redemption_pkey" PRIMARY KEY ("cuid");
