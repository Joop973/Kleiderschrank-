import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '../i18n';
import { BEISPIEL_OUTFITS } from '../prototyp/beispieldaten';
import { OutfitBild } from '../prototyp/OutfitBild';
import { usePrototyp } from '../prototyp/store';
import { abstand, HauptKnopf, NebenKnopf, Seite, Text, useThema } from '../shared/design-system';

/** Outfit für morgen festlegen (Plan K16). Morgens erscheint genau dieses. */
export default function Abend() {
  const { farben } = useThema();
  const teile = usePrototyp((s) => s.teile);
  const start = usePrototyp((s) => s.outfitIndex) + 1;
  const legeMorgenFest = usePrototyp((s) => s.legeMorgenFest);
  const [versatz, setVersatz] = useState(0);
  const outfit = BEISPIEL_OUTFITS[(start + versatz) % BEISPIEL_OUTFITS.length];

  return (
    <Seite
      titel={t('abend.titel')}
      unten={
        <View style={styles.aktionen}>
          <HauptKnopf
            titel={t('abend.passt')}
            style={{ flex: 1 }}
            onPress={() => {
              legeMorgenFest(outfit);
              router.replace('/');
            }}
          />
          <NebenKnopf
            titel={t('abend.anderes')}
            symbol="arrow-forward"
            onPress={() => setVersatz((v) => v + 1)}
          />
        </View>
      }
    >
      <View style={styles.wetter}>
        <Ionicons name="rainy-outline" size={22} color={farben.textLeise} />
        <Text leise>{t('abend.benachrichtigungText')}</Text>
      </View>
      <OutfitBild outfit={outfit} teile={teile} onWischen={() => setVersatz((v) => v + 1)} />
    </Seite>
  );
}

const styles = StyleSheet.create({
  wetter: { flexDirection: 'row', alignItems: 'center', gap: abstand.s },
  aktionen: { flexDirection: 'row', gap: abstand.s, alignItems: 'center' },
});
