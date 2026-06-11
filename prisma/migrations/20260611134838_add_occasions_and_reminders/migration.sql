-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "specialOccasion" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "specialOccasionLabel" TEXT;

-- CreateTable
CREATE TABLE "GuestReminder" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT,
    "guestName" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,
    "venue" TEXT,
    "specialOccasion" TEXT,
    "specialOccasionLabel" TEXT,
    "remindAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "GuestReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuestReminder_status_remindAt_idx" ON "GuestReminder"("status", "remindAt");

-- CreateIndex
CREATE INDEX "GuestReminder_reservationId_idx" ON "GuestReminder"("reservationId");

-- CreateIndex
CREATE INDEX "Reservation_specialOccasion_idx" ON "Reservation"("specialOccasion");

-- AddForeignKey
ALTER TABLE "GuestReminder" ADD CONSTRAINT "GuestReminder_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
