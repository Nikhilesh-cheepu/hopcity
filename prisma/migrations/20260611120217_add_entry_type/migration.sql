-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "entryType" TEXT NOT NULL DEFAULT 'walkin';

-- CreateIndex
CREATE INDEX "Reservation_entryType_idx" ON "Reservation"("entryType");
