import de from './de.json';

type Pfade<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Pfade<T[K], `${P}${K}.`>;
}[keyof T & string];

export type TextSchluessel = Pfade<typeof de>;

/**
 * Liefert den deutschen Text zu einem Schlüssel wie "heute.titel".
 * Platzhalter wie {anzahl} werden durch werte.anzahl ersetzt.
 */
export function t(schluessel: TextSchluessel, werte?: Record<string, string | number>): string {
  let wert: unknown = de;
  for (const teil of schluessel.split('.')) {
    if (typeof wert !== 'object' || wert === null) return schluessel;
    wert = (wert as Record<string, unknown>)[teil];
  }
  if (typeof wert !== 'string') return schluessel;
  if (!werte) return wert;
  return wert.replace(/\{(\w+)\}/g, (ganz, name: string) =>
    name in werte ? String(werte[name]) : ganz,
  );
}
