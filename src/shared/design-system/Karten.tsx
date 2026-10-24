import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { NebenKnopf, SymbolKnopf } from './Knoepfe';
import { Text } from './Text';
import { abstand, radius, useThema } from './thema';

export function Karte({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const { farben } = useThema();
  return (
    <View
      style={[styles.karte, { backgroundColor: farben.flaeche, borderColor: farben.linie }, style]}
    >
      {children}
    </View>
  );
}

/** Die eine Hinweiskarte pro Tag auf "Heute" (Plan K19). */
export function Hinweiskarte({
  text,
  aktionen,
  onWegtippen,
  wegtippenBeschriftung,
}: {
  text: string;
  aktionen: { titel: string; onPress: () => void }[];
  onWegtippen: () => void;
  wegtippenBeschriftung: string;
}) {
  return (
    <Karte style={styles.hinweis}>
      <View style={styles.hinweisKopf}>
        <Text style={styles.hinweisText}>{text}</Text>
        <SymbolKnopf symbol="close" beschriftung={wegtippenBeschriftung} onPress={onWegtippen} />
      </View>
      <View style={styles.aktionen}>
        {aktionen.map((a) => (
          <NebenKnopf key={a.titel} titel={a.titel} onPress={a.onPress} />
        ))}
      </View>
    </Karte>
  );
}

export type KartenWert = {
  id: string;
  text: string;
  /** Unsichere Werte werden hervorgehoben (Plan Regel 6). */
  unsicher?: boolean;
  onPress?: () => void;
};

/**
 * Bestätigungskarte statt Formular (Plan K09): ein Satz aus Werten, unsichere hervorgehoben,
 * jeder Wert antippbar. Die Aktionen kommen von außen.
 */
export function Bestaetigungskarte({
  bild,
  werte,
  frage,
  erkanntHinweis,
  aendernHinweis,
  aktionen,
}: {
  bild?: ReactNode;
  werte: KartenWert[];
  frage: string;
  erkanntHinweis?: string;
  aendernHinweis: string;
  aktionen: ReactNode;
}) {
  const { farben } = useThema();
  return (
    <Karte style={styles.bestaetigung}>
      {bild ? <View style={styles.bild}>{bild}</View> : null}
      <View style={styles.werte}>
        {werte.map((w) => (
          <Pressable
            key={w.id}
            accessibilityRole="button"
            accessibilityLabel={w.unsicher ? `${w.text}, unsicher` : w.text}
            accessibilityHint={aendernHinweis}
            onPress={w.onPress}
            style={({ pressed }) => [
              styles.wert,
              {
                backgroundColor: w.unsicher ? farben.unsicherFlaeche : farben.flaecheGedrueckt,
                borderColor: w.unsicher ? farben.unsicher : 'transparent',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={w.unsicher ? { color: farben.unsicher, fontWeight: '600' } : undefined}>
              {w.text}
              {w.unsicher ? ' ?' : ''}
            </Text>
          </Pressable>
        ))}
      </View>
      {erkanntHinweis ? (
        <Text art="klein" leise>
          {erkanntHinweis}
        </Text>
      ) : null}
      <Text art="gross">{frage}</Text>
      {aktionen}
    </Karte>
  );
}

const styles = StyleSheet.create({
  karte: { borderRadius: radius.l, borderWidth: StyleSheet.hairlineWidth, padding: abstand.m },
  hinweis: { gap: abstand.s },
  hinweisKopf: { flexDirection: 'row', alignItems: 'flex-start', gap: abstand.s },
  hinweisText: { flex: 1, paddingTop: abstand.s },
  aktionen: { flexDirection: 'row', flexWrap: 'wrap', gap: abstand.s },
  bestaetigung: { gap: abstand.m },
  bild: { alignItems: 'center' },
  werte: { flexDirection: 'row', flexWrap: 'wrap', gap: abstand.s },
  wert: {
    minHeight: 44,
    paddingHorizontal: abstand.m,
    justifyContent: 'center',
    borderRadius: radius.rund,
    borderWidth: 1.5,
  },
});
