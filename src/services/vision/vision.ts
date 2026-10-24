import type { Kasten } from '../../core/vision/bildmathe';

export type FreistellErgebnis = {
  /** PNG mit durchsichtigem Hintergrund. */
  ergebnisUrl: string;
  anteil: number;
  plausibel: boolean;
  dauerMs: number;
};

export type GesichtsErgebnis = {
  kaesten: Kasten[];
  /** Woher die Kästen kommen; "keins" heißt: nichts gefunden, Foto darf nicht hochgeladen werden. */
  quelle: 'gesicht' | 'koerper' | 'keins';
  verpixeltUrl: string;
  dauerMs: number;
};

/** Bildverarbeitung auf dem Gerät (Plan 7.10). Im Browser: vision.web.ts; nativ erst Teil B. */
export type Vision = {
  stelleFrei(bildUrl: string): Promise<FreistellErgebnis>;
  verpixleGesichter(bildUrl: string): Promise<GesichtsErgebnis>;
};

export const vision: Vision | null = null;
