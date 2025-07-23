-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('EMPLOYEE', 'VOLUNTEER', 'CONTRACTOR', 'INTERN');

-- CreateTable
CREATE TABLE "tbl_users" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "email" TEXT,
    "phone" TEXT,
    "wallet" TEXT,
    "notes" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_users_details" (
    "cuid" TEXT NOT NULL,
    "name" TEXT,
    "departmentId" TEXT,
    "salary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userType" "UserType",
    "managerId" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "extras" JSONB,
    "timeoffAllowance" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_cuid_key" ON "tbl_users"("cuid");

-- CreateIndex
CREATE INDEX "tbl_users_wallet_idx" ON "tbl_users"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_details_cuid_key" ON "tbl_users_details"("cuid");

-- AddForeignKey
ALTER TABLE "tbl_users_details" ADD CONSTRAINT "UserDetails_Manager_fkey" FOREIGN KEY ("managerId") REFERENCES "tbl_users"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_details" ADD CONSTRAINT "UserDetails_User_fkey" FOREIGN KEY ("cuid") REFERENCES "tbl_users"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
