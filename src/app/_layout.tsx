import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { ErweiterungsProvider } from '../core/steckplaetze/ErweiterungsKontext';
import { DatenbankProvider, useDatenbank } from '../db/DatenbankProvider';
import { leseEinstellung, schreibeEinstellung } from '../db/repositories/einstellungen';
import { t } from '../i18n';
import { usePrototyp } from '../prototyp/store';
import {
  RueckgaengigLeiste,
  Text,
  ThemaProvider,
  useThema,
  type Erscheinungsbild,
} from '../shared/design-system';
import { ALLE_ERWEITERUNGEN } from '../zusammenbau';

const ERSCHEINUNGSBILDER: Erscheinungsbild[] = ['system', 'hell', 'dunkel', 'reizarm'];

/** Lädt das gespeicherte Erscheinungsbild aus der Datenbank. */
function GespeichertesThema({ children }: PropsWithChildren) {
  const db = useDatenbank();
  const [bild, setBild] = useState<Erscheinungsbild>('system');
  useEffect(() => {
    leseEinstellung(db, 'erscheinungsbild').then((wert) => {
      if (wert && ERSCHEINUNGSBILDER.includes(wert as Erscheinungsbild)) {
        setBild(wert as Erscheinungsbild);
      }
    });
  }, [db]);
  const setze = useCallback(
    (neu: Erscheinungsbild) => {
      setBild(neu);
      schreibeEinstellung(db, 'erscheinungsbild', neu);
    },
    [db],
  );
  return (
    <ThemaProvider erscheinungsbild={bild} setzeErscheinungsbild={setze}>
      {children}
    </ThemaProvider>
  );
}

function Rahmen() {
  const { farben, dunkel, bewegung } = useThema();
  const leiste = usePrototyp((s) => s.leiste);
  const schliesseLeiste = usePrototyp((s) => s.schliesseLeiste);
  const navThema = {
    ...DefaultTheme,
    dark: dunkel,
    colors: {
      ...DefaultTheme.colors,
      background: farben.hintergrund,
      card: farben.flaeche,
      text: farben.text,
      border: farben.linie,
      primary: farben.akzent,
    },
  };
  return (
    <ThemeProvider value={navThema}>
      <StatusBar style={dunkel ? 'light' : 'dark'} />
      <View style={[styles.aussen, { backgroundColor: farben.hintergrund }]}>
        <View style={styles.innen}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: bewegung ? 'default' : 'none',
              contentStyle: { backgroundColor: farben.hintergrund },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="kamera" options={{ presentation: 'fullScreenModal' }} />
          </Stack>
          {leiste ? (
            <RueckgaengigLeiste
              key={leiste.id}
              text={leiste.text}
              rueckgaengigTitel={t('allgemein.rueckgaengig')}
              onRueckgaengig={leiste.rueckgaengig}
              onSchliessen={schliesseLeiste}
            />
          ) : null}
        </View>
      </View>
    </ThemeProvider>
  );
}

function DatenbankFehler() {
  return (
    <View style={styles.fehler}>
      <Text>{t('datenbank.fehler')}</Text>
    </View>
  );
}

export default function Layout() {
  return (
    <DatenbankProvider fehlerAnzeige={() => <DatenbankFehler />}>
      <GespeichertesThema>
        <ErweiterungsProvider alle={ALLE_ERWEITERUNGEN}>
          <Rahmen />
        </ErweiterungsProvider>
      </GespeichertesThema>
    </DatenbankProvider>
  );
}

const styles = StyleSheet.create({
  aussen: { flex: 1, alignItems: 'center' },
  // Im Browser auf großen Bildschirmen Handybreite behalten.
  innen: { flex: 1, width: '100%', maxWidth: 560 },
  fehler: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
