import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { KleidungsBild } from '../core/wardrobe/KleidungsBild';
import { t } from '../i18n';
import { abstand, radius, useThema, useWischen } from '../shared/design-system';
import { SLOTS, teilMitId, type Outfit, type Slot, type Teil } from './beispieldaten';

/**
 * Outfit als Collage; jedes Teil ist antippbar (Plan 3.1, K13).
 * Wischen nach links oder rechts zeigt ein anderes Outfit.
 */
export function OutfitBild({
  outfit,
  teile,
  onTausche,
  onWischen,
  groesse = 'gross',
}: {
  outfit: Outfit;
  teile: readonly Teil[];
  onTausche?: (slot: Slot) => void;
  onWischen?: () => void;
  groesse?: 'gross' | 'klein';
}) {
  const { farben } = useThema();
  const wischHandler = useWischen(onWischen);

  // Auf kleinen Bildschirmen kleiner, damit die Hinweiskarte darunter sichtbar bleibt.
  const { height } = useWindowDimensions();
  const bild =
    groesse === 'gross' ? Math.round(Math.min(92, Math.max(60, (height - 500) / 2.4))) : 56;
  return (
    <View
      {...(onWischen ? wischHandler : {})}
      style={[styles.raster, { backgroundColor: farben.flaeche, borderColor: farben.linie }]}
    >
      {SLOTS.map((slot) => {
        const teil = teilMitId(teile, outfit[slot]);
        if (!teil) return null;
        const inhalt = (
          <KleidungsBild
            art={teil.art}
            farbe={teil.farbe}
            groesse={slot === 'accessoire' ? bild * 0.7 : bild}
          />
        );
        return onTausche ? (
          <Pressable
            key={slot}
            accessibilityRole="button"
            accessibilityLabel={t('heute.teilTauschen', { teil: teil.name })}
            onPress={() => onTausche(slot)}
            style={({ pressed }) => [
              styles.feld,
              { backgroundColor: pressed ? farben.flaecheGedrueckt : 'transparent' },
            ]}
          >
            {inhalt}
          </Pressable>
        ) : (
          <View key={slot} style={styles.feld} accessibilityLabel={teil.name}>
            {inhalt}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  raster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: radius.l,
    borderWidth: StyleSheet.hairlineWidth,
    padding: abstand.s,
  },
  feld: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: abstand.xs,
    borderRadius: radius.m,
    minHeight: 48,
  },
});
