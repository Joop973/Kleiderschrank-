import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { t } from '../../i18n';
import { Text, useThema, type SymbolName } from '../../shared/design-system';

type TabProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

function Reiter({
  titel,
  symbol,
  aktiv,
  onPress,
}: {
  titel: string;
  symbol: SymbolName;
  aktiv: boolean;
  onPress: () => void;
}) {
  const { farben } = useThema();
  const farbe = aktiv ? farben.text : farben.textLeise;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={titel}
      accessibilityState={{ selected: aktiv }}
      onPress={onPress}
      style={styles.reiter}
    >
      <Ionicons name={symbol} size={26} color={farbe} />
      <Text art="klein" style={{ color: farbe, fontWeight: aktiv ? '600' : '400' }}>
        {titel}
      </Text>
    </Pressable>
  );
}

/** Drei Bereiche: Heute, Kamera-Knopf, Schrank (Plan 3.1, Regel 4). */
function TabLeiste({ state, navigateToTab }: TabProps) {
  const { farben } = useThema();
  const unten = useSafeAreaInsets().bottom;
  const aktiv = state.routes[state.index]?.name;
  const geheZu = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (route) navigateToTab(route.key);
  };

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.leiste,
        { backgroundColor: farben.flaeche, borderTopColor: farben.linie, paddingBottom: unten + 6 },
      ]}
    >
      <Reiter
        titel={t('tabs.heute')}
        symbol="sunny-outline"
        aktiv={aktiv === 'index'}
        onPress={() => geheZu('index')}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('tabs.kamera')}
        onPress={() => router.push('/kamera')}
        style={({ pressed }) => [
          styles.kamera,
          { backgroundColor: farben.text, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Ionicons name="camera" size={32} color={farben.hintergrund} />
      </Pressable>
      <Reiter
        titel={t('tabs.schrank')}
        symbol="shirt-outline"
        aktiv={aktiv === 'schrank'}
        onPress={() => geheZu('schrank')}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabLeiste {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t('tabs.heute') }} />
      <Tabs.Screen name="schrank" options={{ title: t('tabs.schrank') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  leiste: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
  },
  reiter: { minWidth: 88, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 2 },
  kamera: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
});
