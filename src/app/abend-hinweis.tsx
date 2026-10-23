import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { t } from '../i18n';
import { BEISPIEL_OUTFITS } from '../prototyp/beispieldaten';
import { OutfitBild } from '../prototyp/OutfitBild';
import { usePrototyp } from '../prototyp/store';
import { abstand, radius, Text } from '../shared/design-system';

/**
 * Nur Testleitung: simuliert den Sperrbildschirm mit der Vorabend-Benachrichtigung (Plan K16).
 * Die echte Benachrichtigung kommt in Phase 4 per Web-Push.
 */
export default function AbendHinweis() {
  const teile = usePrototyp((s) => s.teile);
  const index = usePrototyp(useShallow((s) => s.outfitIndex));
  const morgen = BEISPIEL_OUTFITS[(index + 1) % BEISPIEL_OUTFITS.length];
  return (
    <SafeAreaView style={styles.sperre}>
      <Text style={styles.uhr}>20:00</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('abend.benachrichtigungTitel')}. ${t('abend.benachrichtigungText')}`}
        onPress={() => router.replace('/abend')}
        style={({ pressed }) => [styles.benachrichtigung, { opacity: pressed ? 0.85 : 1 }]}
      >
        <Text art="klein" style={styles.app}>
          {t('abend.benachrichtigungApp')}
        </Text>
        <Text art="gross" style={styles.dunkel}>
          {t('abend.benachrichtigungTitel')}
        </Text>
        <Text style={styles.dunkel}>{t('abend.benachrichtigungText')}</Text>
        <View style={styles.vorschau}>
          <OutfitBild outfit={morgen} teile={teile} groesse="klein" />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sperre: { flex: 1, backgroundColor: '#1E2A3A', padding: abstand.m, gap: abstand.l },
  uhr: { color: '#FFFFFF', fontSize: 64, fontWeight: '200', textAlign: 'center', lineHeight: 80 },
  benachrichtigung: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.l,
    padding: abstand.m,
    gap: abstand.xs,
  },
  app: { color: '#555555', textTransform: 'uppercase' },
  dunkel: { color: '#1B1D1C' },
  vorschau: { marginTop: abstand.s },
});
