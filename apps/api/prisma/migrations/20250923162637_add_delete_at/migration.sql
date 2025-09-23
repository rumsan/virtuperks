-- AlterTable
ALTER TABLE "public"."Phone" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Redemption" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Reward" ADD COLUMN     "deletedAt" TIMESTAMP(3);
