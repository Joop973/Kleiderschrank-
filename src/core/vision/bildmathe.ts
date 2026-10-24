/** Reine Bild-Rechnungen ohne Browser-Abhängigkeit (testbar). Pixel als RGBA, Zeile für Zeile. */

export type Kasten = { x: number; y: number; breite: number; hoehe: number };

const MITTEL = [0.485, 0.456, 0.406];
const STREUUNG = [0.229, 0.224, 0.225];

/** RGBA (bereits auf kante×kante verkleinert) → Eingabe für U²-Net: Float32, Kanäle zuerst, normalisiert. */
export function zuNetzEingabe(rgba: Uint8ClampedArray, kante: number): Float32Array {
  const flaeche = kante * kante;
  const eingabe = new Float32Array(3 * flaeche);
  for (let i = 0; i < flaeche; i++) {
    for (let k = 0; k < 3; k++) {
      eingabe[k * flaeche + i] = (rgba[i * 4 + k] / 255 - MITTEL[k]) / STREUUNG[k];
    }
  }
  return eingabe;
}

/** Netz-Ausgabe → Maske 0..255, auf den Bereich zwischen kleinstem und größtem Wert gestreckt. */
export function zuMaske(ausgabe: Float32Array): Uint8ClampedArray {
  let min = Infinity;
  let max = -Infinity;
  for (const v of ausgabe) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const spanne = max - min || 1;
  const maske = new Uint8ClampedArray(ausgabe.length);
  for (let i = 0; i < ausgabe.length; i++)
    maske[i] = Math.round(((ausgabe[i] - min) / spanne) * 255);
  return maske;
}

/** Anteil der Pixel, die zum Teil gehören (Maske über der Schwelle). */
export function vordergrundAnteil(maske: Uint8ClampedArray, schwelle = 128): number {
  if (maske.length === 0) return 0;
  let n = 0;
  for (const v of maske) if (v >= schwelle) n++;
  return n / maske.length;
}

/**
 * Grobe Prüfung, ob das Freistellen plausibel ist: Teil weder winzig noch bildfüllend.
 * Sonst zeigt die App das Originalfoto (Plan 7.10, Rückfall).
 */
export function freistellenPlausibel(anteil: number): boolean {
  return anteil >= 0.05 && anteil <= 0.9;
}

/** Kasten um faktor vergrößern (Mitte bleibt), auf das Bild begrenzen, ganze Pixel. */
export function kastenErweitern(k: Kasten, faktor: number, breite: number, hoehe: number): Kasten {
  const neueBreite = k.breite * faktor;
  const neueHoehe = k.hoehe * faktor;
  const x0 = Math.max(0, Math.floor(k.x + k.breite / 2 - neueBreite / 2));
  const y0 = Math.max(0, Math.floor(k.y + k.hoehe / 2 - neueHoehe / 2));
  const x1 = Math.min(breite, Math.ceil(k.x + k.breite / 2 + neueBreite / 2));
  const y1 = Math.min(hoehe, Math.ceil(k.y + k.hoehe / 2 + neueHoehe / 2));
  return { x: x0, y: y0, breite: Math.max(0, x1 - x0), hoehe: Math.max(0, y1 - y0) };
}

/** Verpixelt den Kasten im Bild: jeder Block bekommt seinen Durchschnitt. Ändert rgba direkt. */
export function verpixeln(
  rgba: Uint8ClampedArray,
  breite: number,
  hoehe: number,
  kasten: Kasten,
  block: number,
): void {
  const k = kastenErweitern(kasten, 1, breite, hoehe);
  for (let by = k.y; by < k.y + k.hoehe; by += block) {
    for (let bx = k.x; bx < k.x + k.breite; bx += block) {
      const ex = Math.min(bx + block, k.x + k.breite);
      const ey = Math.min(by + block, k.y + k.hoehe);
      const summe = [0, 0, 0, 0];
      let n = 0;
      for (let y = by; y < ey; y++) {
        for (let x = bx; x < ex; x++) {
          const i = (y * breite + x) * 4;
          for (let c = 0; c < 4; c++) summe[c] += rgba[i + c];
          n++;
        }
      }
      for (let y = by; y < ey; y++) {
        for (let x = bx; x < ex; x++) {
          const i = (y * breite + x) * 4;
          for (let c = 0; c < 4; c++) rgba[i + c] = Math.round(summe[c] / n);
        }
      }
    }
  }
}

/** Blockgröße fürs Verpixeln: so grob, dass ein Gesicht höchstens etwa 6 Blöcke breit ist. */
export function blockGroesse(kasten: Kasten): number {
  return Math.max(8, Math.ceil(Math.max(kasten.breite, kasten.hoehe) / 6));
}

/**
 * Kopf aus Körper-Punkten (MediaPipe Pose, Punkte 0–10 = Gesicht), normiert 0..1.
 * Großzügig erweitert, weil die Punkte nur das innere Gesicht abdecken.
 */
export function kopfAusPose(
  punkte: readonly { x: number; y: number }[],
  breite: number,
  hoehe: number,
): Kasten | null {
  const gesicht = punkte.slice(0, 11).filter((p) => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1);
  if (gesicht.length < 3) return null;
  const xs = gesicht.map((p) => p.x * breite);
  const ys = gesicht.map((p) => p.y * hoehe);
  const roh = {
    x: Math.min(...xs),
    y: Math.min(...ys),
    breite: Math.max(...xs) - Math.min(...xs),
    hoehe: Math.max(...ys) - Math.min(...ys),
  };
  // Gesichtspunkte liegen eng beieinander; quadratisch machen und kräftig erweitern.
  const seite = Math.max(roh.breite, roh.hoehe, 1);
  const quadrat = {
    x: roh.x + roh.breite / 2 - seite / 2,
    y: roh.y + roh.hoehe / 2 - seite / 2,
    breite: seite,
    hoehe: seite,
  };
  return kastenErweitern(quadrat, 2.6, breite, hoehe);
}
