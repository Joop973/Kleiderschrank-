import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { t } from '../../i18n';
import { usePrototyp } from '../../prototyp/store';
import {
  abstand,
  Karte,
  ListenZeile,
  radius,
  Seite,
  Text,
  useThema,
  type Erscheinungsbild,
} from '../../shared/design-system';

const UHRZEITEN = ['19:00', '20:00', '21:00', '22:00'];
const BILDER: Erscheinungsbild[] = ['system', 'hell', 'dunkel', 'reizarm'];

/** Alle Einstellungen auf einem Bildschirm (Plan 3.3, Regel 10). */
export default function Einstellungen() {
  const { farben, erscheinungsbild, setzeErscheinungsbild } = useThema();
  const zeigeLeiste = usePrototyp((s) => s.zeigeLeiste);
  const [uhrzeit, setUhrzeit] = useState(1);
  const [benachrichtigungen, setBenachrichtigungen] = useState(true);
  const [ki, setKi] = useState(true);
  const schalter = (wert: boolean, setze: (w: boolean) => void, titel: string) => (
    <Switch
      accessibilityLabel={titel}
      value={wert}
      onValueChange={setze}
      trackColor={{ true: farben.akzent, false: farben.linie }}
    />
  );

  return (
    <Seite titel={t('einstellungen.titel')} zurueck={() => router.back()}>
      <Karte style={{ padding: 0, overflow: 'hidden' }}>
        <ListenZeile
          titel={t('einstellungen.uhrzeit')}
          untertitel={t('einstellungen.uhrzeitWert', { uhrzeit: UHRZEITEN[uhrzeit] })}
          symbol="moon-outline"
          onPress={() => setUhrzeit((u) => (u + 1) % UHRZEITEN.length)}
        />
        <ListenZeile
          titel={t('einstellungen.benachrichtigungen')}
          symbol="notifications-outline"
          rechts={schalter(
            benachrichtigungen,
            setBenachrichtigungen,
            t('einstellungen.benachrichtigungen'),
          )}
        />
        <ListenZeile
          titel={t('einstellungen.wohnort')}
          untertitel={t('einstellungen.wohnortWert')}
          symbol="location-outline"
        />
        <ListenZeile
          titel={t('einstellungen.kalender')}
          untertitel={t('einstellungen.kalenderWert')}
          symbol="calendar-outline"
        />
        <ListenZeile
          titel={t('einstellungen.ki')}
          symbol="sparkles-outline"
          rechts={schalter(ki, setKi, t('einstellungen.ki'))}
        />
      </Karte>

      <Text art="gross">{t('einstellungen.erscheinungsbild')}</Text>
      <View style={styles.segmente} accessibilityRole="radiogroup">
        {BILDER.map((bild) => {
          const aktiv = erscheinungsbild === bild;
          return (
            <Pressable
              key={bild}
              accessibilityRole="radio"
              accessibilityState={{ checked: aktiv }}
              accessibilityLabel={t(`einstellungen.${bild}`)}
              onPress={() => setzeErscheinungsbild(bild)}
              style={[
                styles.segment,
                {
                  backgroundColor: aktiv ? farben.text : farben.flaeche,
                  borderColor: farben.linie,
                },
              ]}
            >
              <Text art="klein" style={{ color: aktiv ? farben.hintergrund : farben.text }}>
                {t(`einstellungen.${bild}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Karte style={{ padding: 0, overflow: 'hidden' }}>
        <ListenZeile
          titel={t('mehr.erweiterungen')}
          symbol="extension-puzzle-outline"
          onPress={() => router.push('/mehr/erweiterungen')}
        />
        <ListenZeile
          titel={t('einstellungen.export')}
          symbol="download-outline"
          onPress={() => zeigeLeiste(t('allgemein.kommtBald'))}
        />
        <ListenZeile
          titel={t('mehr.datenschutz')}
          symbol="shield-checkmark-outline"
          onPress={() => router.push('/mehr/datenschutz')}
        />
        <ListenZeile
          titel={t('mehr.hilfe')}
          symbol="help-circle-outline"
          onPress={() => router.push('/mehr/hilfe')}
        />
      </Karte>
    </Seite>
  );
}

const styles = StyleSheet.create({
  segmente: { flexDirection: 'row', gap: abstand.xs },
  segment: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.m,
    borderWidth: 1,
  },
});
