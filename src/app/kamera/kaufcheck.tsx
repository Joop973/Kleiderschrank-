import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { KleidungsBild } from '../../core/wardrobe/KleidungsBild';
import { t } from '../../i18n';
import {
  abstand,
  HauptKnopf,
  Karte,
  Seite,
  Text,
  useThema,
  type SymbolName,
} from '../../shared/design-system';

/** Kaufcheck-Ergebnis in drei Zeilen plus Preis pro Tragen (Plan K27). */
function Zeile({ symbol, text }: { symbol: SymbolName; text: string }) {
  const { farben } = useThema();
  return (
    <View style={styles.zeile}>
      <Ionicons name={symbol} size={26} color={farben.akzent} />
      <Text art="gross" style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

export default function Kaufcheck() {
  return (
    <Seite
      titel={t('kaufcheck.titel')}
      unten={<HauptKnopf titel={t('kaufcheck.fertig')} onPress={() => router.dismissTo('/')} />}
    >
      <View style={styles.bild}>
        <KleidungsBild art="pullover" farbe="#8E9190" groesse={140} />
        <Text leise>{t('kaufcheck.teil')}</Text>
      </View>
      <Karte style={styles.ergebnis}>
        <Zeile symbol="checkmark-circle-outline" text={t('kaufcheck.passtZu')} />
        <Zeile symbol="copy-outline" text={t('kaufcheck.aehnlich')} />
        <Zeile symbol="color-palette-outline" text={t('kaufcheck.farbe')} />
      </Karte>
      <Text leise>{t('kaufcheck.preis')}</Text>
    </Seite>
  );
}

const styles = StyleSheet.create({
  bild: { alignItems: 'center', gap: abstand.s },
  ergebnis: { gap: abstand.m },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: abstand.m },
});
