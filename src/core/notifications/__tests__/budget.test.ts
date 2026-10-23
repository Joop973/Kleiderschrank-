import { filtereNachBudget, tagesBudget, type BenachrichtigungsWunsch } from '../budget';

const wunsch = (id: string, quelle: string, tag = '2026-10-23', prioritaet = 1) =>
  ({ id, quelle, tag, prioritaet }) satisfies BenachrichtigungsWunsch;

describe('tagesBudget', () => {
  it('gibt dem Kern 1 pro Tag und Erweiterungen nur mit Zustimmung', () => {
    expect([...tagesBudget([])]).toEqual([['kern', 1]]);
    expect(tagesBudget(['E05']).get('E05')).toBe(1);
    expect(tagesBudget(['E05']).get('E07')).toBeUndefined();
  });
});

describe('filtereNachBudget', () => {
  it('lässt im Standard nur 1 Benachrichtigung pro Tag durch', () => {
    const ergebnis = filtereNachBudget(
      [wunsch('a', 'kern', undefined, 1), wunsch('b', 'kern', undefined, 5)],
      [],
      tagesBudget([]),
    );
    expect(ergebnis.map((w) => w.id)).toEqual(['b']);
  });

  it('blockiert Erweiterungen ohne Zustimmung', () => {
    expect(filtereNachBudget([wunsch('x', 'E05')], [], tagesBudget([]))).toEqual([]);
  });

  it('erlaubt einer zugestimmten Erweiterung 1 zusätzliche', () => {
    const ergebnis = filtereNachBudget(
      [wunsch('k', 'kern'), wunsch('x', 'E05'), wunsch('y', 'E05')],
      [],
      tagesBudget(['E05']),
    );
    expect(ergebnis.map((w) => w.id).sort()).toEqual(['k', 'x']);
  });

  it('zählt bereits geplante Benachrichtigungen mit', () => {
    expect(
      filtereNachBudget([wunsch('neu', 'kern')], [wunsch('alt', 'kern')], tagesBudget([])),
    ).toEqual([]);
  });

  it('rechnet jeden Tag getrennt', () => {
    const ergebnis = filtereNachBudget(
      [wunsch('heute', 'kern', '2026-10-23'), wunsch('morgen', 'kern', '2026-10-24')],
      [],
      tagesBudget([]),
    );
    expect(ergebnis).toHaveLength(2);
  });
});
