import { Tabs } from 'expo-router/js-tabs';

import { t } from '../i18n';

// Drei Bereiche: Heute, Kamera, Schrank (Plan 3.1). Gestaltung folgt in Phase 1.
export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: t('tabs.heute') }} />
      <Tabs.Screen name="kamera" options={{ title: t('tabs.kamera') }} />
      <Tabs.Screen name="schrank" options={{ title: t('tabs.schrank') }} />
    </Tabs>
  );
}
