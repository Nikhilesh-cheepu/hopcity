import { NextResponse } from "next/server";
import {
  BOOKING_SOURCES,
  ENTRY_TYPES,
  formatOtherBookingSource,
  VENUES,
} from "@/data/venues";
import { db } from "@/lib/db";
import {
  parseDateRange,
  parseVisitDate,
  type ReservationRecord,
} from "@/lib/reservations";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

function serialize(r: {
  id: string;
  staffType: string;
  entryType: string;
  bookingSource: string;
  guestName: string;
  mobileNo: string;
  partySize: number;
  venue: string;
  visitDate: Date;
  createdAt: Date;
}): ReservationRecord {
  return {
    id: r.id,
    staffType: r.staffType,
    entryType: r.entryType,
    bookingSource: r.bookingSource,
    guestName: r.guestName,
    mobileNo: r.mobileNo,
    partySize: r.partySize,
    venue: r.venue,
    visitDate: r.visitDate.toISOString().slice(0, 10),
    createdAt: r.createdAt.toISOString(),
  };
}

function resolveDateFilter(searchParams: URLSearchParams) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  if (from && to) {
    return parseDateRange(from, to);
  }
  if (date) {
    const d = parseVisitDate(date);
    return { gte: d, lte: d };
  }
  return null;
}

export async function GET(request: Request) {
  if (!db?.reservation) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const venue = searchParams.get("venue");
  const bookingSource = searchParams.get("bookingSource");
  const dateFilter = resolveDateFilter(searchParams);

  if (!dateFilter) {
    return NextResponse.json(
      { error: "Provide date or from+to query params." },
      { status: 400 },
    );
  }

  try {
    const rows = await db.reservation.findMany({
      where: {
        visitDate: dateFilter,
        ...(venue && venue !== "all" ? { venue } : {}),
        ...(bookingSource && bookingSource !== "all"
          ? bookingSource === "other"
            ? { bookingSource: { startsWith: "other:" } }
            : { bookingSource }
          : {}),
      },
      orderBy: [{ visitDate: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ reservations: rows.map(serialize) });
  } catch (error) {
    console.error("Reservations fetch error:", error);
    return NextResponse.json({ error: "Failed to load reservations." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!db?.reservation) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const staffType = typeof body.staffType === "string" ? body.staffType.trim() : "";
    const entryType = typeof body.entryType === "string" ? body.entryType.trim() : "walkin";
    const bookingSourceRaw =
      typeof body.bookingSource === "string" ? body.bookingSource.trim() : "direct";
    const bookingSourceOther =
      typeof body.bookingSourceOther === "string" ? body.bookingSourceOther.trim() : "";
    const guestName = typeof body.guestName === "string" ? body.guestName.trim() : "";
    const mobileRaw = typeof body.mobileNo === "string" ? body.mobileNo.replace(/\D/g, "") : "";
    const partySize = Number(body.partySize);
    const venue = typeof body.venue === "string" ? body.venue.trim() : "";
    const visitDateStr = typeof body.visitDate === "string" ? body.visitDate : "";

    if (!staffType || !guestName || !venue || !visitDateStr) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    if (!ENTRY_TYPES.some((e) => e.id === entryType)) {
      return NextResponse.json({ error: "Invalid entry type." }, { status: 400 });
    }

    let bookingSource = entryType === "walkin" ? "direct" : bookingSourceRaw;

    if (entryType === "reserved") {
      if (bookingSource === "other") {
        if (!bookingSourceOther || bookingSourceOther.length > 40) {
          return NextResponse.json(
            { error: "Please enter where the reservation is from (max 40 characters)." },
            { status: 400 },
          );
        }
        bookingSource = formatOtherBookingSource(bookingSourceOther);
      } else if (!BOOKING_SOURCES.some((s) => s.id === bookingSource && s.id !== "direct")) {
        return NextResponse.json({ error: "Invalid booking source." }, { status: 400 });
      }
    }

    if (!MOBILE_REGEX.test(mobileRaw)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit Indian mobile number." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(partySize) || partySize < 1 || partySize > 50) {
      return NextResponse.json(
        { error: "Party size must be between 1 and 50." },
        { status: 400 },
      );
    }

    if (!VENUES.some((v) => v.id === venue)) {
      return NextResponse.json({ error: "Invalid venue selected." }, { status: 400 });
    }

    const row = await db.reservation.create({
      data: {
        staffType,
        entryType,
        bookingSource,
        guestName,
        mobileNo: mobileRaw,
        partySize,
        venue,
        visitDate: parseVisitDate(visitDateStr),
      },
    });

    return NextResponse.json({ reservation: serialize(row) }, { status: 201 });
  } catch (error) {
    console.error("Reservation create error:", error);
    return NextResponse.json({ error: "Failed to save entry." }, { status: 500 });
  }
}
