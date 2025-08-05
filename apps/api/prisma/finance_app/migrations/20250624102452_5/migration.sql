/*
  Warnings:

  - You are about to drop the column `expenseId` on the `tbl_accounts_txns` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `tbl_clients` table. All the data in the column will be lost.
  - You are about to drop the column `reconcileDetails` on the `tbl_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `tbl_users_details` table. All the data in the column will be lost.
  - You are about to drop the column `isEmployee` on the `tbl_users_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clientId]` on the table `tbl_clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `tbl_clients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectMemberRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateEnum
CREATE TYPE "TimeOffStatus" AS ENUM ('PENDING', 'HR_APPROVED', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TimeOffDuration" AS ENUM ('FULL_DAY', 'FIRST_HALF', 'SECOND_HALF');

-- CreateEnum
CREATE TYPE "TimeOffType" AS ENUM ('VACATION', 'SICK', 'PERSONAL', 'UNPAID', 'MATERNITY', 'PATERNITY', 'BEREAVEMENT', 'COMPASSIONATE', 'OTHER');

-- CreateEnum
CREATE TYPE "VatStatus" AS ENUM ('UNCLAIMED', 'CLAIMED', 'DELAYED_CLAIM', 'IGNORED');

-- DropForeignKey
ALTER TABLE "tbl_accounts_txns" DROP CONSTRAINT "tbl_accounts_txns_expenseId_fkey";

-- AlterTable
ALTER TABLE "tbl_accounts" ADD COLUMN     "isInternal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tbl_accounts_txns" DROP COLUMN "expenseId",
ADD COLUMN     "reconDetails" JSONB;

-- AlterTable
ALTER TABLE "tbl_categories" ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tbl_clients" DROP COLUMN "email",
ADD COLUMN     "clientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tbl_expenses" DROP COLUMN "reconcileDetails",
ADD COLUMN     "reconDetails" JSONB;

-- AlterTable
ALTER TABLE "tbl_settings" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "tbl_users_details" DROP COLUMN "accountId",
DROP COLUMN "isEmployee",
ADD COLUMN     "timeoffAllowance" JSONB;

-- CreateTable
CREATE TABLE "tbl_projects_members" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ProjectMemberRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_projects_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_incomes" (
    "cuid" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "vat" DOUBLE PRECISION NOT NULL,
    "bankFees" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT,
    "attachments" JSONB,
    "remarks" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDetails" JSONB,
    "isReconciled" BOOLEAN NOT NULL DEFAULT false,
    "reconDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_incomes_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_holidays" (
    "cuid" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_holidays_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_timeoff_request" (
    "cuid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TimeOffType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "daysDetails" JSONB,
    "totalDays" DOUBLE PRECISION NOT NULL,
    "status" "TimeOffStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "extras" JSONB,
    "attachments" JSONB,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "approvalDetails" JSONB,
    "approvalChallenge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_timeoff_request_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_timeoff" (
    "id" SERIAL NOT NULL,
    "timeOffId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "TimeOffType" NOT NULL,
    "duration" "TimeOffDuration" NOT NULL DEFAULT 'FULL_DAY',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tbl_timeoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_vat_purchases" (
    "cuid" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "invoiceAmount" DOUBLE PRECISION NOT NULL,
    "vatAmount" DOUBLE PRECISION NOT NULL,
    "status" "VatStatus" NOT NULL DEFAULT 'UNCLAIMED',
    "source" TEXT,
    "meta" JSONB,
    "vatFilingCuid" TEXT,

    CONSTRAINT "tbl_vat_purchases_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_vat_sales" (
    "cuid" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "invoiceAmount" DOUBLE PRECISION NOT NULL,
    "vatAmount" DOUBLE PRECISION NOT NULL,
    "status" "VatStatus" NOT NULL DEFAULT 'UNCLAIMED',
    "source" TEXT,
    "meta" JSONB,
    "vatFilingCuid" TEXT,

    CONSTRAINT "tbl_vat_sales_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_vat_filings" (
    "cuid" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION,
    "isFiled" BOOLEAN NOT NULL DEFAULT false,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "details" TEXT,
    "filedDate" TIMESTAMP(3),

    CONSTRAINT "tbl_vat_filings_pkey" PRIMARY KEY ("cuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_projects_members_id_key" ON "tbl_projects_members"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_incomes_cuid_key" ON "tbl_incomes"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_holidays_cuid_key" ON "tbl_holidays"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_timeoff_request_cuid_key" ON "tbl_timeoff_request"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_timeoff_request_approvalChallenge_key" ON "tbl_timeoff_request"("approvalChallenge");

-- CreateIndex
CREATE INDEX "TimeOffUserIdIndex" ON "tbl_timeoff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_timeoff_userId_date_key" ON "tbl_timeoff"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vat_purchases_cuid_key" ON "tbl_vat_purchases"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vat_sales_cuid_key" ON "tbl_vat_sales"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vat_filings_cuid_key" ON "tbl_vat_filings"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vat_filings_month_fiscalYear_key" ON "tbl_vat_filings"("month", "fiscalYear");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_clients_clientId_key" ON "tbl_clients"("clientId");

-- RenameForeignKey
ALTER TABLE "tbl_users_details" RENAME CONSTRAINT "UserDetails_Manager_fkey" TO "UserDetails_User_fkey";

-- AddForeignKey
ALTER TABLE "tbl_projects_members" ADD CONSTRAINT "tbl_projects_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tbl_projects"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_projects_members" ADD CONSTRAINT "tbl_projects_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users_details"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_incomes" ADD CONSTRAINT "tbl_incomes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "tbl_clients"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_incomes" ADD CONSTRAINT "tbl_incomes_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "tbl_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_incomes" ADD CONSTRAINT "tbl_incomes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tbl_projects"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_details" ADD CONSTRAINT "UserDetails_Manager_fkey" FOREIGN KEY ("managerId") REFERENCES "tbl_users"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_timeoff_request" ADD CONSTRAINT "tbl_timeoff_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users_details"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_timeoff" ADD CONSTRAINT "tbl_timeoff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users_details"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_timeoff" ADD CONSTRAINT "tbl_timeoff_timeOffId_fkey" FOREIGN KEY ("timeOffId") REFERENCES "tbl_timeoff_request"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vat_purchases" ADD CONSTRAINT "tbl_vat_purchases_vatFilingCuid_fkey" FOREIGN KEY ("vatFilingCuid") REFERENCES "tbl_vat_filings"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vat_sales" ADD CONSTRAINT "tbl_vat_sales_vatFilingCuid_fkey" FOREIGN KEY ("vatFilingCuid") REFERENCES "tbl_vat_filings"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
