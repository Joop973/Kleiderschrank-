import type { KleidungsArt } from '../../core/wardrobe/KleidungsBild';
import type { Kategorie, Teil } from '../../core/wardrobe/teil';
import type { Tag } from '../../core/zeit/datum';
import type { Datenbank } from '../typen';

/** Felder, die (noch) keine eigene Spalte haben, liegen in details_json. */
type Details = {
  art: KleidungsArt;
  pflegeText: string;
  /** Tragezahl vor Beginn der Aufzeichnung (Beispieldaten, Import). */
  getragenVorher: number;
  zuletztText: string;
};

const AUFWAND_IN_DB = { wenig: 'low', mittel: 'mid', viel: 'high' } as const;
const AUFWAND_AUS_DB = { low: 'wenig', mid: 'mittel', high: 'viel' } as const;

type Zeile = {
  id: string;
  name: string;
  category: string;
  details_json: string;
  purchase_price_cents: number | null;
  hex: string | null;
  name_de: string | null;
  brand: string | null;
  size_value: string | null;
  composition_json: string | null;
  care_effort: keyof typeof AUFWAND_AUS_DB | null;
  state: string | null;
  getragen_neu: number;
  zuletzt_datum: string | null;
};

const ABFRAGE = `
  SELECT i.id, i.name, i.category, i.details_json, i.purchase_price_cents,
         c.hex, c.name_de, l.brand, l.size_value, l.composition_json, k.care_effort, w.state,
         (SELECT COUNT(*) FROM wear_log_items wi WHERE wi.item_id = i.id) AS getragen_neu,
         (SELECT MAX(wl.date) FROM wear_log_items wi JOIN wear_logs wl ON wl.id = wi.wear_log_id
           WHERE wi.item_id = i.id) AS zuletzt_datum
  FROM items i
  LEFT JOIN item_colors c ON c.item_id = i.id AND c.rank = 0
  LEFT JOIN item_labels l ON l.item_id = i.id
  LEFT JOIN item_care k ON k.item_id = i.id
  LEFT JOIN laundry_state w ON w.item_id = i.id
  WHERE i.deleted_at IS NULL AND i.status = 'active'
  ORDER BY i.created_at DESC, i.rowid ASC`;

function ausZeile(z: Zeile, heute: Tag): Teil {
  const details = JSON.parse(z.details_json) as Partial<Details>;
  const material = z.composition_json
    ? (JSON.parse(z.composition_json) as { text?: string }).text
    : '';
  return {
    id: z.id,
    name: z.name,
    kategorie: z.category as Kategorie,
    art: details.art ?? 'tshirt',
    farbe: z.hex ?? '#9AA19D',
    farbname: z.name_de ?? '',
    marke: z.brand ?? '',
    groesse: z.size_value ?? '',
    material: material ?? '',
    pflege: details.pflegeText ?? '',
    pflegeaufwand: z.care_effort ? AUFWAND_AUS_DB[z.care_effort] : 'mittel',
    preisCent: z.purchase_price_cents ?? 0,
    getragen: (details.getragenVorher ?? 0) + z.getragen_neu,
    zuletzt: z.zuletzt_datum
      ? z.zuletzt_datum === heute
        ? 'heute'
        : z.zuletzt_datum
      : (details.zuletztText ?? ''),
    inWaesche: z.state === 'laundry',
  };
}

export async function ladeTeile(db: Datenbank, heute: Tag): Promise<Teil[]> {
  const zeilen = await db.getAllAsync<Zeile>(ABFRAGE, []);
  return zeilen.map((z) => ausZeile(z, heute));
}

export async function anzahlTeile(db: Datenbank): Promise<number> {
  const zeile = await db.getFirstAsync<{ n: number }>(
    'SELECT COUNT(*) AS n FROM items WHERE deleted_at IS NULL',
    [],
  );
  return zeile?.n ?? 0;
}

