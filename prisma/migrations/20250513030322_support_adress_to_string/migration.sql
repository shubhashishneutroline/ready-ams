/*
  Warnings:

  - Added the required column `supportAddress` to the `SupportBusinessDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "VideoProvider" ADD VALUE 'GOTO_MEETING';

-- DropForeignKey
ALTER TABLE "BusinessAddress" DROP CONSTRAINT "BusinessAddress_supportId_fkey";

-- AlterTable
ALTER TABLE "Individual" ADD COLUMN     "gotoAccessToken" TEXT;

-- AlterTable
ALTER TABLE "SupportBusinessDetail" ADD COLUMN     "supportAddress" TEXT NOT NULL;
