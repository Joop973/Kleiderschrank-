/** Fotos bleiben auf dem Gerät (Plan 1, 7.1). Umsetzung je Plattform. */
export type FotoSpeicher = {
  speichere(id: string, daten: Blob): Promise<void>;
  /** Liefert eine anzeigbare Adresse oder null, wenn das Foto fehlt. */
  ladeAdresse(id: string): Promise<string | null>;
  loesche(id: string): Promise<void>;
  /** Bittet den Browser bzw. das System, die Daten nicht automatisch zu löschen. */
  bitteUmDauerhaftenSpeicher(): Promise<boolean>;
};

/** Native Umsetzung folgt in Teil B (Plan 7.10); im Prototyp gilt fotoSpeicher.web.ts. */
export const fotoSpeicher: FotoSpeicher = {
  async speichere() {
    throw new Error('Foto-Speicher nativ erst in Teil B');
  },
  async ladeAdresse() {
    return null;
  },
  async loesche() {},
  async bitteUmDauerhaftenSpeicher() {
    return false;
  },
};
