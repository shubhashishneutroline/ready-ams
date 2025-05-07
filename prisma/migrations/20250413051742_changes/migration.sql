/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `ReminderOffset` table. All the data in the column will be lost.
  - You are about to drop the column `sent` on the `ReminderOffset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "cancelledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ReminderOffset" DROP COLUMN "scheduledAt",
DROP COLUMN "sent";

-- CreateTable
CREATE TABLE "AppointmentReminderOffset" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "reminderOffsetId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AppointmentReminderOffset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppointmentReminderOffset" ADD CONSTRAINT "AppointmentReminderOffset_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentReminderOffset" ADD CONSTRAINT "AppointmentReminderOffset_reminderOffsetId_fkey" FOREIGN KEY ("reminderOffsetId") REFERENCES "ReminderOffset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
