import type { Datenbank } from '../typen';

export async function leseEinstellung(db: Datenbank, schluessel: string): Promise<string | null> {
  const zeile = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    [schluessel],
  );
  return zeile?.value ?? null;
}

export async function schreibeEinstellung(
  db: Datenbank,
  schluessel: string,
  wert: string,
  jetzt: Date = new Date(),
): Promise<void> {
  await db.runAsync(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    [schluessel, wert, jetzt.toISOString()],
  );
}
