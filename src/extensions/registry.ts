import type { ErweiterungsManifest } from '../core/steckplaetze/typen';
import { manifest as e00 } from './e00-test/manifest';

/** Alle verfügbaren Erweiterungen. Welche aktiv sind, steht in extensions_state (Plan 7.5). */
export const ALLE_ERWEITERUNGEN: readonly ErweiterungsManifest[] = [e00];
