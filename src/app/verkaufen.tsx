import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';

import { KleidungsBild } from '../core/wardrobe/KleidungsBild';
import { t } from '../i18n';
import { usePrototyp } from '../prototyp/store';
import { abstand, HauptKnopf, Karte, NebenKnopf, Seite, Text } from '../shared/design-system';

/** Verkaufen: Anzeigentext kopiert, Fotos zum Teilen (Plan K25). Kein automatisches Einstellen. */
export default function Verkaufen() {
  const mantelFertig = usePrototyp((s) => s.mantelFertig);
  const zeigeLeiste = usePrototyp((s) => s.zeigeLeiste);
  const text = t('verkaufen.anzeige');

  useEffect(() => {
    Clipboard.setStringAsync(text).catch(() => {});
  }, [text]);

  const teilen = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator.share({ text }).catch(() => {});
    }
  };

  return (
    <Seite
      titel={t('verkaufen.titel')}
      zurueck={() => router.back()}
      unten={
        <HauptKnopf
          titel={t('verkaufen.verkauft')}
          onPress={() => {
            mantelFertig();
            router.back();
            zeigeLeiste(t('verkaufen.verkauft'));
          }}
        />
      }
    >
      <View style={styles.bild}>
        <KleidungsBild art="jacke" farbe="#C8C9C7" groesse={120} />
      </View>
      <Text art="gross" accessibilityLiveRegion="polite">
        {t('verkaufen.kopiert')}
      </Text>
      <Karte>
        <Text>{text}</Text>
      </Karte>
      <View style={styles.knoepfe}>
        <NebenKnopf titel={t('verkaufen.teilen')} symbol="share-outline" onPress={teilen} />
        <NebenKnopf
          titel={t('verkaufen.aehnliche')}
          symbol="search-outline"
          onPress={() => Linking.openURL('https://www.kleinanzeigen.de/s-mango-wollmantel/k0')}
        />
      </View>
    </Seite>
  );
}

const styles = StyleSheet.create({
  bild: { alignItems: 'center' },
  knoepfe: { gap: abstand.s },
});
