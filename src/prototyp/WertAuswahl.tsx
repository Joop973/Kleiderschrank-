import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { t } from '../i18n';
import {
  abstand,
  Bildauswahl,
  radius,
  Text,
  useThema,
  type BildOption,
} from '../shared/design-system';

/** Wert ändern über eine Bildauswahl statt über ein Formularfeld (Plan K09). */
export function WertAuswahl({
  titel,
  optionen,
  gewaehlt,
  onWahl,
  onSchliessen,
}: {
  titel: string;
  optionen: BildOption[];
  gewaehlt?: string;
  onWahl: (id: string) => void;
  onSchliessen: () => void;
}) {
  const { farben } = useThema();
  return (
    <Modal transparent animationType="fade" onRequestClose={onSchliessen}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('allgemein.schliessen')}
        onPress={onSchliessen}
        style={styles.abdunkeln}
      />
      <View style={[styles.blatt, { backgroundColor: farben.hintergrund }]}>
        <Text art="gross" accessibilityRole="header">
          {titel}
        </Text>
        <Bildauswahl
          optionen={optionen}
          gewaehlt={gewaehlt}
          onWahl={(id) => {
            onWahl(id);
            onSchliessen();
          }}
        />
      </View>
    </Modal>
  );
}

/** Farbfeld als Bild für die Bildauswahl. */
export function FarbFeld({ farbe }: { farbe: string }) {
  const { farben } = useThema();
  return <View style={[styles.farbfeld, { backgroundColor: farbe, borderColor: farben.linie }]} />;
}

export const FARB_OPTIONEN: { id: string; titel: string; farbe: string }[] = [
  { id: 'Blau', titel: 'Blau', farbe: '#4A6FA5' },
  { id: 'Dunkelblau', titel: 'Dunkelblau', farbe: '#24365C' },
  { id: 'Schwarz', titel: 'Schwarz', farbe: '#2A2A2C' },
  { id: 'Grau', titel: 'Grau', farbe: '#8E9190' },
  { id: 'Weiß', titel: 'Weiß', farbe: '#F4F4F0' },
  { id: 'Beige', titel: 'Beige', farbe: '#CDB894' },
  { id: 'Grün', titel: 'Grün', farbe: '#3E6B4F' },
  { id: 'Rot', titel: 'Rot', farbe: '#B23A3A' },
];

const styles = StyleSheet.create({
  abdunkeln: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.45)' },
  blatt: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radius.l,
    borderTopRightRadius: radius.l,
    padding: abstand.m,
    paddingBottom: abstand.xl,
    gap: abstand.m,
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },
  farbfeld: { width: 44, height: 44, borderRadius: 22, borderWidth: 1 },
});
