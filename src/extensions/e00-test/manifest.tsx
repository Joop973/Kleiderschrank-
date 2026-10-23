import type { ErweiterungsManifest } from '../../core/steckplaetze/typen';
import { t } from '../../i18n';
import { Seite, Text } from '../../shared/design-system';

function TestBildschirm() {
  return (
    <Seite titel={t('erweiterungen.e00Bildschirm')}>
      <Text>{t('erweiterungen.e00Text')}</Text>
    </Seite>
  );
}

/** Test-Erweiterung für Phase 1: prüft Steckplätze für Hinweiskarten und Bildschirme. */
export const manifest: ErweiterungsManifest = {
  id: 'E00',
  name: 'erweiterungen.e00Name',
  beschreibung: 'erweiterungen.e00Beschreibung',
  plan: 'free',
  benoetigt: [],
  migrationen: [],
  steckplaetze: {
    hinweise: () => [{ id: 'e00-gruss', art: 'e00-gruss', quelle: 'E00', prioritaet: 95 }],
    bildschirme: [{ id: 'test', titel: 'erweiterungen.e00Bildschirm', Komponente: TestBildschirm }],
  },
};
