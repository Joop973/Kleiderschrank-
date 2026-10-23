import {
  aktiveErweiterungen,
  bildschirmeAusErweiterungen,
  hinweiseAusErweiterungen,
  quellenMitBenachrichtigung,
} from '../steckplaetze';
import type { ErweiterungsManifest, ErweiterungsZustand } from '../typen';

const Leer = () => null;

function manifest(id: string, extra: Partial<ErweiterungsManifest> = {}): ErweiterungsManifest {
  return {
    id,
    name: 'tabs.heute',
    beschreibung: 'tabs.heute',
    plan: 'free',
    benoetigt: [],
    migrationen: [],
    steckplaetze: {
      hinweise: () => [{ id: `${id}-h`, art: `${id}-art`, quelle: 'falsch', prioritaet: 1 }],
      bildschirme: [{ id: `${id}-b`, titel: 'tabs.heute', Komponente: Leer }],
    },
    ...extra,
  };
}

const an = (id: string, benachrichtigungenErlaubt = false): ErweiterungsZustand => ({
  id,
  eingeschaltet: true,
  benachrichtigungenErlaubt,
});

describe('aktiveErweiterungen', () => {
  it('ist ohne eingeschaltete Erweiterungen leer', () => {
    expect(aktiveErweiterungen([manifest('E01')], [])).toEqual([]);
  });

  it('liefert eingeschaltete Erweiterungen', () => {
    const e01 = manifest('E01');
    expect(aktiveErweiterungen([e01, manifest('E02')], [an('E01')])).toEqual([e01]);
  });

  it('ignoriert ausgeschaltete Einträge', () => {
    expect(
      aktiveErweiterungen([manifest('E01')], [{ ...an('E01'), eingeschaltet: false }]),
    ).toEqual([]);
  });

  it('aktiviert eine Erweiterung nur mit erfüllten Voraussetzungen', () => {
    const e17 = manifest('E17', { benoetigt: ['E15'] });
    const e15 = manifest('E15');
    expect(aktiveErweiterungen([e17, e15], [an('E17')])).toEqual([]);
    expect(aktiveErweiterungen([e17, e15], [an('E17'), an('E15')])).toEqual([e17, e15]);
  });

  it('berücksichtigt Voraussetzungen wie "cloud"', () => {
    const e16 = manifest('E16', { benoetigt: ['cloud'] });
    expect(aktiveErweiterungen([e16], [an('E16')])).toEqual([]);
    expect(aktiveErweiterungen([e16], [an('E16')], new Set(['cloud']))).toEqual([e16]);
  });
});

describe('Steckplätze', () => {
  it('sammelt Hinweise und setzt die Quelle auf die Erweiterung', () => {
    const hinweise = hinweiseAusErweiterungen([manifest('E01')], { heute: '2026-10-23' });
    expect(hinweise).toEqual([{ id: 'E01-h', art: 'E01-art', quelle: 'E01', prioritaet: 1 }]);
  });

  it('liefert ohne aktive Erweiterungen keine Spuren', () => {
    expect(hinweiseAusErweiterungen([], { heute: '2026-10-23' })).toEqual([]);
    expect(bildschirmeAusErweiterungen([])).toEqual([]);
  });

  it('sammelt Bildschirme mit Herkunft', () => {
    expect(bildschirmeAusErweiterungen([manifest('E08')])[0]).toMatchObject({
      id: 'E08-b',
      erweiterung: 'E08',
    });
  });

  it('gibt Benachrichtigungen nur mit Zustimmung frei', () => {
    const e05 = manifest('E05', { steckplaetze: { sendetBenachrichtigungen: true } });
    expect(quellenMitBenachrichtigung([e05], [an('E05')])).toEqual([]);
    expect(quellenMitBenachrichtigung([e05], [an('E05', true)])).toEqual(['E05']);
  });
});
