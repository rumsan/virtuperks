-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('EMPLOYEE', 'VOLUNTEER', 'CONTRACTOR', 'INTERN');

-- CreateTable
CREATE TABLE "public"."tbl_users" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL DEFAULT 'UNKNOWN',
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
CREATE TABLE "public"."tbl_users_details" (
    "cuid" TEXT NOT NULL,
    "name" TEXT,
    "departmentId" TEXT,
    "salary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userType" "public"."UserType",
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
CREATE UNIQUE INDEX "tbl_users_cuid_key" ON "public"."tbl_users"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_wallet_key" ON "public"."tbl_users"("wallet");

-- CreateIndex
CREATE INDEX "tbl_users_wallet_idx" ON "public"."tbl_users"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_details_cuid_key" ON "public"."tbl_users_details"("cuid");

-- AddForeignKey
ALTER TABLE "public"."tbl_users_details" ADD CONSTRAINT "UserDetails_Manager_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."tbl_users"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_users_details" ADD CONSTRAINT "UserDetails_User_fkey" FOREIGN KEY ("cuid") REFERENCES "public"."tbl_users"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
