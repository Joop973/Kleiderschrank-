import type { Kategorie, Teil } from './beispieldaten';

/** Einfache Suche über Name, Farbe und Marke; alle Wörter müssen vorkommen (Plan K21). */
export function filtereTeile(
  teile: readonly Teil[],
  suche: string,
  kategorie: Kategorie | null,
): Teil[] {
  const woerter = suche
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    // "blaue" findet "Blau": einfache Endungen weglassen
    .map((w) => w.replace(/(e|er|es|en)$/, ''));
  return teile.filter((teil) => {
    if (kategorie && teil.kategorie !== kategorie) return false;
    const text = `${teil.name} ${teil.farbname} ${teil.marke} ${teil.material}`.toLowerCase();
    return woerter.every((w) => text.includes(w));
  });
}
