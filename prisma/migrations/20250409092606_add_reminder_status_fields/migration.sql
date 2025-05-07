-- CreateEnum
CREATE TYPE "ReminderSendStatus" AS ENUM ('SCHEDULED', 'SENT');

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "send1hr" "ReminderSendStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "send24hr" "ReminderSendStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "send48hr" "ReminderSendStatus" NOT NULL DEFAULT 'SCHEDULED';
