import type { ErweiterungsManifest, ErweiterungsZustand } from '../../core/steckplaetze/typen';
import type { Datenbank } from '../typen';

type Zeile = {
  extension_id: string;
  enabled: number;
  notifications_allowed: number;
  migrations_applied: number;
};

export async function leseErweiterungsZustand(db: Datenbank): Promise<ErweiterungsZustand[]> {
  const zeilen = await db.getAllAsync<Zeile>(
    'SELECT extension_id, enabled, notifications_allowed, migrations_applied FROM extensions_state',
  );
  return zeilen.map((z) => ({
    id: z.extension_id,
    eingeschaltet: z.enabled === 1,
    benachrichtigungenErlaubt: z.notifications_allowed === 1,
  }));
}

/** Prüft, dass eine Erweiterung nur eigene Tabellen (Präfix ext_<id>_) anlegt oder ändert. */
export function pruefeErweiterungsMigration(id: string, sql: string): void {
  const praefix = `ext_${id.toLowerCase()}_`;
  const tabellen = [
    ...sql.matchAll(/\b(?:TABLE|INDEX|INTO|UPDATE|ON)\s+(?:IF\s+(?:NOT\s+)?EXISTS\s+)?"?(\w+)"?/gi),
  ].map((t) => t[1].toLowerCase());
  const fremd = tabellen.filter((t) => !t.startsWith(praefix));
  if (fremd.length > 0) {
    throw new Error(`Erweiterung ${id} greift auf fremde Tabellen zu: ${fremd.join(', ')}`);
  }
}

/**
 * Schaltet eine Erweiterung ein oder aus. Beim Einschalten laufen offene Migrationen.
 * Ausschalten behält die Daten (Plan 5).
 */
export async function setzeErweiterung(
  db: Datenbank,
  manifest: ErweiterungsManifest,
  eingeschaltet: boolean,
  benachrichtigungenErlaubt: boolean,
  jetzt: Date = new Date(),
): Promise<void> {
  const zeitpunkt = jetzt.toISOString();
  await db.withTransactionAsync(async () => {
    const bisher = await db.getFirstAsync<Zeile>(
      'SELECT extension_id, enabled, notifications_allowed, migrations_applied FROM extensions_state WHERE extension_id = ?',
      [manifest.id],
    );
    let angewendet = bisher?.migrations_applied ?? 0;
    if (eingeschaltet) {
      for (; angewendet < manifest.migrationen.length; angewendet++) {
        const sql = manifest.migrationen[angewendet];
        pruefeErweiterungsMigration(manifest.id, sql);
        await db.execAsync(sql);
      }
    }
    await db.runAsync(
      `INSERT INTO extensions_state
         (extension_id, enabled, enabled_at, notifications_allowed, migrations_applied, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(extension_id) DO UPDATE SET
         enabled = excluded.enabled,
         enabled_at = CASE WHEN excluded.enabled = 1 AND extensions_state.enabled = 0
                           THEN excluded.enabled_at ELSE extensions_state.enabled_at END,
         notifications_allowed = excluded.notifications_allowed,
         migrations_applied = excluded.migrations_applied,
         updated_at = excluded.updated_at`,
      [
        manifest.id,
        eingeschaltet ? 1 : 0,
        eingeschaltet ? zeitpunkt : null,
        benachrichtigungenErlaubt ? 1 : 0,
        angewendet,
        zeitpunkt,
      ],
    );
  });
}

/** "Daten löschen": entfernt alle ext_<id>_-Tabellen, nur bei ausgeschalteter Erweiterung. */
export async function loescheErweiterungsDaten(db: Datenbank, id: string): Promise<void> {
  const zustand = await db.getFirstAsync<{ enabled: number }>(
    'SELECT enabled FROM extensions_state WHERE extension_id = ?',
    [id],
  );
  if (zustand?.enabled === 1) throw new Error('Erst ausschalten, dann Daten löschen');
  const praefix = `ext_${id.toLowerCase()}_`;
  const tabellen = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND substr(name, 1, ?) = ?",
    [praefix.length, praefix],
  );
  await db.withTransactionAsync(async () => {
    for (const { name } of tabellen) {
      if (!/^\w+$/.test(name)) continue;
      await db.execAsync(`DROP TABLE "${name}"`);
    }
    await db.runAsync('UPDATE extensions_state SET migrations_applied = 0 WHERE extension_id = ?', [
      id,
    ]);
  });
}
