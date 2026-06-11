import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";
import { resolveDatabaseUrl } from "@/lib/database-url";

function createPrismaClient(): PrismaClient | null {
  const url = resolveDatabaseUrl();
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
  return Boolean(client && "reservation" in client && "guestReminder" in client);
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
