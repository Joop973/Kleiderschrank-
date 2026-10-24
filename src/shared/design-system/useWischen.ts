import { useMemo } from 'react';
import { PanResponder, type GestureResponderHandlers } from 'react-native';

/**
 * Waagrechtes Wischen erkennen. "rechts" reagiert nur auf Wischen nach rechts,
 * "beide" auf beide Richtungen. Liefert die Handler für eine View.
 */
export function useWischen(
  aktion: (() => void) | undefined,
  richtung: 'rechts' | 'beide' = 'beide',
  schwelle = 70,
): GestureResponderHandlers {
  return useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dy) < 30 && (richtung === 'rechts' ? g.dx > 24 : Math.abs(g.dx) > 24),
        onPanResponderRelease: (_, g) => {
          const weit = richtung === 'rechts' ? g.dx > schwelle : Math.abs(g.dx) > schwelle;
          if (weit) aktion?.();
        },
      }).panHandlers,
    [aktion, richtung, schwelle],
  );
}
