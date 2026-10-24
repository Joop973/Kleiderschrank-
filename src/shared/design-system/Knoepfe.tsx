import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from './Text';
import { abstand, radius, TIPPFLAECHE, useThema } from './thema';

export type SymbolName = ComponentProps<typeof Ionicons>['name'];

/** Die eine Hauptaktion eines Bildschirms (Plan Regel 2). */
export function HauptKnopf({
  titel,
  onPress,
  symbol,
  style,
  hinweis,
}: {
  titel: string;
  onPress: () => void;
  symbol?: SymbolName;
  style?: StyleProp<ViewStyle>;
  hinweis?: string;
}) {
  const { farben } = useThema();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titel}
      accessibilityHint={hinweis}
      onPress={onPress}
      style={({ pressed }) => [
        styles.haupt,
        { backgroundColor: farben.akzent, opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {symbol ? <Ionicons name={symbol} size={22} color={farben.aufAkzent} /> : null}
      <Text art="gross" style={{ color: farben.aufAkzent }}>
        {titel}
      </Text>
    </Pressable>
  );
}

/** Zweitrangige Aktion: Rahmen statt Füllung, kleiner. */
export function NebenKnopf({
  titel,
  onPress,
  symbol,
  style,
  beschriftung,
}: {
  titel: string;
  onPress: () => void;
  symbol?: SymbolName;
  style?: StyleProp<ViewStyle>;
  /** Längere Beschriftung für Screenreader, wenn der Titel allein unklar ist. */
  beschriftung?: string;
}) {
  const { farben } = useThema();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={beschriftung ?? titel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.neben,
        {
          borderColor: farben.linie,
          backgroundColor: pressed ? farben.flaecheGedrueckt : farben.flaeche,
        },
        style,
      ]}
    >
      {symbol ? <Ionicons name={symbol} size={20} color={farben.text} /> : null}
      <Text>{titel}</Text>
    </Pressable>
  );
}

/** Runder Knopf nur mit Symbol; braucht immer eine Beschriftung für Screenreader. */
export function SymbolKnopf({
  symbol,
  beschriftung,
  onPress,
  farbe,
  groesse = 24,
  style,
}: {
  symbol: SymbolName;
  beschriftung: string;
  onPress: () => void;
  farbe?: string;
  groesse?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { farben } = useThema();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={beschriftung}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.symbol, { opacity: pressed ? 0.6 : 1 }, style]}
    >
      <Ionicons name={symbol} size={groesse} color={farbe ?? farben.text} />
    </Pressable>
  );
}

/** Zeile in Listen (Mehr, Einstellungen). */
export function ListenZeile({
  titel,
  untertitel,
  symbol,
  onPress,
  rechts,
}: {
  titel: string;
  untertitel?: string;
  symbol?: SymbolName;
  onPress?: () => void;
  rechts?: ReactNode;
}) {
  const { farben } = useThema();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={untertitel ? `${titel}. ${untertitel}` : titel}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.zeile,
        {
          backgroundColor: pressed ? farben.flaecheGedrueckt : farben.flaeche,
          borderColor: farben.linie,
        },
      ]}
    >
      {symbol ? <Ionicons name={symbol} size={24} color={farben.text} /> : null}
      <Text style={styles.zeileText}>
        {titel}
        {untertitel ? (
          <Text art="klein" leise>
            {'\n'}
            {untertitel}
          </Text>
        ) : null}
      </Text>
      {rechts ??
        (onPress ? <Ionicons name="chevron-forward" size={20} color={farben.textLeise} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  haupt: {
    minHeight: 56,
    borderRadius: radius.rund,
    paddingHorizontal: abstand.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: abstand.s,
  },
  neben: {
    minHeight: TIPPFLAECHE,
    borderRadius: radius.rund,
    borderWidth: 1,
    paddingHorizontal: abstand.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: abstand.s,
  },
  symbol: {
    width: TIPPFLAECHE,
    height: TIPPFLAECHE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zeile: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: abstand.m,
    paddingHorizontal: abstand.m,
    paddingVertical: abstand.s,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  zeileText: { flex: 1 },
});
