import { create } from 'zustand';

import type { Hinweis } from '../core/hints/warteschlange';
import { tagVon } from '../core/zeit/datum';
import {
  alleGewaschen,
  anzahlTeile,
  ladeTeile,
  leereSchrank,
  loescheEintrag,
  loescheTeile,
  speichereTeil,
  trageEin,
} from '../db/repositories/teile';
import type { Datenbank } from '../db/typen';
import { t } from '../i18n';
import {
  BEISPIEL_OUTFITS,
  BEISPIEL_TEILE,
  naechstesTeil,
  type Outfit,
  type Slot,
  type Teil,
} from './beispieldaten';

/** Aufgaben für Nutzertests; die Testleitung wählt eine und die App springt zum Start. */
export type Szenario =
  | 'morgens'
  | 'schuhe'
  | 'abends'
  | 'neuesTeil'
  | 'galerie'
  | 'kaufcheck'
  | 'selfie'
  | 'waesche'
  | 'verkaufen'
  | 'farbtyp'
  | 'erweiterung';

export type FotoTyp = 'teil' | 'groesse' | 'pflege' | 'selfie' | 'laden';

export type Leiste = { text: string; rueckgaengig?: () => void; id: number };

type Zustand = {
  teile: Teil[];
  outfitIndex: number;
  tausch: Partial<Outfit>;
  angezogen: boolean;
  morgenFest: Outfit | null;
  szenario: Szenario;
  kameraFotos: FotoTyp[];
  waescheErledigt: boolean;
  mantelErledigt: boolean;
  leiste: Leiste | null;

  outfit: () => Outfit;
  tausche: (slot: Slot) => void;
  anderes: () => void;
  anziehen: () => void;
  trageSelfieEin: (ids: string[]) => void;
  verbinde: (db: Datenbank) => Promise<void>;
  setzeSchrankZurueck: () => Promise<void>;
  legeMorgenFest: (outfit: Outfit) => void;
  fuegeHinzu: (neue: Teil[]) => void;
  entferne: (ids: string[]) => void;
  kameraFoto: (typ: FotoTyp) => void;
  kameraLeeren: () => void;
  waescheFertig: () => void;
  mantelFertig: () => void;
  setzeSzenario: (szenario: Szenario) => void;
  zeigeLeiste: (text: string, rueckgaengig?: () => void) => void;
  schliesseLeiste: () => void;
};

const beispielTeile = () =>
  BEISPIEL_TEILE.map((t) => ({ ...t, inWaesche: ['t2', 't9'].includes(t.id) }));

const anfang = () => ({
  teile: beispielTeile(),
  outfitIndex: 0,
  tausch: {},
  angezogen: false,
  morgenFest: null,
  kameraFotos: [],
  waescheErledigt: false,
  mantelErledigt: false,
  leiste: null,
});

let leistenZaehler = 0;
let eintragZaehler = 0;

/** Verbundene Datenbank; ohne sie (Tests) arbeitet der Prototyp nur im Speicher. */
let db: Datenbank | null = null;

/**
 * Alle Datenbank-Arbeiten nacheinander: Im Browser teilen sich alle eine Verbindung,
 * gleichzeitige Transaktionen würden sich sonst vermischen.
 */
let reihe: Promise<unknown> = Promise.resolve();
export function inReihe<T>(arbeit: () => Promise<T>): Promise<T> {
  const ergebnis = reihe.then(arbeit, arbeit);
  reihe = ergebnis.catch(() => undefined);
  return ergebnis;
}

/** Schreibt im Hintergrund und lädt danach den Schrank neu, damit Anzeige und Datenbank gleich sind. */
function speichern(arbeit: (db: Datenbank) => Promise<void>) {
  if (!db) return;
  const verbunden = db;
  inReihe(async () => {
    await arbeit(verbunden);
    usePrototyp.setState({ teile: await ladeTeile(verbunden, tagVon(new Date())) });
  }).catch((fehler) => console.error('Speichern fehlgeschlagen', fehler));
}

async function fuelleUndLade(verbunden: Datenbank): Promise<Teil[]> {
  if ((await anzahlTeile(verbunden)) === 0) {
    // Gleicher Zeitstempel für alle, damit die Reihenfolge der Beispieldaten erhalten bleibt.
    const jetzt = new Date();
    for (const teil of beispielTeile()) await speichereTeil(verbunden, teil, jetzt);
  }
  return ladeTeile(verbunden, tagVon(new Date()));
}

