-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "staffType" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "venue" TEXT NOT NULL,
    "visitDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reservation_visitDate_idx" ON "Reservation"("visitDate");

-- CreateIndex
CREATE INDEX "Reservation_venue_idx" ON "Reservation"("venue");

-- CreateIndex
CREATE INDEX "Reservation_visitDate_venue_idx" ON "Reservation"("visitDate", "venue");
