import type { ComponentType } from 'react';

import type { TextSchluessel } from '../../i18n';
import type { Hinweis } from '../hints/warteschlange';

/** Was eine Erweiterung beim Erzeugen von Hinweiskarten sieht. */
export type HinweisKontext = { heute: string };

/** Ein eigener Bildschirm einer Erweiterung, erreichbar über "Mehr". */
export type ErweiterungsBildschirm = {
  id: string;
  titel: TextSchluessel;
  Komponente: ComponentType;
};

/**
 * Steckplätze, über die Erweiterungen andocken (Plan 7.5).
 * Weitere Steckplätze (Kamera, Engine, Teil-Ansicht) kommen in den Phasen, die sie brauchen.
 */
export type Steckplaetze = {
  hinweise?: (kontext: HinweisKontext) => Hinweis[];
  bildschirme?: ErweiterungsBildschirm[];
  /** Erweiterung möchte Benachrichtigungen senden (zählt nur mit Zustimmung). */
  sendetBenachrichtigungen?: boolean;
};

export type ErweiterungsManifest = {
  /** z. B. "E05" */
  id: string;
  name: TextSchluessel;
  beschreibung: TextSchluessel;
  plan: 'free' | 'premium';
  /** IDs anderer Erweiterungen oder "cloud". */
  benoetigt: readonly string[];
  /** SQL für eigene Tabellen mit Präfix ext_<id>_; wird beim ersten Einschalten ausgeführt. */
  migrationen: readonly string[];
  steckplaetze: Steckplaetze;
};

/** Gespeicherter Zustand pro Erweiterung (Tabelle extensions_state). */
export type ErweiterungsZustand = {
  id: string;
  eingeschaltet: boolean;
  benachrichtigungenErlaubt: boolean;
};
