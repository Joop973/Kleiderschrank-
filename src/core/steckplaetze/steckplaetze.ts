import type { Hinweis } from '../hints/warteschlange';
import type {
  ErweiterungsBildschirm,
  ErweiterungsManifest,
  ErweiterungsZustand,
  HinweisKontext,
} from './typen';

/**
 * Liefert die aktiven Erweiterungen: eingeschaltet und alle Voraussetzungen aktiv.
 * Der Kern kennt keine einzelne Erweiterung; er bekommt die Manifeste von außen.
 */
export function aktiveErweiterungen(
  alle: readonly ErweiterungsManifest[],
  zustand: readonly ErweiterungsZustand[],
  verfuegbar: ReadonlySet<string> = new Set(),
): ErweiterungsManifest[] {
  const eingeschaltet = new Set(zustand.filter((z) => z.eingeschaltet).map((z) => z.id));
  const aktiv = new Map<string, ErweiterungsManifest>();
  // Voraussetzungen können aufeinander aufbauen; so lange auflösen, bis sich nichts mehr ändert.
  let geaendert = true;
  while (geaendert) {
    geaendert = false;
    for (const m of alle) {
      if (aktiv.has(m.id) || !eingeschaltet.has(m.id)) continue;
      if (m.benoetigt.every((b) => aktiv.has(b) || verfuegbar.has(b))) {
        aktiv.set(m.id, m);
        geaendert = true;
      }
    }
  }
  return alle.filter((m) => aktiv.has(m.id));
}

export function hinweiseAusErweiterungen(
  aktive: readonly ErweiterungsManifest[],
  kontext: HinweisKontext,
): Hinweis[] {
  return aktive.flatMap((m) =>
    (m.steckplaetze.hinweise?.(kontext) ?? []).map((h) => ({ ...h, quelle: m.id })),
  );
}

export function bildschirmeAusErweiterungen(
  aktive: readonly ErweiterungsManifest[],
): (ErweiterungsBildschirm & { erweiterung: string })[] {
  return aktive.flatMap((m) =>
    (m.steckplaetze.bildschirme ?? []).map((b) => ({ ...b, erweiterung: m.id })),
  );
}

/** Erweiterungen, die Benachrichtigungen senden wollen und denen zugestimmt wurde. */
export function quellenMitBenachrichtigung(
  aktive: readonly ErweiterungsManifest[],
  zustand: readonly ErweiterungsZustand[],
): string[] {
  const erlaubt = new Set(zustand.filter((z) => z.benachrichtigungenErlaubt).map((z) => z.id));
  return aktive
    .filter((m) => m.steckplaetze.sendetBenachrichtigungen && erlaubt.has(m.id))
    .map((m) => m.id);
}
