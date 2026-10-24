import type { KleidungsArt } from './KleidungsBild';

export type Kategorie = 'oberteil' | 'schicht' | 'unterteil' | 'kleid' | 'schuhe' | 'accessoire';

/** Ein Kleidungsstück, wie die Oberfläche es braucht. Gespeichert in items und Nebentabellen (Plan 8). */
export type Teil = {
  id: string;
  name: string;
  kategorie: Kategorie;
  /** Gezeichnete Illustration, solange es kein Foto gibt. */
  art: KleidungsArt;
  farbe: string;
  farbname: string;
  marke: string;
  groesse: string;
  material: string;
  pflege: string;
  pflegeaufwand: 'wenig' | 'mittel' | 'viel';
  preisCent: number;
  getragen: number;
  zuletzt: string;
  inWaesche?: boolean;
};
