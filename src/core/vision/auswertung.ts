/** Auswertung des Machbarkeitstests (Plan 17, Phase 2). */
export type Bewertung = {
  freistellenDauerMs?: number;
  freistellenBrauchbar?: boolean;
  /** undefined = noch nicht bewertet, null = kein Gesicht im Bild */
  gesichtUnkenntlich?: boolean | null;
};

export type Auswertung = {
  anzahl: number;
  freistellenQuote: number | null;
  gesichterQuote: number | null;
  freistellenSchnittMs: number | null;
  zielErreicht: boolean | null;
};

const quote = (werte: boolean[]) =>
  werte.length === 0 ? null : werte.filter(Boolean).length / werte.length;

export function werteAus(bewertungen: readonly Bewertung[]): Auswertung {
  const freistellen = bewertungen.flatMap((b) =>
    b.freistellenBrauchbar === undefined ? [] : [b.freistellenBrauchbar],
  );
  const gesichter = bewertungen.flatMap((b) =>
    typeof b.gesichtUnkenntlich === 'boolean' ? [b.gesichtUnkenntlich] : [],
  );
  const dauern = bewertungen.flatMap((b) =>
    b.freistellenDauerMs === undefined ? [] : [b.freistellenDauerMs],
  );
  const freistellenQuote = quote(freistellen);
  const gesichterQuote = quote(gesichter);
  const freistellenSchnittMs =
    dauern.length === 0 ? null : Math.round(dauern.reduce((a, b) => a + b, 0) / dauern.length);
  const zielErreicht =
    freistellenQuote === null || freistellenSchnittMs === null
      ? null
      : freistellenQuote >= 0.8 &&
        freistellenSchnittMs <= 6000 &&
        (gesichterQuote === null || gesichterQuote === 1);
  return {
    anzahl: bewertungen.length,
    freistellenQuote,
    gesichterQuote,
    freistellenSchnittMs,
    zielErreicht,
  };
}

export function alsProzent(wert: number | null): string | null {
  return wert === null ? null : `${Math.round(wert * 100)} %`;
}
