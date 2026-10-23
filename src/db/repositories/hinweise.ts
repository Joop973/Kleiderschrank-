import type { Hinweis, HinweisVerlauf } from '../../core/hints/warteschlange';
import type { Tag } from '../../core/zeit/datum';
import type { Datenbank } from '../typen';

export async function leseHinweisVerlauf(db: Datenbank): Promise<HinweisVerlauf[]> {
  const zeilen = await db.getAllAsync<{
    id: string;
    art: string;
    shown_at: string;
    dismissed_at: string | null;
  }>('SELECT id, art, shown_at, dismissed_at FROM hints WHERE shown_at IS NOT NULL');
  return zeilen.map((z) => ({
    id: z.id,
    art: z.art,
    gezeigtAm: z.shown_at,
    ...(z.dismissed_at ? { weggetipptAm: z.dismissed_at } : {}),
  }));
}

export async function merkeGezeigt(db: Datenbank, hinweis: Hinweis, tag: Tag): Promise<void> {
  await db.runAsync(
    `INSERT INTO hints (id, art, source, priority, shown_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET shown_at = COALESCE(hints.shown_at, excluded.shown_at),
       updated_at = excluded.updated_at`,
    [hinweis.id, hinweis.art, hinweis.quelle, hinweis.prioritaet, tag, new Date().toISOString()],
  );
}

export async function merkeWeggetippt(db: Datenbank, id: string, tag: Tag): Promise<void> {
  await db.runAsync('UPDATE hints SET dismissed_at = ?, updated_at = ? WHERE id = ?', [
    tag,
    new Date().toISOString(),
    id,
  ]);
}

/** Nur für die Testleitung im Prototyp: Verlauf leeren, damit Hinweiskarten wieder erscheinen. */
export async function loescheHinweisVerlauf(db: Datenbank): Promise<void> {
  await db.runAsync('DELETE FROM hints', []);
}
