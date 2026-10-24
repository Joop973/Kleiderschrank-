import { router } from 'expo-router';

import { t } from '../../i18n';
import { Seite, Text } from '../../shared/design-system';

export default function Hilfe() {
  return (
    <Seite titel={t('hilfe.titel')} zurueck={() => router.back()}>
      <Text>{t('hilfe.heute')}</Text>
      <Text>{t('hilfe.kamera')}</Text>
      <Text>{t('hilfe.schrank')}</Text>
    </Seite>
  );
}
