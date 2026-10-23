import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';

import { farbenFuer, ThemaKontext, type Erscheinungsbild } from './thema';

/** Stellt Farben bereit. Das gewählte Erscheinungsbild speichert der Aufrufer. */
export function ThemaProvider({
  erscheinungsbild,
  setzeErscheinungsbild,
  children,
}: PropsWithChildren<{
  erscheinungsbild: Erscheinungsbild;
  setzeErscheinungsbild: (bild: Erscheinungsbild) => void;
}>) {
  const system = useColorScheme();
  const [bewegungReduziert, setBewegungReduziert] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setBewegungReduziert)
      .catch(() => {});
    const abo = AccessibilityInfo.addEventListener('reduceMotionChanged', setBewegungReduziert);
    return () => abo.remove();
  }, []);

  const wert = useMemo(() => {
    const farben = farbenFuer(erscheinungsbild, system === 'dark');
    const dunkel = farben.hintergrund === farbenFuer('dunkel', true).hintergrund;
    return {
      farben,
      dunkel,
      bewegung: erscheinungsbild !== 'reizarm' && !bewegungReduziert,
      erscheinungsbild,
      setzeErscheinungsbild,
    };
  }, [erscheinungsbild, system, bewegungReduziert, setzeErscheinungsbild]);

  return <ThemaKontext.Provider value={wert}>{children}</ThemaKontext.Provider>;
}
