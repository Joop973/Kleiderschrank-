import type { Tag } from '../zeit/datum';

/** Eine geplante oder gewünschte Benachrichtigung. */
export type BenachrichtigungsWunsch = {
  id: string;
  /** "kern" oder die ID einer Erweiterung. */
  quelle: string;
  tag: Tag;
  prioritaet: number;
};

/**
 * Plan Regel 11 und 7.5: Der Kern darf 1 Benachrichtigung pro Tag senden (Vorabend-Outfit).
 * Jede Erweiterung bekommt 1 eigene pro Tag, aber nur nach Zustimmung beim Einschalten.
 */
export function tagesBudget(quellenMitZustimmung: readonly string[]): Map<string, number> {
  const budget = new Map<string, number>([['kern', 1]]);
  for (const quelle of quellenMitZustimmung) budget.set(quelle, 1);
  return budget;
}

/**
 * Lässt pro Tag und Quelle nur so viele Wünsche durch, wie das Budget erlaubt.
 * Bereits geplante Benachrichtigungen zählen mit. Wichtigere Wünsche gehen vor.
 */
export function filtereNachBudget(
  wuensche: readonly BenachrichtigungsWunsch[],
  bereitsGeplant: readonly BenachrichtigungsWunsch[],
  budget: ReadonlyMap<string, number>,
): BenachrichtigungsWunsch[] {
  const belegt = new Map<string, number>();
  const schluessel = (w: BenachrichtigungsWunsch) => `${w.tag}|${w.quelle}`;
  for (const w of bereitsGeplant) belegt.set(schluessel(w), (belegt.get(schluessel(w)) ?? 0) + 1);

  const ergebnis: BenachrichtigungsWunsch[] = [];
  const sortiert = [...wuensche].sort(
    (a, b) => b.prioritaet - a.prioritaet || a.id.localeCompare(b.id),
  );
  for (const w of sortiert) {
    const grenze = budget.get(w.quelle) ?? 0;
    const anzahl = belegt.get(schluessel(w)) ?? 0;
    if (anzahl < grenze) {
      ergebnis.push(w);
      belegt.set(schluessel(w), anzahl + 1);
    }
  }
  return ergebnis;
}
