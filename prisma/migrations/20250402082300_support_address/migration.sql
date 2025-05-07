-- DropForeignKey
ALTER TABLE "BusinessAvailability" DROP CONSTRAINT "BusinessAvailability_supportBusinessDetailId_fkey";

-- AlterTable
ALTER TABLE "BusinessAddress" ADD COLUMN     "supportId" TEXT,
ALTER COLUMN "businessId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BusinessAvailability" ALTER COLUMN "businessId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BusinessAddress" ADD CONSTRAINT "BusinessAddress_supportId_fkey" FOREIGN KEY ("supportId") REFERENCES "SupportBusinessDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessAvailability" ADD CONSTRAINT "BusinessAvailability_supportBusinessDetailId_fkey" FOREIGN KEY ("supportBusinessDetailId") REFERENCES "SupportBusinessDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
