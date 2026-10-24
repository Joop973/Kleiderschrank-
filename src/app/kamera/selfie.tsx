import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { KleidungsBild } from '../../core/wardrobe/KleidungsBild';
import { t } from '../../i18n';
import { teilMitId } from '../../prototyp/beispieldaten';
import { usePrototyp } from '../../prototyp/store';
import {
  abstand,
  Bildauswahl,
  HauptKnopf,
  Karte,
  Seite,
  Text,
  useThema,
} from '../../shared/design-system';

/** Spiegel-Selfie: Gesicht verpixelt, Teile zugeordnet, knappe Treffer nachgefragt (Plan K26). */
export default function Selfie() {
  const { farben } = useThema();
  const teile = usePrototyp((s) => s.teile);
  const zeigeLeiste = usePrototyp((s) => s.zeigeLeiste);
  const kameraLeeren = usePrototyp((s) => s.kameraLeeren);
  const [schuhe, setSchuhe] = useState('t12');
  const sicher = ['t8', 't1'].map((id) => teilMitId(teile, id)).filter((x) => x !== undefined);
  const knapp = ['t12', 't11'].map((id) => teilMitId(teile, id)).filter((x) => x !== undefined);

  const ja = () => {
    kameraLeeren();
    router.dismissTo('/');
    zeigeLeiste(t('selfie.gespeichert'));
  };

  return (
    <Seite
      titel={t('selfie.titel')}
      zurueck={() => {
        kameraLeeren();
        router.back();
      }}
      unten={<HauptKnopf titel={t('selfie.ja')} onPress={ja} />}
    >
      <View style={styles.oben}>
        <KleidungsBild art="person" farbe="#F4F4F0" groesse={140} />
        <View style={styles.verpixelt}>
          <Ionicons name="shield-checkmark-outline" size={20} color={farben.textLeise} />
          <Text art="klein" leise style={{ flex: 1 }}>
            {t('selfie.verpixelt')}
          </Text>
        </View>
      </View>
      <Karte style={{ gap: abstand.s }}>
        {sicher.map((teil) => (
          <View key={teil.id} style={styles.zeile} accessibilityLabel={teil.name}>
            <KleidungsBild art={teil.art} farbe={teil.farbe} groesse={44} />
            <Text style={{ flex: 1 }}>{teil.name}</Text>
            <Ionicons name="checkmark" size={22} color={farben.akzent} />
          </View>
        ))}
      </Karte>
      <Text art="gross" style={{ color: farben.unsicher }}>
        {t('selfie.knapp')}
      </Text>
      <Bildauswahl
        spalten={2}
        gewaehlt={schuhe}
        onWahl={setSchuhe}
        optionen={knapp.map((teil) => ({
          id: teil.id,
          titel: teil.name,
          bild: <KleidungsBild art={teil.art} farbe={teil.farbe} groesse={56} />,
        }))}
      />
    </Seite>
  );
}

const styles = StyleSheet.create({
  oben: { alignItems: 'center', gap: abstand.s },
  verpixelt: { flexDirection: 'row', alignItems: 'center', gap: abstand.s },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: abstand.m },
});
