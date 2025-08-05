-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NPR', 'USD', 'GBP', 'EUR', 'USDC');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('VAT', 'PAN', 'ESTIMATE');

-- CreateEnum
CREATE TYPE "Service" AS ENUM ('API', 'EMAIL', 'PHONE', 'WALLET', 'GOOGLE', 'APPLE', 'FACEBOOK', 'TWITTER', 'GITHUB', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "SettingDataType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'OBJECT');

-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('EXPENSE', 'ADJUSTMENT', 'TRANSFER', 'INCOME');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('EMPLOYEE', 'VOLUNTEER', 'CONTRACTOR', 'INTERN');

-- CreateEnum
CREATE TYPE "DraftStatus" AS ENUM ('OPEN', 'CLOSE');

-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('PAID', 'PARTIAL', 'UNPAID');

-- CreateEnum
CREATE TYPE "InvoiceStatusType" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REIMBURSED');

-- CreateTable
CREATE TABLE "tbl_accounts" (
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NPR',
    "number" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "balanceLastUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_accounts_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_accounts_txns" (
    "cuid" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "refId" TEXT,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "category" "TxType",
    "expenseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_accounts_txns_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_categories" (
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" TEXT,
    "meta" JSONB,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_categories_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_projects" (
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "owner" TEXT,
    "meta" JSONB,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_projects_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_expenses" (
    "cuid" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'NPR',
    "vatAmount" INTEGER,
    "projectId" TEXT,
    "invoiceType" "InvoiceType" DEFAULT 'ESTIMATE',
    "accountId" TEXT,
    "attachments" JSONB,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "remarks" TEXT,
    "isPending" BOOLEAN NOT NULL DEFAULT true,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_expenses_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_salaries_draft" (
    "cuid" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "DraftStatus" NOT NULL DEFAULT 'OPEN',
    "numberOfEmployee" INTEGER NOT NULL,
    "numberOfEmployeePaid" INTEGER NOT NULL DEFAULT 0,
    "totalAmountDue" INTEGER,
    "totalAmountPaid" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_salaries_draft_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_salaries" (
    "cuid" TEXT NOT NULL,
    "employeeId" TEXT,
    "salaryDraftId" TEXT,
    "amountDue" INTEGER,
    "amountPaid" INTEGER DEFAULT 0,
    "isPartial" BOOLEAN NOT NULL DEFAULT false,
    "expenseId" TEXT,
    "status" "SalaryStatus" NOT NULL DEFAULT 'UNPAID',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_salaries_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_clients" (
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "email" TEXT,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_clients_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_invoices" (
    "cuid" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'NPR',
    "status" "InvoiceStatusType" NOT NULL DEFAULT 'PENDING',
    "projectId" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "receipts" JSONB,
    "approvalChallenge" TEXT,
    "invoiceType" "InvoiceType" DEFAULT 'ESTIMATE',
    "vatAmount" INTEGER,
    "expenseId" TEXT,
    "reason" TEXT,
    "reimbursedDate" TIMESTAMP(3),
    "reimbursedRemarks" TEXT,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_invoices_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_departments" (
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" TEXT,
    "owner" TEXT NOT NULL,
    "meta" JSONB,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "tbl_departments_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_users_details" (
    "cuid" TEXT NOT NULL,
    "name" TEXT,
    "departmentId" TEXT,
    "salary" INTEGER NOT NULL DEFAULT 0,
    "accountId" TEXT,
    "userType" "UserType",
    "managerId" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isEmployee" BOOLEAN NOT NULL DEFAULT true,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT
);

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
CREATE TABLE "tbl_auth_roles" (
    "cuid" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "tbl_auth_roles_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_auth_permissions" (
    "cuid" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "action" VARCHAR NOT NULL,
    "subject" VARCHAR NOT NULL,
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "conditions" JSONB,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_auth_permissions_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "tbl_users_roles" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "expiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,

    CONSTRAINT "tbl_users_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_auth" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "service" "Service" NOT NULL,
    "serviceId" TEXT NOT NULL,
    "details" JSONB,
    "challenge" TEXT,
    "falseAttempts" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedOnAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_auth_sessions" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "authId" INTEGER NOT NULL,
    "ip" TEXT,
    "details" JSONB,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_settings" (
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "dataType" "SettingDataType" NOT NULL,
    "requiredFields" TEXT[],
    "isReadOnly" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tbl_settings_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_accounts_cuid_key" ON "tbl_accounts"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_accounts_txns_cuid_key" ON "tbl_accounts_txns"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_categories_cuid_key" ON "tbl_categories"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_categories_name_group_key" ON "tbl_categories"("name", "group");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_projects_cuid_key" ON "tbl_projects"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_projects_name_key" ON "tbl_projects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_expenses_cuid_key" ON "tbl_expenses"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_salaries_draft_cuid_key" ON "tbl_salaries_draft"("cuid");

-- CreateIndex
CREATE INDEX "tbl_salaries_draft_month_year_idx" ON "tbl_salaries_draft"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_salaries_draft_month_year_key" ON "tbl_salaries_draft"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_salaries_cuid_key" ON "tbl_salaries"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_clients_cuid_key" ON "tbl_clients"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_invoices_cuid_key" ON "tbl_invoices"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_invoices_approvalChallenge_key" ON "tbl_invoices"("approvalChallenge");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_departments_cuid_key" ON "tbl_departments"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_departments_name_key" ON "tbl_departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_details_cuid_key" ON "tbl_users_details"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_cuid_key" ON "tbl_users"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_roles_cuid_key" ON "tbl_auth_roles"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_roles_name_key" ON "tbl_auth_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_permissions_cuid_key" ON "tbl_auth_permissions"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_roles_userId_roleId_key" ON "tbl_users_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_service_serviceId_key" ON "tbl_auth"("service", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_sessions_sessionId_key" ON "tbl_auth_sessions"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_settings_name_key" ON "tbl_settings"("name");

-- AddForeignKey
ALTER TABLE "tbl_accounts_txns" ADD CONSTRAINT "tbl_accounts_txns_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "tbl_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_accounts_txns" ADD CONSTRAINT "tbl_accounts_txns_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "tbl_expenses"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_projects" ADD CONSTRAINT "tbl_projects_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "tbl_departments"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_projects" ADD CONSTRAINT "tbl_projects_owner_fkey" FOREIGN KEY ("owner") REFERENCES "tbl_users_details"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_expenses" ADD CONSTRAINT "tbl_expenses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tbl_projects"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_expenses" ADD CONSTRAINT "tbl_expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "tbl_categories"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_expenses" ADD CONSTRAINT "tbl_expenses_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "tbl_accounts"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_expenses" ADD CONSTRAINT "tbl_expenses_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "tbl_departments"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_salaries" ADD CONSTRAINT "tbl_salaries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "tbl_users_details"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_salaries" ADD CONSTRAINT "tbl_salaries_salaryDraftId_fkey" FOREIGN KEY ("salaryDraftId") REFERENCES "tbl_salaries_draft"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_salaries" ADD CONSTRAINT "tbl_salaries_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "tbl_expenses"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_invoices" ADD CONSTRAINT "tbl_invoices_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "tbl_categories"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_invoices" ADD CONSTRAINT "tbl_invoices_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tbl_projects"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_invoices" ADD CONSTRAINT "tbl_invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users_details"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_invoices" ADD CONSTRAINT "tbl_invoices_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "tbl_expenses"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_departments" ADD CONSTRAINT "tbl_departments_owner_fkey" FOREIGN KEY ("owner") REFERENCES "tbl_users"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_details" ADD CONSTRAINT "UserDetails_Manager_fkey" FOREIGN KEY ("cuid") REFERENCES "tbl_users"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_details" ADD CONSTRAINT "tbl_users_details_cuid_fkey" FOREIGN KEY ("cuid") REFERENCES "tbl_users"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_details" ADD CONSTRAINT "UserDetails_Department_fkey" FOREIGN KEY ("departmentId") REFERENCES "tbl_departments"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_auth_permissions" ADD CONSTRAINT "tbl_auth_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "tbl_auth_roles"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_roles" ADD CONSTRAINT "tbl_users_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_roles" ADD CONSTRAINT "tbl_users_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "tbl_auth_roles"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_auth" ADD CONSTRAINT "tbl_auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_auth_sessions" ADD CONSTRAINT "tbl_auth_sessions_authId_fkey" FOREIGN KEY ("authId") REFERENCES "tbl_auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
