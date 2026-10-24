import { tageZwischen, type Tag } from '../zeit/datum';

/** Eine Hinweiskarte aus dem Kern oder einer Erweiterung (Plan K19, 7.5). */
export type Hinweis = {
  id: string;
  /** Art der Karte, z. B. "waesche-voll". Sperrfristen gelten pro Art. */
  art: string;
  /** "kern" oder die ID einer Erweiterung, z. B. "E05". */
  quelle: string;
  /** Höher = wichtiger. */
  prioritaet: number;
  /** Mindestabstand in Tagen, bevor dieselbe Art wieder erscheinen darf (z. B. Verkaufen 7). */
  sperrTage?: number;
};

export type HinweisVerlauf = {
  id: string;
  art: string;
  gezeigtAm: Tag;
  weggetipptAm?: Tag;
};

/**
 * Wählt die eine Hinweiskarte für heute (höchstens 1 pro Tag, Plan Regel 11).
 * Wurde heute schon eine gezeigt, bleibt es bei dieser, bis sie weggetippt ist.
 */
export function waehleHinweis(
  kandidaten: readonly Hinweis[],
  verlauf: readonly HinweisVerlauf[],
  heute: Tag,
): Hinweis | null {
  const heuteGezeigt = verlauf.find((v) => v.gezeigtAm === heute);
  if (heuteGezeigt) {
    if (heuteGezeigt.weggetipptAm) return null;
    return kandidaten.find((k) => k.id === heuteGezeigt.id) ?? null;
  }

  const erlaubt = kandidaten.filter((k) => !istGesperrt(k, verlauf, heute));
  if (erlaubt.length === 0) return null;

  return [...erlaubt].sort((a, b) => b.prioritaet - a.prioritaet || a.id.localeCompare(b.id))[0];
}

function istGesperrt(hinweis: Hinweis, verlauf: readonly HinweisVerlauf[], heute: Tag): boolean {
  const sperre = hinweis.sperrTage ?? 1;
  return verlauf.some((v) => v.art === hinweis.art && tageZwischen(v.gezeigtAm, heute) < sperre);
}
