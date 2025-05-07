-- AlterTable
ALTER TABLE "ReminderOffset" ADD COLUMN     "sent" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "TicketCategory";
