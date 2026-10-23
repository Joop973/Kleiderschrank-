import type { Datenbank } from './typen';

/**
 * Kern-Migrationen. Index + 1 = Schema-Version (PRAGMA user_version).
 * Nie bestehende Einträge ändern, nur neue anhängen.
 */
export const KERN_MIGRATIONEN: readonly string[] = [
  `
  CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE extensions_state (
    extension_id TEXT PRIMARY KEY NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 0,
    enabled_at TEXT,
    notifications_allowed INTEGER NOT NULL DEFAULT 0,
    migrations_applied INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE hints (
    id TEXT PRIMARY KEY NOT NULL,
    art TEXT NOT NULL,
    source TEXT NOT NULL,
    priority INTEGER NOT NULL,
    payload_json TEXT,
    shown_at TEXT,
    dismissed_at TEXT,
    updated_at TEXT NOT NULL
  );
  `,
];

/** Bringt die Datenbank auf den neuesten Stand. Schema und Version ändern sich gemeinsam oder gar nicht. */
export async function migriere(
  db: Datenbank,
  migrationen: readonly string[] = KERN_MIGRATIONEN,
): Promise<number> {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  const zeile = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if (zeile === null) throw new Error('Schema-Version nicht lesbar');
  const version = zeile.user_version;
  if (version > migrationen.length) {
    throw new Error('Datenbank ist neuer als diese App-Version');
  }
  if (version === migrationen.length) return version;

  await db.withTransactionAsync(async () => {
    for (let i = version; i < migrationen.length; i++) {
      await db.execAsync(migrationen[i]);
    }
    await db.execAsync(`PRAGMA user_version = ${migrationen.length}`);
  });
  return migrationen.length;
}
