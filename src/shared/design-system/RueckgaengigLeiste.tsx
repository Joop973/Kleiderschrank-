import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { abstand, radius, useThema } from './thema';

/** Rückgängig statt Nachfragen (Plan Regel 9). Verschwindet nach einigen Sekunden. */
export function RueckgaengigLeiste({
  text,
  rueckgaengigTitel,
  onRueckgaengig,
  onSchliessen,
  dauerMs = 6000,
}: {
  text: string;
  rueckgaengigTitel: string;
  onRueckgaengig?: () => void;
  onSchliessen: () => void;
  dauerMs?: number;
}) {
  const { farben } = useThema();
  useEffect(() => {
    const t = setTimeout(onSchliessen, dauerMs);
    return () => clearTimeout(t);
  }, [onSchliessen, dauerMs, text]);

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.leiste, { backgroundColor: farben.text }]}
    >
      <Text style={[styles.text, { color: farben.hintergrund }]}>{text}</Text>
      {onRueckgaengig ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={rueckgaengigTitel}
          onPress={() => {
            onRueckgaengig();
            onSchliessen();
          }}
          style={styles.knopf}
        >
          <Text art="gross" style={{ color: farben.hintergrund, textDecorationLine: 'underline' }}>
            {rueckgaengigTitel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  leiste: {
    position: 'absolute',
    left: abstand.m,
    right: abstand.m,
    bottom: abstand.m,
    borderRadius: radius.m,
    paddingLeft: abstand.m,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  text: { flex: 1, paddingVertical: abstand.s },
  knopf: { minHeight: 48, minWidth: 48, paddingHorizontal: abstand.m, justifyContent: 'center' },
});
