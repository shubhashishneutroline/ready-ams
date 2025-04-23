/*
  Warnings:

  - You are about to drop the column `resourceId` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_resourceId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "resourceId";

-- CreateTable
CREATE TABLE "_ResourceToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ResourceToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ResourceToService_B_index" ON "_ResourceToService"("B");

-- AddForeignKey
ALTER TABLE "_ResourceToService" ADD CONSTRAINT "_ResourceToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToService" ADD CONSTRAINT "_ResourceToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
