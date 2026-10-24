import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { KleidungsBild } from '../core/wardrobe/KleidungsBild';
import { t, type TextSchluessel } from '../i18n';
import { teilMitId } from '../prototyp/beispieldaten';
import { usePrototyp } from '../prototyp/store';
import { abstand, HauptKnopf, Karte, Seite, Text } from '../shared/design-system';

const GAENGE: { titel: TextSchluessel; ids: string[]; anzahl: number }[] = [
  { titel: 'waesche.gang40Dunkel', ids: ['t8', 't9', 't15'], anzahl: 6 },
  { titel: 'waesche.gang30Hell', ids: ['t1', 't2', 't4'], anzahl: 5 },
  { titel: 'waesche.gangHand', ids: ['t3'], anzahl: 1 },
];

/** Waschgänge nach Temperatur und Farbe (Plan K24). */
export default function Waesche() {
  const teile = usePrototyp((s) => s.teile);
  const waescheFertig = usePrototyp((s) => s.waescheFertig);
  const zeigeLeiste = usePrototyp((s) => s.zeigeLeiste);
  return (
    <Seite
      titel={t('waesche.titel')}
      zurueck={() => router.back()}
      unten={
        <HauptKnopf
          titel={t('waesche.fertig')}
          onPress={() => {
            waescheFertig();
            router.back();
            zeigeLeiste(t('waesche.erledigt'));
          }}
        />
      }
    >
      <Text>{t('waesche.einleitung')}</Text>
      {GAENGE.map((gang) => (
        <Karte key={gang.titel} style={{ gap: abstand.s }}>
          <Text art="gross">{t(gang.titel)}</Text>
          <Text leise>{t('waesche.teile', { anzahl: gang.anzahl })}</Text>
          <View style={styles.teile}>
            {gang.ids.map((id) => {
              const teil = teilMitId(teile, id);
              return teil ? (
                <View key={id} accessibilityLabel={teil.name}>
                  <KleidungsBild art={teil.art} farbe={teil.farbe} groesse={48} />
                </View>
              ) : null;
            })}
          </View>
        </Karte>
      ))}
    </Seite>
  );
}

const styles = StyleSheet.create({ teile: { flexDirection: 'row', gap: abstand.s } });
