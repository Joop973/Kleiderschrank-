import { createContext, useContext } from 'react';

export type Erscheinungsbild = 'system' | 'hell' | 'dunkel' | 'reizarm';

export type Farben = {
  hintergrund: string;
  flaeche: string;
  flaecheGedrueckt: string;
  linie: string;
  text: string;
  textLeise: string;
  akzent: string;
  aufAkzent: string;
  unsicher: string;
  unsicherFlaeche: string;
  sucher: string;
};

/** Eine Akzentfarbe nur für die Hauptaktion (Plan 14). Kontraste nach WCAG AA geprüft. */
const hell: Farben = {
  hintergrund: '#F6F5F1',
  flaeche: '#FFFFFF',
  flaecheGedrueckt: '#ECEBE6',
  linie: '#DDDBD4',
  text: '#1B1D1C',
  textLeise: '#585E5B',
  akzent: '#1F5E45',
  aufAkzent: '#FFFFFF',
  unsicher: '#8A4B00',
  unsicherFlaeche: '#FCEFD9',
  sucher: '#2A2C2B',
};

const dunkel: Farben = {
  hintergrund: '#121413',
  flaeche: '#1D201E',
  flaecheGedrueckt: '#2A2E2C',
  linie: '#343937',
  text: '#ECEDEB',
  textLeise: '#A7AEAA',
  akzent: '#6CC39C',
  aufAkzent: '#0E1A14',
  unsicher: '#F2B66B',
  unsicherFlaeche: '#3A2C17',
  sucher: '#000000',
};

/** Reizarm: gedämpfte Farben, keine Bewegung (Plan 3.3, 14). */
const reizarm: Farben = {
  ...hell,
  hintergrund: '#F2F1EE',
  text: '#2B2D2C',
  akzent: '#3E5F52',
  unsicher: '#6E5434',
  unsicherFlaeche: '#EFE9DF',
};

export function farbenFuer(bild: Erscheinungsbild, systemDunkel: boolean): Farben {
  if (bild === 'reizarm') return reizarm;
  if (bild === 'dunkel' || (bild === 'system' && systemDunkel)) return dunkel;
  return hell;
}

export const abstand = { xs: 4, s: 8, m: 16, l: 24, xl: 32 } as const;
export const radius = { s: 8, m: 14, l: 22, rund: 999 } as const;
export const schrift = { klein: 15, text: 17, gross: 20, titel: 28 } as const;
/** Mindestgröße für Tippflächen (Plan 14). */
export const TIPPFLAECHE = 48;

export type Thema = {
  farben: Farben;
  dunkel: boolean;
  bewegung: boolean;
  erscheinungsbild: Erscheinungsbild;
  setzeErscheinungsbild: (bild: Erscheinungsbild) => void;
};

export const ThemaKontext = createContext<Thema>({
  farben: hell,
  dunkel: false,
  bewegung: true,
  erscheinungsbild: 'system',
  setzeErscheinungsbild: () => {},
});

export function useThema(): Thema {
  return useContext(ThemaKontext);
}
