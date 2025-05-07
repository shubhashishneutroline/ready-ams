/*
  Warnings:

  - The `send1hr` column on the `Reminder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `send24hr` column on the `Reminder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `send48hr` column on the `Reminder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "send1hr",
ADD COLUMN     "send1hr" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "send24hr",
ADD COLUMN     "send24hr" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "send48hr",
ADD COLUMN     "send48hr" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "ReminderSendStatus";
