/*
  Warnings:

  - You are about to drop the column `bookerPhone` on the `Meeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "bookerPhone",
ALTER COLUMN "endTime" SET DEFAULT NOW() + interval '1 hour';
