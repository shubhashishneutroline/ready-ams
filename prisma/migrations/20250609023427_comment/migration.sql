/*
  Warnings:

  - You are about to drop the column `customAnswers` on the `Meeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "customAnswers",
ADD COLUMN     "comment" TEXT,
ALTER COLUMN "endTime" SET DEFAULT NOW() + interval '1 hour';
