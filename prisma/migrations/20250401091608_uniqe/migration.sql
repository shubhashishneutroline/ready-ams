/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `BusinessDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDetail_email_key" ON "BusinessDetail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_email_key" ON "Resource"("email");
