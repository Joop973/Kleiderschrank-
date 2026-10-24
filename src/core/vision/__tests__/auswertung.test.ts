import { alsProzent, werteAus } from '../auswertung';

describe('werteAus', () => {
  it('liefert nichts ohne Bewertungen', () => {
    expect(werteAus([])).toEqual({
      anzahl: 0,
      freistellenQuote: null,
      gesichterQuote: null,
      freistellenSchnittMs: null,
      zielErreicht: null,
    });
  });

  it('erreicht das Ziel mit 80 % brauchbar, 6 s und allen Gesichtern unkenntlich', () => {
    const b = [
      ...Array(4).fill({ freistellenDauerMs: 5000, freistellenBrauchbar: true }),
      { freistellenDauerMs: 7000, freistellenBrauchbar: false, gesichtUnkenntlich: true },
    ];
    const a = werteAus(b);
    expect(a.freistellenQuote).toBe(0.8);
    expect(a.freistellenSchnittMs).toBe(5400);
    expect(a.zielErreicht).toBe(true);
  });

  it('verfehlt das Ziel bei einem erkennbaren Gesicht', () => {
    const a = werteAus([
      { freistellenDauerMs: 1000, freistellenBrauchbar: true, gesichtUnkenntlich: false },
    ]);
    expect(a.gesichterQuote).toBe(0);
    expect(a.zielErreicht).toBe(false);
  });

  it('zählt Fotos ohne Gesicht nicht bei den Gesichtern mit', () => {
    const a = werteAus([
      { freistellenDauerMs: 1000, freistellenBrauchbar: true, gesichtUnkenntlich: null },
    ]);
    expect(a.gesichterQuote).toBeNull();
    expect(a.zielErreicht).toBe(true);
  });

  it('formatiert Prozent', () => {
    expect(alsProzent(0.825)).toBe('83 %');
    expect(alsProzent(null)).toBeNull();
  });
});
