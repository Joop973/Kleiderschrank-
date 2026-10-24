import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { KleidungsBild, type KleidungsArt } from '../../core/wardrobe/KleidungsBild';
import { t } from '../../i18n';
import type { Kategorie } from '../../prototyp/beispieldaten';
import { usePrototyp } from '../../prototyp/store';
import { filtereTeile } from '../../prototyp/suche';
import { abstand, radius, Seite, Text, useThema } from '../../shared/design-system';

const KATEGORIEN: { id: Kategorie; art: KleidungsArt }[] = [
  { id: 'oberteil', art: 'tshirt' },
  { id: 'schicht', art: 'jacke' },
  { id: 'unterteil', art: 'hose' },
  { id: 'kleid', art: 'kleid' },
  { id: 'schuhe', art: 'sneaker' },
  { id: 'accessoire', art: 'tasche' },
];

/** Bilderraster mit Kategorien als Bilder und Suche (Plan K21). */
export default function Schrank() {
  const { farben } = useThema();
  const teile = usePrototyp((s) => s.teile);
  const [suche, setSuche] = useState('');
  const [kategorie, setKategorie] = useState<Kategorie | null>(null);
  const gefiltert = filtereTeile(teile, suche, kategorie);

  return (
    <Seite titel={t('schrank.titel')}>
      <TextInput
        value={suche}
        onChangeText={setSuche}
        placeholder={t('schrank.suche')}
        placeholderTextColor={farben.textLeise}
        accessibilityLabel={t('schrank.sucheBeschriftung')}
        style={[
          styles.suche,
          { backgroundColor: farben.flaeche, borderColor: farben.linie, color: farben.text },
        ]}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kategorien}
      >
        {KATEGORIEN.map((k) => {
          const aktiv = kategorie === k.id;
          return (
            <Pressable
              key={k.id}
              accessibilityRole="button"
              accessibilityLabel={t(`kategorien.${k.id}`)}
              accessibilityState={{ selected: aktiv }}
              onPress={() => setKategorie(aktiv ? null : k.id)}
              style={[
                styles.kategorie,
                {
                  backgroundColor: farben.flaeche,
                  borderColor: aktiv ? farben.akzent : farben.linie,
                  borderWidth: aktiv ? 3 : 1,
                },
              ]}
            >
              <KleidungsBild art={k.art} farbe="#9AA19D" groesse={40} />
              <Text art="klein">{t(`kategorien.${k.id}`)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Text leise>
        {gefiltert.length === 1
          ? t('schrank.anzahlEins')
          : t('schrank.anzahl', { anzahl: gefiltert.length })}
      </Text>
      {gefiltert.length === 0 ? <Text>{t('schrank.nichtsGefunden')}</Text> : null}
      <View style={styles.raster}>
        {gefiltert.map((teil) => (
          <Pressable
            key={teil.id}
            accessibilityRole="button"
            accessibilityLabel={teil.name}
            onPress={() => router.push(`/teil/${teil.id}`)}
            style={({ pressed }) => [
              styles.feld,
              {
                backgroundColor: pressed ? farben.flaecheGedrueckt : farben.flaeche,
                borderColor: farben.linie,
              },
            ]}
          >
            <KleidungsBild art={teil.art} farbe={teil.farbe} groesse={72} />
            <Text art="klein" numberOfLines={2} style={styles.name}>
              {teil.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </Seite>
  );
}

const styles = StyleSheet.create({
  suche: {
    minHeight: 48,
    borderRadius: radius.rund,
    borderWidth: 1,
    paddingHorizontal: abstand.m,
    fontSize: 17,
  },
  kategorien: { gap: abstand.s },
  kategorie: {
    alignItems: 'center',
    padding: abstand.s,
    borderRadius: radius.m,
    minWidth: 84,
    gap: 2,
  },
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: abstand.s },
  feld: {
    width: '31.5%',
    alignItems: 'center',
    padding: abstand.s,
    borderRadius: radius.m,
    borderWidth: StyleSheet.hairlineWidth,
    gap: abstand.xs,
  },
  name: { textAlign: 'center' },
});
