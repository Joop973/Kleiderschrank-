import { router } from 'expo-router';

import { t } from '../../i18n';
import { Seite, Text } from '../../shared/design-system';

/** Datenschutz-Übersicht in einfacher Sprache (Plan K29). */
export default function Datenschutz() {
  return (
    <Seite titel={t('datenschutz.titel')} zurueck={() => router.back()}>
      <Text>{t('datenschutz.text1')}</Text>
      <Text>{t('datenschutz.text2')}</Text>
      <Text>{t('datenschutz.text3')}</Text>
      <Text>{t('datenschutz.text4')}</Text>
      <Text leise>{t('datenschutz.prototyp')}</Text>
    </Seite>
  );
}
