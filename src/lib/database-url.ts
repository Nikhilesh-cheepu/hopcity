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

  // Railway private hostnames only resolve inside Railway — never use them elsewhere.
  if (databaseUrl && isRailwayInternalUrl(databaseUrl)) {
    return publicUrl;
  }

  const onRailway = Boolean(process.env.RAILWAY_ENVIRONMENT);
  if (onRailway) {
    return databaseUrl ?? publicUrl;
  }

  return publicUrl ?? databaseUrl;
}
