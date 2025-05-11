/*
  Warnings:

  - You are about to drop the column `imageFileId` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "imageFileId",
ADD COLUMN     "imageUrlFileId" TEXT;
