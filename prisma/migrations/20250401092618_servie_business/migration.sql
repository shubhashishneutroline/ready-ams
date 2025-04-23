-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "businessDetailId" TEXT;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_businessDetailId_fkey" FOREIGN KEY ("businessDetailId") REFERENCES "BusinessDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
