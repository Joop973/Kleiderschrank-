import {
  BEISPIEL_OUTFITS,
  BEISPIEL_TEILE,
  naechstesTeil,
  preisProTragen,
  SLOTS,
  teilMitId,
  type Teil,
} from '../beispieldaten';

describe('Beispieldaten', () => {
  it('haben eindeutige IDs', () => {
    const ids = BEISPIEL_TEILE.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('verweisen in jedem Outfit auf passende Teile', () => {
    for (const outfit of BEISPIEL_OUTFITS) {
      for (const slot of SLOTS) {
        expect(teilMitId(BEISPIEL_TEILE, outfit[slot])?.kategorie).toBe(slot);
      }
    }
  });
});

describe('preisProTragen', () => {
  const teil = BEISPIEL_TEILE[0];
  it('teilt den Preis durch die Zahl der Tragetage', () => {
    expect(preisProTragen({ ...teil, preisCent: 3990, getragen: 22 })).toBe('1,81 €');
  });
  it('liefert nichts ohne Preis oder ohne Tragen', () => {
    expect(preisProTragen({ ...teil, preisCent: 0 })).toBeNull();
    expect(preisProTragen({ ...teil, getragen: 0 })).toBeNull();
  });
});

describe('naechstesTeil', () => {
  it('wechselt innerhalb der Kategorie und beginnt am Ende von vorn', () => {
    expect(naechstesTeil(BEISPIEL_TEILE, 't11')?.id).toBe('t12');
    expect(naechstesTeil(BEISPIEL_TEILE, 't13')?.id).toBe('t11');
  });

  it('überspringt Teile in der Wäsche', () => {
    const teile: Teil[] = BEISPIEL_TEILE.map((t) =>
      t.id === 't12' ? { ...t, inWaesche: true } : t,
    );
    expect(naechstesTeil(teile, 't11')?.id).toBe('t13');
  });

  it('liefert nichts ohne Alternative', () => {
    expect(naechstesTeil(BEISPIEL_TEILE.slice(0, 1), 't1')).toBeUndefined();
    expect(naechstesTeil(BEISPIEL_TEILE, 'gibt-es-nicht')).toBeUndefined();
  });
});

describe('inReihe', () => {
  it('führt Arbeiten nacheinander aus, auch nach einem Fehler', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { inReihe } = require('../store') as typeof import('../store');
    const log: string[] = [];
    const warte = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const a = inReihe(async () => {
      await warte(20);
      log.push('a');
    });
    const b = inReihe(async () => {
      log.push('b');
      throw new Error('kaputt');
    });
    const c = inReihe(async () => {
      log.push('c');
      return 3;
    });
    await a;
    await expect(b).rejects.toThrow('kaputt');
    await expect(c).resolves.toBe(3);
    expect(log).toEqual(['a', 'b', 'c']);
  });
});