export const usePrototyp = create<Zustand>()((set, get) => ({
  ...anfang(),
  szenario: 'morgens',

  outfit: () => {
    const { outfitIndex, tausch } = get();
    return { ...BEISPIEL_OUTFITS[outfitIndex % BEISPIEL_OUTFITS.length], ...tausch };
  },
  tausche: (slot) => {
    const aktuell = get().outfit()[slot];
    const naechstes = naechstesTeil(get().teile, aktuell);
    if (naechstes) set((s) => ({ tausch: { ...s.tausch, [slot]: naechstes.id } }));
  },
  anderes: () => set((s) => ({ outfitIndex: s.outfitIndex + 1, tausch: {} })),
  anziehen: () => {
    const ids = Object.values(get().outfit());
    const vorher = get().teile;
    const eintrag = `e-${Date.now()}-${++eintragZaehler}`;
    set((s) => ({
      angezogen: true,
      teile: s.teile.map((t) =>
        ids.includes(t.id) ? { ...t, getragen: t.getragen + 1, zuletzt: 'heute' } : t,
      ),
    }));
    speichern((d) => trageEin(d, eintrag, ids, tagVon(new Date()), 'wear_button'));
    get().zeigeLeiste(t('heute.angezogen'), () => {
      set({ angezogen: false, teile: vorher });
      speichern((d) => loescheEintrag(d, eintrag));
    });
  },
  trageSelfieEin: (ids) => {
    const eintrag = `e-${Date.now()}-${++eintragZaehler}`;
    speichern((d) => trageEin(d, eintrag, ids, tagVon(new Date()), 'selfie'));
    get().zeigeLeiste(t('selfie.gespeichert'), () => speichern((d) => loescheEintrag(d, eintrag)));
  },
  verbinde: async (neueDb) => {
    db = neueDb;
    set({ teile: await inReihe(() => fuelleUndLade(neueDb)) });
  },
  setzeSchrankZurueck: async () => {
    if (!db) {
      set({ teile: beispielTeile() });
      return;
    }
    const verbunden = db;
    const teile = await inReihe(async () => {
      await leereSchrank(verbunden);
      return fuelleUndLade(verbunden);
    });
    set({ teile });
  },
  legeMorgenFest: (outfit) => {
    set({ morgenFest: outfit });
    get().zeigeLeiste(t('abend.festgelegt'), () => set({ morgenFest: null }));
  },
  fuegeHinzu: (neue) => {
    set((s) => ({ teile: [...neue, ...s.teile] }));
    speichern(async (d) => {
      for (const teil of neue) await speichereTeil(d, teil);
    });
  },
  entferne: (ids) => {
    set((s) => ({ teile: s.teile.filter((t) => !ids.includes(t.id)) }));
    speichern((d) => loescheTeile(d, ids));
  },
  kameraFoto: (typ) => set((s) => ({ kameraFotos: [...s.kameraFotos, typ] })),
  kameraLeeren: () => set({ kameraFotos: [] }),
  waescheFertig: () => {
    set((s) => ({
      waescheErledigt: true,
      teile: s.teile.map((t) => ({ ...t, inWaesche: false })),
    }));
    speichern(alleGewaschen);
  },
  mantelFertig: () => set({ mantelErledigt: true }),
  // Teile bleiben; die Testleitung setzt den Schrank mit setzeSchrankZurueck zurück.
  setzeSzenario: (szenario) => {
    const { teile, ...rest } = anfang();
    void teile;
    set({ ...rest, szenario });
  },
  zeigeLeiste: (text, rueckgaengig) =>
    set({ leiste: { text, rueckgaengig, id: ++leistenZaehler } }),
  schliesseLeiste: () => set({ leiste: null }),
}));

/** Hinweiskarten des Kerns im Prototyp, abhängig von der gewählten Testaufgabe. */
export function kernHinweise(
  szenario: Szenario,
  zustand: { waescheErledigt: boolean; mantelErledigt: boolean },
): Hinweis[] {
  const alle: Hinweis[] = [];
  if (!zustand.waescheErledigt) {
    alle.push({
      id: 'p-waesche',
      art: 'waesche-voll',
      quelle: 'kern',
      prioritaet: szenario === 'waesche' ? 90 : 50,
    });
  }
  if (!zustand.mantelErledigt) {
    alle.push({
      id: 'p-verkaufen',
      art: 'verkaufen',
      quelle: 'kern',
      prioritaet: szenario === 'verkaufen' ? 90 : 30,
      sperrTage: 7,
    });
  }
  alle.push({
    id: 'p-farbtyp',
    art: 'farbtyp-angebot',
    quelle: 'kern',
    prioritaet: szenario === 'farbtyp' ? 90 : 20,
    sperrTage: 30,
  });
  return alle;
}
