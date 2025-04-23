/*
  Warnings:

  - Added the required column `phone` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL;
