function isRailwayInternalUrl(url: string): boolean {
  return url.includes(".railway.internal");
}

function trimEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

/** Pick the Postgres URL that works in the current runtime. */
export function resolveDatabaseUrl(): string | undefined {
  const databaseUrl = trimEnv(process.env.DATABASE_URL);
  const publicUrl = trimEnv(process.env.DATABASE_PUBLIC_URL);
  const onRailway = Boolean(process.env.RAILWAY_ENVIRONMENT);
  const isDev = process.env.NODE_ENV === "development";

  // Local dev, Vercel, and any host outside Railway need the public URL.
  if (isDev || process.env.VERCEL === "1" || !onRailway) {
    if (publicUrl) return publicUrl;
    if (databaseUrl && !isRailwayInternalUrl(databaseUrl)) return databaseUrl;
    return undefined;
  }

  // Railway-hosted app: prefer private network, fall back to public.
  if (databaseUrl) return databaseUrl;
  return publicUrl;
}
