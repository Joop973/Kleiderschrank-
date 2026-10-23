import { waehleHinweis, type Hinweis, type HinweisVerlauf } from '../warteschlange';

const waesche: Hinweis = { id: 'w1', art: 'waesche-voll', quelle: 'kern', prioritaet: 50 };
const verkaufen: Hinweis = {
  id: 'v1',
  art: 'verkaufen',
  quelle: 'kern',
  prioritaet: 30,
  sperrTage: 7,
};
const erweiterung: Hinweis = { id: 'e1', art: 'e00-gruss', quelle: 'E00', prioritaet: 10 };

describe('waehleHinweis', () => {
  it('liefert nichts ohne Kandidaten', () => {
    expect(waehleHinweis([], [], '2026-10-23')).toBeNull();
  });

  it('wählt den wichtigsten Kandidaten', () => {
    expect(waehleHinweis([erweiterung, verkaufen, waesche], [], '2026-10-23')).toBe(waesche);
  });

  it('entscheidet bei gleicher Priorität stabil nach ID', () => {
    const a = { ...waesche, id: 'a' };
    const b = { ...waesche, id: 'b', art: 'andere' };
    expect(waehleHinweis([b, a], [], '2026-10-23')).toBe(a);
  });

  it('zeigt höchstens eine Karte pro Tag: die heutige bleibt', () => {
    const verlauf: HinweisVerlauf[] = [{ id: 'v1', art: 'verkaufen', gezeigtAm: '2026-10-23' }];
    expect(waehleHinweis([waesche, verkaufen], verlauf, '2026-10-23')).toBe(verkaufen);
  });

  it('zeigt nach Wegtippen am selben Tag keine weitere Karte', () => {
    const verlauf: HinweisVerlauf[] = [
      { id: 'v1', art: 'verkaufen', gezeigtAm: '2026-10-23', weggetipptAm: '2026-10-23' },
    ];
    expect(waehleHinweis([waesche, verkaufen], verlauf, '2026-10-23')).toBeNull();
  });

  it('beachtet die Sperrfrist pro Art', () => {
    const verlauf: HinweisVerlauf[] = [{ id: 'v0', art: 'verkaufen', gezeigtAm: '2026-10-20' }];
    expect(waehleHinweis([verkaufen], verlauf, '2026-10-26')).toBeNull();
    expect(waehleHinweis([verkaufen], verlauf, '2026-10-27')).toBe(verkaufen);
  });

  it('lässt eine Art ohne Sperrfrist am Folgetag wieder zu', () => {
    const verlauf: HinweisVerlauf[] = [{ id: 'w0', art: 'waesche-voll', gezeigtAm: '2026-10-22' }];
    expect(waehleHinweis([waesche], verlauf, '2026-10-23')).toBe(waesche);
  });

  it('nimmt eine gesperrte wichtige Karte nicht, sondern die nächste', () => {
    const verlauf: HinweisVerlauf[] = [{ id: 'w0', art: 'waesche-voll', gezeigtAm: '2026-10-22' }];
    const waescheWoche = { ...waesche, sperrTage: 7 };
    expect(waehleHinweis([waescheWoche, erweiterung], verlauf, '2026-10-23')).toBe(erweiterung);
  });
});
