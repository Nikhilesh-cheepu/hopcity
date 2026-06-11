import { NextResponse } from "next/server";
import { VENUES } from "@/data/venues";
import { db } from "@/lib/db";
import { parseVisitDate } from "@/lib/reservations";

export async function GET(request: Request) {
  if (!db?.reservation) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date is required." }, { status: 400 });
  }

  try {
    const visitDate = parseVisitDate(date);
    const rows = await db.reservation.findMany({
      where: { visitDate },
      select: { venue: true, partySize: true, entryType: true },
    });

    const byVenue: Record<string, { entries: number; guests: number }> = {};
    for (const v of VENUES) {
      byVenue[v.id] = { entries: 0, guests: 0 };
    }

    let totalEntries = 0;
    let totalGuests = 0;
    let walkins = 0;
    let reserved = 0;

    for (const row of rows) {
      totalEntries += 1;
      totalGuests += row.partySize;
      if (row.entryType === "reserved") reserved += 1;
      else walkins += 1;
      if (byVenue[row.venue]) {
        byVenue[row.venue].entries += 1;
        byVenue[row.venue].guests += row.partySize;
      }
    }

    return NextResponse.json({
      date,
      totalEntries,
      totalGuests,
      walkins,
      reserved,
      byVenue,
    });
  } catch (error) {
    console.error("Reservation stats error:", error);
    return NextResponse.json({ error: "Failed to load stats." }, { status: 500 });
  }
}
