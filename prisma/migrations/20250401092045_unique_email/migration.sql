/*
  Warnings:

  - A unique constraint covering the columns `[supportEmail]` on the table `SupportBusinessDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SupportBusinessDetail_supportEmail_key" ON "SupportBusinessDetail"("supportEmail");
