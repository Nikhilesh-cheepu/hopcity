import { NextResponse } from "next/server";
import { BOOKING_SOURCES, VENUES } from "@/data/venues";
import { db } from "@/lib/db";
import { parseDateRange, parseVisitDate } from "@/lib/reservations";
import { addToWindowStats, emptyWindowStats } from "@/lib/service-windows";

function resolveDateFilter(searchParams: URLSearchParams) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  if (from && to) {
    return { range: parseDateRange(from, to), from, to };
  }
  if (date) {
    const d = parseVisitDate(date);
    return { range: { gte: d, lte: d }, from: date, to: date };
  }
  return null;
}

export async function GET(request: Request) {
  if (!db?.reservation) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const resolved = resolveDateFilter(searchParams);

  if (!resolved) {
    return NextResponse.json(
      { error: "Provide date or from+to query params." },
      { status: 400 },
    );
  }

  try {
    const rows = await db.reservation.findMany({
      where: { visitDate: resolved.range },
      select: {
        venue: true,
        partySize: true,
        entryType: true,
        bookingSource: true,
        createdAt: true,
      },
    });

    const byVenue: Record<string, { entries: number; guests: number }> = {};
    for (const v of VENUES) {
      byVenue[v.id] = { entries: 0, guests: 0 };
    }

    const byWindow = emptyWindowStats();
    const byBookingSource: Record<string, { entries: number; guests: number }> = {};
    for (const s of BOOKING_SOURCES) {
      byBookingSource[s.id] = { entries: 0, guests: 0 };
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
      addToWindowStats(byWindow, row.createdAt.toISOString(), row.partySize);
      const sourceKey = row.bookingSource?.startsWith("other:")
        ? "other"
        : (row.bookingSource ?? "direct");
      if (byBookingSource[sourceKey]) {
        byBookingSource[sourceKey].entries += 1;
        byBookingSource[sourceKey].guests += row.partySize;
      }
    }

    return NextResponse.json({
      from: resolved.from,
      to: resolved.to,
      totalEntries,
      totalGuests,
      walkins,
      reserved,
      byVenue,
      byWindow,
      byBookingSource,
    });
  } catch (error) {
    console.error("Reservation stats error:", error);
    return NextResponse.json({ error: "Failed to load stats." }, { status: 500 });
  }
}
