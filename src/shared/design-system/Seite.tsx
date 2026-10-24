import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SymbolKnopf } from './Knoepfe';
import { Text } from './Text';
import { abstand, useThema } from './thema';

/** Grundgerüst einer Seite: Titel, optional Zurück und ein Element rechts oben. */
export function Seite({
  titel,
  zurueck,
  zurueckBeschriftung = 'Zurück',
  rechts,
  unten,
  scrollen = true,
  children,
}: PropsWithChildren<{
  titel?: string;
  zurueck?: () => void;
  zurueckBeschriftung?: string;
  rechts?: ReactNode;
  unten?: ReactNode;
  scrollen?: boolean;
}>) {
  const { farben } = useThema();
  const Inhalt = scrollen ? ScrollView : View;
  return (
    <SafeAreaView style={[styles.seite, { backgroundColor: farben.hintergrund }]} edges={['top']}>
      {titel || zurueck || rechts ? (
        <View style={styles.kopf}>
          {zurueck ? (
            <SymbolKnopf
              symbol="chevron-back"
              beschriftung={zurueckBeschriftung}
              onPress={zurueck}
            />
          ) : null}
          {titel ? (
            <Text art="titel" accessibilityRole="header" style={styles.titel} numberOfLines={1}>
              {titel}
            </Text>
          ) : (
            <View style={styles.titel} />
          )}
          {rechts}
        </View>
      ) : null}
      <Inhalt
        style={styles.inhalt}
        contentContainerStyle={scrollen ? styles.inhaltScroll : undefined}
      >
        {children}
      </Inhalt>
      {unten ? <View style={styles.unten}>{unten}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  seite: { flex: 1 },
  kopf: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: abstand.s,
    paddingTop: abstand.s,
    minHeight: 56,
  },
  titel: { flex: 1, paddingHorizontal: abstand.s },
  inhalt: { flex: 1 },
  inhaltScroll: { padding: abstand.m, gap: abstand.m, paddingBottom: abstand.xl * 3 },
  unten: { padding: abstand.m, gap: abstand.s },
});
