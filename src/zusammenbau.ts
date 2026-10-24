/**
 * Einziger Ort, an dem App und Erweiterungen zusammenkommen (Kompositionswurzel, Plan 7.5).
 * Kern, Bildschirme und Dienste importieren nie direkt aus src/extensions.
 */
export { ALLE_ERWEITERUNGEN } from './extensions/registry';
