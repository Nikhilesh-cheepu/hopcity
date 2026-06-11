import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "prisma/config";

config({ path: resolve(process.cwd(), ".env.local") });
config();

// Migrations run from local/dev — always prefer the public Railway URL.
const databaseUrl =
  process.env.DATABASE_PUBLIC_URL?.trim() ??
  process.env.DATABASE_URL?.trim() ??
  "postgresql://placeholder:placeholder@localhost:5432/hopcity";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
