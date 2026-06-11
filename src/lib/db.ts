import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

function getDatabaseUrl(): string | undefined {
  return process.env.NODE_ENV === "development"
    ? (process.env.DATABASE_PUBLIC_URL ?? process.env.DATABASE_URL)
    : process.env.DATABASE_URL;
}

function createPrismaClient(): PrismaClient | null {
  const url = getDatabaseUrl();
  if (!url) {
    return null;
  }

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function isUsableClient(
  client: PrismaClient | null | undefined,
): client is PrismaClient {
  return Boolean(client && "reservation" in client);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
};

if (!isUsableClient(globalForPrisma.prisma)) {
  globalForPrisma.prisma = createPrismaClient();
}

export const db = globalForPrisma.prisma ?? null;

if (process.env.NODE_ENV !== "production" && db) {
  globalForPrisma.prisma = db;
}
