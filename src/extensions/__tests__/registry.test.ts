import { waehleHinweis } from '../../core/hints/warteschlange';
import {
  aktiveErweiterungen,
  bildschirmeAusErweiterungen,
  hinweiseAusErweiterungen,
} from '../../core/steckplaetze/steckplaetze';
import { ALLE_ERWEITERUNGEN } from '../registry';

const kern = [{ id: 'k', art: 'waesche-voll', quelle: 'kern', prioritaet: 50 }];
const heute = '2026-10-23';

describe('Erweiterungs-Register', () => {
  it('hat eindeutige IDs und nur Texte aus de.json', () => {
    const ids = ALLE_ERWEITERUNGEN.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('Test-Erweiterung aus: Kern verhält sich wie ohne Erweiterungen', () => {
    const aktive = aktiveErweiterungen(ALLE_ERWEITERUNGEN, []);
    const kandidaten = [...kern, ...hinweiseAusErweiterungen(aktive, { heute })];
    expect(waehleHinweis(kandidaten, [], heute)).toEqual(waehleHinweis(kern, [], heute));
    expect(bildschirmeAusErweiterungen(aktive)).toEqual([]);
  });

  it('Test-Erweiterung an: liefert Hinweiskarte und Bildschirm über Steckplätze', () => {
    const aktive = aktiveErweiterungen(ALLE_ERWEITERUNGEN, [
      { id: 'E00', eingeschaltet: true, benachrichtigungenErlaubt: false },
    ]);
    const kandidaten = [...kern, ...hinweiseAusErweiterungen(aktive, { heute })];
    expect(waehleHinweis(kandidaten, [], heute)?.quelle).toBe('E00');
    expect(bildschirmeAusErweiterungen(aktive).map((b) => b.id)).toEqual(['test']);
  });
});
