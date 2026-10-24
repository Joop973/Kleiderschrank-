import { router, useLocalSearchParams } from 'expo-router';

import { bildschirmeAusErweiterungen } from '../../../../core/steckplaetze/steckplaetze';
import { useErweiterungen } from '../../../../core/steckplaetze/ErweiterungsKontext';
import { SymbolKnopf } from '../../../../shared/design-system';
import { t } from '../../../../i18n';

/** Rahmen für Bildschirme aus Erweiterungen; ausgeschaltet gibt es sie nicht (Plan 7.5). */
export default function ErweiterungsBildschirm() {
  const { id, bildschirm } = useLocalSearchParams<{ id: string; bildschirm: string }>();
  const { aktive } = useErweiterungen();
  const gefunden = bildschirmeAusErweiterungen(aktive).find(
    (b) => b.erweiterung === id && b.id === bildschirm,
  );
  if (!gefunden) {
    return (
      <SymbolKnopf
        symbol="chevron-back"
        beschriftung={t('allgemein.zurueck')}
        onPress={() => router.back()}
      />
    );
  }
  const { Komponente } = gefunden;
  return <Komponente />;
}
