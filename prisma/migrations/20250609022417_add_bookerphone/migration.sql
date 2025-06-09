/*
  Warnings:

  - Added the required column `bookerPhone` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "bookerPhone" TEXT NOT NULL,
ALTER COLUMN "endTime" SET DEFAULT NOW() + interval '1 hour';
