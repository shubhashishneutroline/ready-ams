/*
  Warnings:

  - You are about to drop the column `sent` on the `AppointmentReminderOffset` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'TRIGGERED', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "BusinessTimeType" AS ENUM ('WORK', 'BREAK');

-- CreateEnum
CREATE TYPE "VideoProvider" AS ENUM ('ZOOM', 'GOOGLE_MEET', 'MICROSOFT_TEAMS');

-- AlterTable
ALTER TABLE "AppointmentReminderOffset" DROP COLUMN "sent",
ADD COLUMN     "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "BusinessDetail" ADD COLUMN     "businessOwner" TEXT;

-- AlterTable
ALTER TABLE "BusinessTime" ADD COLUMN     "type" "BusinessTimeType" NOT NULL DEFAULT 'WORK';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "imageFileId" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "Individual" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "position" TEXT NOT NULL,
    "profileImage" TEXT,
    "country" TEXT NOT NULL,
    "zoomAccessToken" TEXT,
    "googleAccessToken" TEXT,
    "googleRefreshToken" TEXT,
    "microsoftAccessToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Individual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timeSlot" TIMESTAMP(3) NOT NULL,
    "bookedByName" TEXT NOT NULL,
    "bookedByEmail" TEXT NOT NULL,
    "customAnswers" JSONB,
    "videoUrl" TEXT,
    "videoProvider" "VideoProvider",
    "slug" TEXT,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "individualId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Individual_userId_key" ON "Individual"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_slug_key" ON "Meeting"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- AddForeignKey
ALTER TABLE "BusinessDetail" ADD CONSTRAINT "BusinessDetail_businessOwner_fkey" FOREIGN KEY ("businessOwner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Individual" ADD CONSTRAINT "Individual_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "Individual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
