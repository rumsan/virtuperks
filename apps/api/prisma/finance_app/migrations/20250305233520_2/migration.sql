/*
  Warnings:

  - You are about to drop the column `balanceLastUpdatedAt` on the `tbl_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `tbl_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `tbl_accounts_txns` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `tbl_accounts_txns` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tbl_accounts_txns` table. All the data in the column will be lost.
  - You are about to drop the column `refId` on the `tbl_accounts_txns` table. All the data in the column will be lost.
  - You are about to drop the column `isPending` on the `tbl_expenses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId,txnId]` on the table `tbl_accounts_txns` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creditAmount` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debitAmount` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnCurrencyCode` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnDate` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnId` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountTxnStatus" AS ENUM ('UNRECONCILED', 'RECONCILED', 'DISCARDED');

-- CreateEnum
CREATE TYPE "AccountTxnType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT');

-- DropForeignKey
ALTER TABLE "tbl_accounts_txns" DROP CONSTRAINT "tbl_accounts_txns_expenseId_fkey";

-- AlterTable
ALTER TABLE "tbl_accounts" DROP COLUMN "balanceLastUpdatedAt",
DROP COLUMN "number",
ADD COLUMN     "acctNumber" TEXT,
ADD COLUMN     "bankCode" TEXT,
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "tbl_accounts_txns" DROP COLUMN "amount",
DROP COLUMN "category",
DROP COLUMN "name",
DROP COLUMN "refId",
ADD COLUMN     "balanceAmount" DOUBLE PRECISION,
ADD COLUMN     "chequeNumber" TEXT,
ADD COLUMN     "creditAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "debitAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "pstdDate" TIMESTAMP(3),
ADD COLUMN     "status" "AccountTxnStatus" NOT NULL DEFAULT 'UNRECONCILED',
ADD COLUMN     "txnAmount" DOUBLE PRECISION,
ADD COLUMN     "txnCode" TEXT,
ADD COLUMN     "txnCurrencyCode" TEXT NOT NULL,
ADD COLUMN     "txnDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "txnId" TEXT NOT NULL,
ADD COLUMN     "type" "AccountTxnType",
ALTER COLUMN "expenseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tbl_auth_roles" ALTER COLUMN "createdBy" SET DATA TYPE TEXT,
ALTER COLUMN "updatedBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "tbl_expenses" DROP COLUMN "isPending",
ADD COLUMN     "isReconciled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reconcileDetails" JSONB,
ADD COLUMN     "verificationDetails" JSONB,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "vatAmount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "tbl_invoices" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "vatAmount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "tbl_salaries" ALTER COLUMN "amountDue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "amountPaid" SET DEFAULT 0,
ALTER COLUMN "amountPaid" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "tbl_salaries_draft" ALTER COLUMN "totalAmountDue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalAmountPaid" SET DEFAULT 0,
ALTER COLUMN "totalAmountPaid" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "tbl_users_details" ALTER COLUMN "salary" SET DEFAULT 0,
ALTER COLUMN "salary" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "tbl_users_roles" ALTER COLUMN "createdBy" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_accounts_txns_accountId_txnId_key" ON "tbl_accounts_txns"("accountId", "txnId");

-- AddForeignKey
ALTER TABLE "tbl_accounts_txns" ADD CONSTRAINT "tbl_accounts_txns_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "tbl_expenses"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
