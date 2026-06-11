import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured. Add Railway URLs to .env.local." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    await db.waitlistSignup.create({ data: { email } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: true, message: "You are already on the list." },
        { status: 200 },
      );
    }

    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
