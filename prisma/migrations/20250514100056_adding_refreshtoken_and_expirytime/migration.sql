/*
  Warnings:

  - You are about to drop the column `googleAccessToken` on the `Individual` table. All the data in the column will be lost.
  - You are about to drop the column `googleRefreshToken` on the `Individual` table. All the data in the column will be lost.
  - You are about to drop the column `gotoAccessToken` on the `Individual` table. All the data in the column will be lost.
  - You are about to drop the column `microsoftAccessToken` on the `Individual` table. All the data in the column will be lost.
  - You are about to drop the column `webexAccessToken` on the `Individual` table. All the data in the column will be lost.
  - You are about to drop the column `zoomAccessToken` on the `Individual` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlot` on the `Meeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "Individual" DROP COLUMN "googleAccessToken",
DROP COLUMN "googleRefreshToken",
DROP COLUMN "gotoAccessToken",
DROP COLUMN "microsoftAccessToken",
DROP COLUMN "webexAccessToken",
DROP COLUMN "zoomAccessToken",
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "timeSlot",
ADD COLUMN     "bookerTimezone" TEXT,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 hour',
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "VideoIntegration" (
    "id" TEXT NOT NULL,
    "individualId" TEXT NOT NULL,
    "provider" "VideoProvider" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoIntegration_individualId_provider_key" ON "VideoIntegration"("individualId", "provider");

-- AddForeignKey
ALTER TABLE "VideoIntegration" ADD CONSTRAINT "VideoIntegration_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "Individual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
