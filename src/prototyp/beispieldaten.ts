import type { KleidungsArt } from '../core/wardrobe/KleidungsBild';

/**
 * Beispieldaten für den Klick-Prototyp (Phase 1, ohne echte Logik).
 * Werden ab Phase 3 durch echte Daten aus der Datenbank ersetzt.
 */
export type Kategorie = 'oberteil' | 'schicht' | 'unterteil' | 'kleid' | 'schuhe' | 'accessoire';

export type Teil = {
  id: string;
  name: string;
  kategorie: Kategorie;
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

export const BEISPIEL_TEILE: Teil[] = [
  {
    id: 't1',
    name: 'Weißes Hemd',
    kategorie: 'oberteil',
    art: 'hemd',
    farbe: '#F4F4F0',
    farbname: 'Weiß',
    marke: 'Uniqlo',
    groesse: 'M',
    material: '100 % Baumwolle',
    pflege: '40 °C, bügeln',
    pflegeaufwand: 'mittel',
    preisCent: 3990,
    getragen: 22,
    zuletzt: 'vor 9 Tagen',
  },
  {
    id: 't2',
    name: 'Graues T-Shirt',
    kategorie: 'oberteil',
    art: 'tshirt',
    farbe: '#9A9D9B',
    farbname: 'Grau',
    marke: 'H&M',
    groesse: 'M',
    material: '100 % Baumwolle',
    pflege: '40 °C',
    pflegeaufwand: 'wenig',
    preisCent: 999,
    getragen: 31,
    zuletzt: 'vor 3 Tagen',
  },
  {
    id: 't3',
    name: 'Dunkelblauer Pullover',
    kategorie: 'oberteil',
    art: 'pullover',
    farbe: '#24365C',
    farbname: 'Dunkelblau',
    marke: 'COS',
    groesse: 'M',
    material: '100 % Merinowolle',
    pflege: 'Handwäsche',
    pflegeaufwand: 'viel',
    preisCent: 7900,
    getragen: 14,
    zuletzt: 'vor 12 Tagen',
  },
  {
    id: 't4',
    name: 'Hellblaues Hemd',
    kategorie: 'oberteil',
    art: 'hemd',
    farbe: '#A9C6E8',
    farbname: 'Hellblau',
    marke: 'Seidensticker',
    groesse: '39/40',
    material: '100 % Baumwolle',
    pflege: '40 °C, bügeln',
    pflegeaufwand: 'mittel',
    preisCent: 5990,
    getragen: 9,
    zuletzt: 'vor 20 Tagen',
  },
  {
    id: 't5',
    name: 'Beige Regenjacke',
    kategorie: 'schicht',
    art: 'jacke',
    farbe: '#C9B58E',
    farbname: 'Beige',
    marke: 'Rains',
    groesse: 'M',
    material: '100 % Polyester, beschichtet',
    pflege: '30 °C, nicht in den Trockner',
    pflegeaufwand: 'wenig',
    preisCent: 12900,
    getragen: 40,
    zuletzt: 'vor 2 Tagen',
  },
  {
    id: 't6',
    name: 'Graue Strickjacke',
    kategorie: 'schicht',
    art: 'pullover',
    farbe: '#7E8180',
    farbname: 'Grau',
    marke: 'Zara',
    groesse: 'M',
    material: '70 % Baumwolle, 30 % Polyamid',
    pflege: '30 °C',
    pflegeaufwand: 'mittel',
    preisCent: 4590,
    getragen: 18,
    zuletzt: 'vor 6 Tagen',
  },
  {
    id: 't7',
    name: 'Hellgrauer Wollmantel',
    kategorie: 'schicht',
    art: 'jacke',
    farbe: '#C8C9C7',
    farbname: 'Hellgrau',
    marke: 'Mango',
    groesse: 'M',
    material: '80 % Wolle, 20 % Polyamid',
    pflege: 'Reinigung',
    pflegeaufwand: 'viel',
    preisCent: 15900,
    getragen: 3,
    zuletzt: 'vor 8 Monaten',
  },
  {
    id: 't8',
    name: 'Blaue Jeans',
    kategorie: 'unterteil',
    art: 'jeans',
    farbe: '#3D5A8A',
    farbname: 'Blau',
    marke: "Levi's",
    groesse: 'W32/L34',
    material: '98 % Baumwolle, 2 % Elasthan',
    pflege: '40 °C, links waschen',
    pflegeaufwand: 'wenig',
    preisCent: 10990,
    getragen: 55,
    zuletzt: 'gestern',
  },
  {
    id: 't9',
    name: 'Schwarze Hose',
    kategorie: 'unterteil',
    art: 'hose',
    farbe: '#2B2B2D',
    farbname: 'Schwarz',
    marke: 'Hugo Boss',
    groesse: '50',
    material: '97 % Wolle, 3 % Elasthan',
    pflege: 'Reinigung',
    pflegeaufwand: 'viel',
    preisCent: 14900,
    getragen: 12,
    zuletzt: 'vor 3 Wochen',
  },
  {
    id: 't10',
    name: 'Beige Chino',
    kategorie: 'unterteil',
    art: 'hose',
    farbe: '#CDB894',
    farbname: 'Beige',
    marke: 'Dockers',
    groesse: 'W32/L32',
    material: '98 % Baumwolle, 2 % Elasthan',
    pflege: '30 °C',
    pflegeaufwand: 'wenig',
    preisCent: 6990,
    getragen: 20,
    zuletzt: 'vor 5 Tagen',
  },
  {
    id: 't11',
    name: 'Weiße Sneaker',
    kategorie: 'schuhe',
    art: 'sneaker',
    farbe: '#F2F2EE',
    farbname: 'Weiß',
    marke: 'Veja',
    groesse: '43',
    material: 'Leder',
    pflege: 'feucht abwischen',
    pflegeaufwand: 'mittel',
    preisCent: 12900,
    getragen: 60,
    zuletzt: 'gestern',
  },
  {
    id: 't12',
    name: 'Braune Lederschuhe',
    kategorie: 'schuhe',
    art: 'halbschuh',
    farbe: '#6B4A2E',
    farbname: 'Braun',
    marke: 'Lloyd',
    groesse: '43',
    material: 'Leder',
    pflege: 'Schuhcreme',
    pflegeaufwand: 'viel',
    preisCent: 17900,
    getragen: 25,
    zuletzt: 'vor 10 Tagen',
  },
  {
    id: 't13',
    name: 'Schwarze Stiefel',
    kategorie: 'schuhe',
    art: 'stiefel',
    farbe: '#232325',
    farbname: 'Schwarz',
    marke: 'Dr. Martens',
    groesse: '43',
    material: 'Leder',
    pflege: 'Schuhcreme',
    pflegeaufwand: 'mittel',
    preisCent: 18900,
    getragen: 33,
    zuletzt: 'vor 4 Tagen',
  },
  {
    id: 't14',
    name: 'Senfgelber Schal',
    kategorie: 'accessoire',
    art: 'schal',
    farbe: '#C99A2E',
    farbname: 'Senfgelb',
    marke: 'Acne',
    groesse: 'Einheitsgröße',
    material: '100 % Wolle',
    pflege: 'Handwäsche',
    pflegeaufwand: 'viel',
    preisCent: 9000,
    getragen: 15,
    zuletzt: 'vor 1 Woche',
  },
  {
    id: 't15',
    name: 'Dunkelgrüne Mütze',
    kategorie: 'accessoire',
    art: 'muetze',
    farbe: '#2F5244',
    farbname: 'Dunkelgrün',
    marke: 'Carhartt',
    groesse: 'Einheitsgröße',
    material: '100 % Acryl',
    pflege: '30 °C',
    pflegeaufwand: 'wenig',
    preisCent: 2500,
    getragen: 28,
    zuletzt: 'vor 2 Tagen',
  },
  {
    id: 't16',
    name: 'Schwarze Tasche',
    kategorie: 'accessoire',
    art: 'tasche',
    farbe: '#2E2E30',
    farbname: 'Schwarz',
    marke: 'Freitag',
    groesse: 'Einheitsgröße',
    material: 'LKW-Plane',
    pflege: 'feucht abwischen',
    pflegeaufwand: 'wenig',
    preisCent: 16000,
    getragen: 70,
    zuletzt: 'gestern',
  },
];

/** Neues Teil, das in der Kamera-Simulation fotografiert wird. */
export const NEUE_JEANS: Teil = {
  id: 'neu-jeans',
  name: 'Blaue Jeans',
  kategorie: 'unterteil',
  art: 'jeans',
  farbe: '#4A6FA5',
  farbname: 'Blau',
  marke: "Levi's",
  groesse: 'W32/L34',
  material: '98 % Baumwolle',
  pflege: '40 °C',
  pflegeaufwand: 'wenig',
  preisCent: 0,
  getragen: 0,
  zuletzt: '',
};

/** Fotos für den Galerie-Stapel. */
export const GALERIE_TEILE: Teil[] = [
  {
    ...NEUE_JEANS,
    id: 'g1',
    name: 'Rotes T-Shirt',
    kategorie: 'oberteil',
    art: 'tshirt',
    farbe: '#B23A3A',
    farbname: 'Rot',
    marke: 'H&M',
    groesse: 'M',
    material: '100 % Baumwolle',
  },
  {
    ...NEUE_JEANS,
    id: 'g2',
    name: 'Grüner Pullover',
    kategorie: 'oberteil',
    art: 'pullover',
    farbe: '#3E6B4F',
    farbname: 'Grün',
    marke: 'Zara',
    groesse: 'M',
    material: '100 % Baumwolle',
  },
  {
    ...NEUE_JEANS,
    id: 'g3',
    name: 'Schwarzer Rock',
    kategorie: 'unterteil',
    art: 'rock',
    farbe: '#2A2A2C',
    farbname: 'Schwarz',
    marke: 'COS',
    groesse: '38',
    material: '100 % Polyester',
  },
  {
    ...NEUE_JEANS,
    id: 'g4',
    name: 'Blaues Kleid',
    kategorie: 'kleid',
    art: 'kleid',
    farbe: '#3B5BA0',
    farbname: 'Blau',
    marke: 'Mango',
    groesse: '38',
    material: '100 % Viskose',
  },
  {
    ...NEUE_JEANS,
    id: 'g5',
    name: 'Graue Sneaker',
    kategorie: 'schuhe',
    art: 'sneaker',
    farbe: '#8C8F91',
    farbname: 'Grau',
    marke: 'Nike',
    groesse: '43',
    material: 'Textil',
  },
  {
    ...NEUE_JEANS,
    id: 'g6',
    name: 'Brauner Gürtel',
    kategorie: 'accessoire',
    art: 'tasche',
    farbe: '#7A5232',
    farbname: 'Braun',
    marke: 'Unbekannt',
    groesse: '95',
    material: 'Leder',
  },
];

export type Slot = 'oberteil' | 'schicht' | 'unterteil' | 'schuhe' | 'accessoire';
export type Outfit = Record<Slot, string>;

export const SLOTS: Slot[] = ['schicht', 'oberteil', 'accessoire', 'unterteil', 'schuhe'];

/** Vorberechnete Vorschläge; "Anderes" blättert durch diese Liste. */
export const BEISPIEL_OUTFITS: Outfit[] = [
  { oberteil: 't1', schicht: 't5', unterteil: 't8', schuhe: 't11', accessoire: 't14' },
  { oberteil: 't3', schicht: 't5', unterteil: 't10', schuhe: 't12', accessoire: 't15' },
  { oberteil: 't2', schicht: 't6', unterteil: 't8', schuhe: 't13', accessoire: 't16' },
  { oberteil: 't4', schicht: 't5', unterteil: 't9', schuhe: 't12', accessoire: 't16' },
];

export function teilMitId(teile: readonly Teil[], id: string): Teil | undefined {
  return teile.find((t) => t.id === id);
}

/** Preis pro Tragen in Euro-Text (Alltagssprache, Plan Regel 12). */
export function preisProTragen(teil: Teil): string | null {
  if (teil.preisCent <= 0 || teil.getragen <= 0) return null;
  const euro = teil.preisCent / 100 / teil.getragen;
  return `${euro.toFixed(2).replace('.', ',')} €`;
}

/** Nächstes passendes Teil derselben Kategorie, das nicht in der Wäsche ist (Teil tauschen). */
export function naechstesTeil(teile: readonly Teil[], aktuellId: string): Teil | undefined {
  const aktuell = teilMitId(teile, aktuellId);
  if (!aktuell) return undefined;
  const gleiche = teile.filter((t) => t.kategorie === aktuell.kategorie && !t.inWaesche);
  if (gleiche.length < 2) return undefined;
  const index = gleiche.findIndex((t) => t.id === aktuellId);
  return gleiche[(index + 1) % gleiche.length];
}
