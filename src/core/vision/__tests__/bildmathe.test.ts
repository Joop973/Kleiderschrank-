import {
  blockGroesse,
  freistellenPlausibel,
  kastenErweitern,
  kopfAusPose,
  verpixeln,
  vordergrundAnteil,
  zuMaske,
  zuNetzEingabe,
} from '../bildmathe';

function bild(breite: number, hoehe: number, fn: (x: number, y: number) => number[]) {
  const rgba = new Uint8ClampedArray(breite * hoehe * 4);
  for (let y = 0; y < hoehe; y++)
    for (let x = 0; x < breite; x++) rgba.set(fn(x, y), (y * breite + x) * 4);
  return rgba;
}

describe('zuNetzEingabe', () => {
  it('legt Kanäle hintereinander und normalisiert', () => {
    const rgba = new Uint8ClampedArray([
      255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255,
    ]);
    const e = zuNetzEingabe(rgba, 2);
    expect(e).toHaveLength(12);
    expect(e[0]).toBeCloseTo((1 - 0.485) / 0.229);
    expect(e[4 + 1]).toBeCloseTo((1 - 0.456) / 0.224);
    expect(e[8 + 2]).toBeCloseTo((1 - 0.406) / 0.225);
  });
});

describe('zuMaske und vordergrundAnteil', () => {
  it('streckt auf 0..255', () => {
    expect(Array.from(zuMaske(new Float32Array([0.2, 0.6, 1.0])))).toEqual([0, 128, 255]);
  });
  it('kommt mit gleichförmiger Ausgabe zurecht', () => {
    expect(Array.from(zuMaske(new Float32Array([0.5, 0.5])))).toEqual([0, 0]);
  });
  it('zählt den Vordergrund', () => {
    expect(vordergrundAnteil(new Uint8ClampedArray([0, 200, 255, 10]))).toBe(0.5);
    expect(vordergrundAnteil(new Uint8ClampedArray([]))).toBe(0);
  });
  it('hält winzige oder bildfüllende Masken für unplausibel', () => {
    expect(freistellenPlausibel(0.01)).toBe(false);
    expect(freistellenPlausibel(0.4)).toBe(true);
    expect(freistellenPlausibel(0.97)).toBe(false);
  });
});

describe('kastenErweitern', () => {
  it('vergrößert um die Mitte und bleibt im Bild', () => {
    expect(kastenErweitern({ x: 40, y: 40, breite: 20, hoehe: 20 }, 2, 100, 100)).toEqual({
      x: 30,
      y: 30,
      breite: 40,
      hoehe: 40,
    });
    expect(kastenErweitern({ x: 0, y: 0, breite: 20, hoehe: 20 }, 3, 50, 50)).toEqual({
      x: 0,
      y: 0,
      breite: 40,
      hoehe: 40,
    });
  });
});

describe('verpixeln', () => {
  it('ersetzt Details im Kasten durch Blockmittelwerte und lässt den Rest unberührt', () => {
    const rgba = bild(8, 8, (x, y) => ((x + y) % 2 === 0 ? [255, 255, 255, 255] : [0, 0, 0, 255]));
    const vorher = rgba.slice();
    verpixeln(rgba, 8, 8, { x: 0, y: 0, breite: 4, hoehe: 4 }, 4);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) expect(rgba[(y * 8 + x) * 4]).toBe(128);
    expect(rgba[(5 * 8 + 5) * 4]).toBe(vorher[(5 * 8 + 5) * 4]);
  });

  it('macht ein Schachbrett im Kasten einfarbig: kein Detail bleibt erkennbar', () => {
    const rgba = bild(12, 12, (x, y) =>
      (x + y) % 2 === 0 ? [200, 150, 100, 255] : [20, 30, 40, 255],
    );
    verpixeln(rgba, 12, 12, { x: 0, y: 0, breite: 12, hoehe: 12 }, 12);
    const werte = new Set<number>();
    for (let i = 0; i < 144; i++) werte.add(rgba[i * 4]);
    expect(werte.size).toBe(1);
  });

  it('kommt mit Kästen am Bildrand zurecht', () => {
    const rgba = bild(5, 5, () => [10, 10, 10, 255]);
    expect(() => verpixeln(rgba, 5, 5, { x: 3, y: 3, breite: 10, hoehe: 10 }, 4)).not.toThrow();
  });

  it('wählt die Blockgröße nach Gesichtsgröße, mindestens 8', () => {
    expect(blockGroesse({ x: 0, y: 0, breite: 30, hoehe: 30 })).toBe(8);
    expect(blockGroesse({ x: 0, y: 0, breite: 120, hoehe: 90 })).toBe(20);
  });
});

describe('kopfAusPose', () => {
  it('baut einen großzügigen Kasten um die Gesichtspunkte', () => {
    const punkte = [
      { x: 0.5, y: 0.1 },
      { x: 0.48, y: 0.09 },
      { x: 0.52, y: 0.09 },
      { x: 0.46, y: 0.1 },
      { x: 0.54, y: 0.1 },
      ...Array(28).fill({ x: 0.5, y: 0.6 }),
    ];
    const k = kopfAusPose(punkte, 1000, 1000);
    expect(k).not.toBeNull();
    expect(k!.x).toBeLessThan(460);
    expect(k!.x + k!.breite).toBeGreaterThan(540);
    expect(k!.y).toBeLessThan(90);
  });

  it('liefert nichts ohne genug sichtbare Punkte', () => {
    expect(kopfAusPose([{ x: 0.5, y: 0.5 }], 100, 100)).toBeNull();
    expect(kopfAusPose(Array(11).fill({ x: -1, y: 2 }), 100, 100)).toBeNull();
  });
});
