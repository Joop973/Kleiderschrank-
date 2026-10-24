import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { bildschirmeAusErweiterungen } from '../../core/steckplaetze/steckplaetze';
import { useErweiterungen } from '../../core/steckplaetze/ErweiterungsKontext';
import { t } from '../../i18n';
import { pruefeServer, type ServerStatus } from '../../services/server/hallo';
import { Karte, ListenZeile, Seite, Text } from '../../shared/design-system';

/** Mehr: Erweiterungen, Einstellungen, Hilfe, Datenschutz (Plan 3.1). */
export default function Mehr() {
  const { aktive } = useErweiterungen();
  const [server, setServer] = useState<ServerStatus | 'pruefe'>('pruefe');
  useEffect(() => {
    pruefeServer().then(setServer);
  }, []);

  return (
    <Seite titel={t('mehr.titel')} zurueck={() => router.back()}>
      <Karte style={{ padding: 0, overflow: 'hidden' }}>
        <ListenZeile
          titel={t('mehr.erweiterungen')}
          symbol="extension-puzzle-outline"
          onPress={() => router.push('/mehr/erweiterungen')}
        />
        {bildschirmeAusErweiterungen(aktive).map((b) => (
          <ListenZeile
            key={`${b.erweiterung}-${b.id}`}
            titel={t(b.titel)}
            symbol="apps-outline"
            onPress={() => router.push(`/mehr/erweiterung/${b.erweiterung}/${b.id}`)}
          />
        ))}
        <ListenZeile
          titel={t('mehr.einstellungen')}
          symbol="settings-outline"
          onPress={() => router.push('/mehr/einstellungen')}
        />
        <ListenZeile
          titel={t('mehr.hilfe')}
          symbol="help-circle-outline"
          onPress={() => router.push('/mehr/hilfe')}
        />
        <ListenZeile
          titel={t('mehr.datenschutz')}
          symbol="shield-checkmark-outline"
          onPress={() => router.push('/mehr/datenschutz')}
        />
      </Karte>
      <Karte style={{ padding: 0, overflow: 'hidden' }}>
        <ListenZeile
          titel={t('mehr.testleitung')}
          symbol="clipboard-outline"
          onPress={() => router.push('/mehr/testleitung')}
        />
      </Karte>
      <Text art="klein" leise accessibilityLiveRegion="polite">
        {t('heute.server')}: {t(`server.${server}`)}
      </Text>
    </Seite>
  );
}
