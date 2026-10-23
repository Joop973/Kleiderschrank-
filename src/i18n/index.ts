import de from './de.json';

type Pfade<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Pfade<T[K], `${P}${K}.`>;
}[keyof T & string];

export type TextSchluessel = Pfade<typeof de>;

/** Liefert den deutschen Text zu einem Schlüssel wie "heute.titel". */
export function t(schluessel: TextSchluessel): string {
  let wert: unknown = de;
  for (const teil of schluessel.split('.')) {
    if (typeof wert !== 'object' || wert === null) return schluessel;
    wert = (wert as Record<string, unknown>)[teil];
  }
  return typeof wert === 'string' ? wert : schluessel;
}
