/*
  Warnings:

  - You are about to drop the column `send1hr` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `send24hr` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `send48hr` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "send1hr",
DROP COLUMN "send24hr",
DROP COLUMN "send48hr";
