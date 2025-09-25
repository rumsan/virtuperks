/*
  Warnings:

  - A unique constraint covering the columns `[userWalletAddress]` on the table `Phone` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Phone_userWalletAddress_key" ON "public"."Phone"("userWalletAddress");
