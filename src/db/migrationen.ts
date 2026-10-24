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
  // 2: Schrank, Tragen und Wäsche (Plan 8)
  `
  CREATE TABLE items (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    pattern TEXT,
    cut TEXT,
    details_json TEXT NOT NULL DEFAULT '{}',
    formality INTEGER,
    seasons_json TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'active',
    purchase_price_cents INTEGER,
    purchase_date TEXT,
    shop TEXT,
    favorite INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT
  );
  CREATE TABLE item_colors (
    item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    hex TEXT NOT NULL,
    lab_l REAL,
    lab_a REAL,
    lab_b REAL,
    name_de TEXT,
    PRIMARY KEY (item_id, rank)
  );
  CREATE TABLE item_labels (
    item_id TEXT PRIMARY KEY NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    brand TEXT,
    size_system TEXT,
    size_value TEXT,
    size_secondary TEXT,
    composition_json TEXT,
    origin TEXT,
    article_no TEXT
  );
  CREATE TABLE item_care (
    item_id TEXT PRIMARY KEY NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    symbols_json TEXT NOT NULL DEFAULT '[]',
    care_effort TEXT
  );
  CREATE TABLE laundry_state (
    item_id TEXT PRIMARY KEY NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    state TEXT NOT NULL DEFAULT 'clean',
    wears_since_wash INTEGER NOT NULL DEFAULT 0,
    washes_total INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE wear_logs (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    outfit_id TEXT,
    event_title TEXT,
    weather_json TEXT,
    feedback_json TEXT,
    source TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE wear_log_items (
    wear_log_id TEXT NOT NULL REFERENCES wear_logs(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES items(id),
    PRIMARY KEY (wear_log_id, item_id)
  );
  CREATE INDEX wear_log_items_item ON wear_log_items (item_id);
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