/** Legt ein Teil an oder überschreibt es vollständig. */
export async function speichereTeil(
  db: Datenbank,
  teil: Teil,
  jetzt: Date = new Date(),
): Promise<void> {
  const zeit = jetzt.toISOString();
  const details: Details = {
    art: teil.art,
    pflegeText: teil.pflege,
    getragenVorher: teil.getragen,
    zuletztText: teil.zuletzt,
  };
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO items (id, name, category, details_json, purchase_price_cents, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, category = excluded.category,
         details_json = excluded.details_json, purchase_price_cents = excluded.purchase_price_cents,
         updated_at = excluded.updated_at, deleted_at = NULL`,
      [
        teil.id,
        teil.name,
        teil.kategorie,
        JSON.stringify(details),
        teil.preisCent || null,
        zeit,
        zeit,
      ],
    );
    await db.runAsync(
      `INSERT OR REPLACE INTO item_colors (item_id, rank, hex, name_de) VALUES (?, 0, ?, ?)`,
      [teil.id, teil.farbe, teil.farbname],
    );
    await db.runAsync(
      `INSERT OR REPLACE INTO item_labels (item_id, brand, size_value, composition_json) VALUES (?, ?, ?, ?)`,
      [teil.id, teil.marke || null, teil.groesse || null, JSON.stringify({ text: teil.material })],
    );
    await db.runAsync(`INSERT OR REPLACE INTO item_care (item_id, care_effort) VALUES (?, ?)`, [
      teil.id,
      AUFWAND_IN_DB[teil.pflegeaufwand],
    ]);
    await db.runAsync(
      `INSERT INTO laundry_state (item_id, state) VALUES (?, ?)
       ON CONFLICT(item_id) DO UPDATE SET state = excluded.state`,
      [teil.id, teil.inWaesche ? 'laundry' : 'clean'],
    );
  });
}

/** Weich löschen (deleted_at), damit Rückgängig und Sicherung funktionieren (Plan 7.1). */
export async function loescheTeile(
  db: Datenbank,
  ids: readonly string[],
  jetzt: Date = new Date(),
): Promise<void> {
  for (const id of ids) {
    await db.runAsync('UPDATE items SET deleted_at = ?, updated_at = ? WHERE id = ?', [
      jetzt.toISOString(),
      jetzt.toISOString(),
      id,
    ]);
  }
}

/** "Anziehen": ein Eintrag im Tagebuch mit allen Teilen; erhöht den Wäschezähler. */
export async function trageEin(
  db: Datenbank,
  eintragId: string,
  ids: readonly string[],
  tag: Tag,
  quelle: 'wear_button' | 'selfie' | 'evening',
  jetzt: Date = new Date(),
): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync('INSERT INTO wear_logs (id, date, source, created_at) VALUES (?, ?, ?, ?)', [
      eintragId,
      tag,
      quelle,
      jetzt.toISOString(),
    ]);
    for (const id of ids) {
      await db.runAsync('INSERT INTO wear_log_items (wear_log_id, item_id) VALUES (?, ?)', [
        eintragId,
        id,
      ]);
      await db.runAsync(
        'UPDATE laundry_state SET wears_since_wash = wears_since_wash + 1 WHERE item_id = ?',
        [id],
      );
    }
  });
}

/** Rückgängig für "Anziehen". */
export async function loescheEintrag(db: Datenbank, eintragId: string): Promise<void> {
  await db.withTransactionAsync(async () => {
    const ids = await db.getAllAsync<{ item_id: string }>(
      'SELECT item_id FROM wear_log_items WHERE wear_log_id = ?',
      [eintragId],
    );
    for (const { item_id } of ids) {
      await db.runAsync(
        'UPDATE laundry_state SET wears_since_wash = MAX(wears_since_wash - 1, 0) WHERE item_id = ?',
        [item_id],
      );
    }
    await db.runAsync('DELETE FROM wear_log_items WHERE wear_log_id = ?', [eintragId]);
    await db.runAsync('DELETE FROM wear_logs WHERE id = ?', [eintragId]);
  });
}

/** "Fertig gewaschen": alles wieder sauber, Zähler zurück. */
export async function alleGewaschen(db: Datenbank): Promise<void> {
  await db.runAsync(
    `UPDATE laundry_state SET washes_total = washes_total + CASE WHEN state = 'laundry' THEN 1 ELSE 0 END,
       state = 'clean', wears_since_wash = 0`,
    [],
  );
}

/** Nur Testleitung: Schrank leeren, damit die Beispieldaten neu geladen werden. */
export async function leereSchrank(db: Datenbank): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM wear_log_items', []);
    await db.runAsync('DELETE FROM wear_logs', []);
    await db.runAsync('DELETE FROM laundry_state', []);
    await db.runAsync('DELETE FROM item_care', []);
    await db.runAsync('DELETE FROM item_labels', []);
    await db.runAsync('DELETE FROM item_colors', []);
    await db.runAsync('DELETE FROM items', []);
  });
}
