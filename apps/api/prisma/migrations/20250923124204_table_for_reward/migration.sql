-- CreateEnum
CREATE TYPE "public"."RedemptionStatus" AS ENUM ('PENDING', 'PROCESSING', 'FAILED', 'CANCELLED', 'REJECTED', 'SUCCESS');

-- CreateTable
CREATE TABLE "public"."Reward" (
    "cuid" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "tokens" INTEGER NOT NULL,
    "wallet" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "public"."Phone" (
    "cuid" TEXT NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "userWalletAddress" VARCHAR(42) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "public"."Redemption" (
    "cuid" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "phoneId" TEXT NOT NULL,
    "transactionHash" VARCHAR(66) NOT NULL,
    "status" "public"."RedemptionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("cuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reward_cuid_key" ON "public"."Reward"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "Phone_cuid_key" ON "public"."Phone"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "Phone_phoneNumber_key" ON "public"."Phone"("phoneNumber");

-- CreateIndex
CREATE INDEX "Phone_phoneNumber_idx" ON "public"."Phone"("phoneNumber");

-- CreateIndex
CREATE INDEX "Phone_userWalletAddress_idx" ON "public"."Phone"("userWalletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_cuid_key" ON "public"."Redemption"("cuid");

-- CreateIndex
CREATE INDEX "Redemption_rewardId_idx" ON "public"."Redemption"("rewardId");

-- CreateIndex
CREATE INDEX "Redemption_phoneId_idx" ON "public"."Redemption"("phoneId");

-- CreateIndex
CREATE INDEX "Redemption_status_idx" ON "public"."Redemption"("status");

-- AddForeignKey
ALTER TABLE "public"."Redemption" ADD CONSTRAINT "Redemption_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "public"."Reward"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Redemption" ADD CONSTRAINT "Redemption_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "public"."Phone"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
