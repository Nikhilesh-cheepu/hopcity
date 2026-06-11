-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "bookingSource" TEXT NOT NULL DEFAULT 'direct';

-- CreateIndex
CREATE INDEX "Reservation_bookingSource_idx" ON "Reservation"("bookingSource");
