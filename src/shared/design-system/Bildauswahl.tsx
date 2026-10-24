import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { abstand, radius, useThema } from './thema';

export type BildOption = { id: string; titel: string; bild: ReactNode };

/** Auswahl über Bilder statt Listen, höchstens 8 sichtbar (Plan Regel 8). */
export function Bildauswahl({
  optionen,
  gewaehlt,
  onWahl,
  spalten = 4,
}: {
  optionen: BildOption[];
  gewaehlt?: string | string[];
  onWahl: (id: string) => void;
  spalten?: number;
}) {
  const { farben } = useThema();
  const aktiv = new Set(Array.isArray(gewaehlt) ? gewaehlt : gewaehlt ? [gewaehlt] : []);
  return (
    <View style={styles.raster}>
      {optionen.slice(0, 8).map((o) => {
        const istAktiv = aktiv.has(o.id);
        return (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityLabel={o.titel}
            accessibilityState={{ selected: istAktiv }}
            onPress={() => onWahl(o.id)}
            style={({ pressed }) => [
              styles.feld,
              {
                width: `${100 / spalten - 2}%`,
                backgroundColor: pressed ? farben.flaecheGedrueckt : farben.flaeche,
                borderColor: istAktiv ? farben.akzent : farben.linie,
                borderWidth: istAktiv ? 3 : 1,
              },
            ]}
          >
            {o.bild}
            <Text art="klein" numberOfLines={2} style={styles.titel}>
              {o.titel}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: abstand.s, justifyContent: 'flex-start' },
  feld: {
    alignItems: 'center',
    paddingVertical: abstand.s,
    paddingHorizontal: abstand.xs,
    borderRadius: radius.m,
    gap: abstand.xs,
    minHeight: 96,
  },
  titel: { textAlign: 'center' },
});
