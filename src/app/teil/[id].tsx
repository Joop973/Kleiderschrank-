import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { KleidungsBild } from '../../core/wardrobe/KleidungsBild';
import { t } from '../../i18n';
import { preisProTragen, teilMitId } from '../../prototyp/beispieldaten';
import { usePrototyp } from '../../prototyp/store';
import { abstand, Karte, ListenZeile, Seite, Text } from '../../shared/design-system';

/** Teil-Ansicht (Plan K22). Ändern der Werte folgt in Phase 5. */
export default function TeilAnsicht() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teile = usePrototyp((s) => s.teile);
  const zeigeLeiste = usePrototyp((s) => s.zeigeLeiste);
  const teil = teilMitId(teile, id ?? '');
  if (!teil) return null;

  const aendern = () => zeigeLeiste(t('allgemein.kommtBald'));
  const aufwand = {
    wenig: t('teil.aufwandWenig'),
    mittel: t('teil.aufwandMittel'),
    viel: t('teil.aufwandViel'),
  }[teil.pflegeaufwand];
  const zeilen: [string, string][] = [
    [t('teil.groesse'), teil.groesse],
    [t('teil.marke'), teil.marke],
    [t('teil.material'), teil.material],
    [t('teil.pflege'), teil.pflege],
    [t('teil.pflegeaufwand'), aufwand],
    [t('teil.preisProTragen'), preisProTragen(teil) ?? '–'],
    [t('teil.zuletzt'), teil.zuletzt || '–'],
  ];

  return (
    <Seite titel={teil.name} zurueck={() => router.back()}>
      <View style={styles.bild}>
        <KleidungsBild art={teil.art} farbe={teil.farbe} groesse={180} />
        <Text leise>
          {t('teil.getragen', { anzahl: teil.getragen })}
          {teil.inWaesche ? ` · ${t('teil.waesche')}` : ''}
        </Text>
      </View>
      <Karte style={{ padding: 0, overflow: 'hidden' }}>
        {zeilen.map(([titel, wert]) => (
          <ListenZeile key={titel} titel={wert} untertitel={titel} onPress={aendern} />
        ))}
      </Karte>
    </Seite>
  );
}

const styles = StyleSheet.create({ bild: { alignItems: 'center', gap: abstand.s } });
