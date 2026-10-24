import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { t } from '../i18n';
import {
  abstand,
  HauptKnopf,
  Karte,
  NebenKnopf,
  radius,
  Seite,
  Text,
  useThema,
} from '../shared/design-system';

type Schritt = 'selfie' | 'haare' | 'augen' | 'regler' | 'ergebnis';

const PALETTE = ['#1F5F6B', '#2F5D44', '#C99A2E', '#A4472F', '#B8875A', '#EFE6D2'];

/** Gezeichnetes Gesicht für den Farbtyp; im echten Ablauf das eigene Selfie (bleibt auf dem Gerät). */
function Gesicht({ markiert }: { markiert: ('haare' | 'augen')[] }) {
  return (
    <Svg width={200} height={220} viewBox="0 0 100 110" accessible={false}>
      <Path d="M18 52 Q16 10 50 8 Q84 10 82 52 L78 40 Q50 20 22 40 Z" fill="#5A3B26" />
      <Ellipse cx={50} cy={58} rx={28} ry={34} fill="#E3BFA0" />
      <Circle cx={40} cy={54} r={3.5} fill="#4B6A3D" />
      <Circle cx={60} cy={54} r={3.5} fill="#4B6A3D" />
      <Path d="M42 76 Q50 81 58 76" stroke="#A35D4A" strokeWidth={2} fill="none" />
      {markiert.includes('haare') ? (
        <Circle cx={30} cy={24} r={6} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
      ) : null}
      {markiert.includes('augen') ? (
        <Circle cx={40} cy={54} r={7} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
      ) : null}
    </Svg>
  );
}

function Regler({ titel, links, rechts }: { titel: string; links: string; rechts: string }) {
  const { farben } = useThema();
  const [wert, setWert] = useState(0.5);
  return (
    <View style={{ gap: abstand.xs }}>
      <Text>{titel}</Text>
      <Slider
        accessibilityLabel={titel}
        value={wert}
        onValueChange={setWert}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor={farben.akzent}
        maximumTrackTintColor={farben.linie}
        thumbTintColor={farben.akzent}
        style={{ height: 48 }}
      />
      <View style={styles.enden}>
        <Text art="klein" leise>
          {links}
        </Text>
        <Text art="klein" leise>
          {rechts}
        </Text>
      </View>
    </View>
  );
}

/** Farbtyp in ca. 1 Minute, komplett auf dem Gerät (Plan K28). */
export default function Farbtyp() {
  const { farben } = useThema();
  const [schritt, setSchritt] = useState<Schritt>('selfie');
  const [hilfe, setHilfe] = useState(false);
  const markiert: ('haare' | 'augen')[] =
    schritt === 'augen'
      ? ['haare']
      : schritt === 'regler' || schritt === 'ergebnis'
        ? ['haare', 'augen']
        : [];

  const unten =
    schritt === 'selfie' ? (
      <HauptKnopf
        titel={t('farbtyp.ausloeser')}
        symbol="camera-outline"
        onPress={() => setSchritt('haare')}
      />
    ) : schritt === 'regler' ? (
      <HauptKnopf titel={t('allgemein.weiter')} onPress={() => setSchritt('ergebnis')} />
    ) : schritt === 'ergebnis' ? (
      <HauptKnopf titel={t('farbtyp.fertig')} onPress={() => router.back()} />
    ) : undefined;

  return (
    <Seite titel={t('farbtyp.titel')} zurueck={() => router.back()} unten={unten}>
      {schritt === 'selfie' ? <Text>{t('farbtyp.selfie')}</Text> : null}
      {schritt === 'haare' ? <Text art="gross">{t('farbtyp.haare')}</Text> : null}
      {schritt === 'augen' ? <Text art="gross">{t('farbtyp.augen')}</Text> : null}

      {schritt !== 'ergebnis' && schritt !== 'regler' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            schritt === 'haare'
              ? t('farbtyp.haare')
              : schritt === 'augen'
                ? t('farbtyp.augen')
                : t('farbtyp.selfie')
          }
          disabled={schritt === 'selfie'}
          onPress={() => setSchritt(schritt === 'haare' ? 'augen' : 'regler')}
          style={[styles.bild, { backgroundColor: farben.sucher }]}
        >
          <Gesicht markiert={markiert} />
        </Pressable>
      ) : null}

      {schritt === 'regler' ? (
        <View style={{ gap: abstand.m }}>
          <Text>{t('farbtyp.regler')}</Text>
          <Regler
            titel={t('farbtyp.haut')}
            links={t('farbtyp.hell')}
            rechts={t('farbtyp.dunkel')}
          />
          <Regler
            titel={t('farbtyp.unterton')}
            links={t('farbtyp.warm')}
            rechts={t('farbtyp.kuehl')}
          />
          <NebenKnopf titel={t('farbtyp.weissNicht')} onPress={() => setHilfe((h) => !h)} />
          {hilfe ? <Text leise>{t('farbtyp.untertonHilfe')}</Text> : null}
          <Regler
            titel={t('farbtyp.haarfarbe')}
            links={t('farbtyp.hell')}
            rechts={t('farbtyp.dunkel')}
          />
          <Regler
            titel={t('farbtyp.kontrast')}
            links={t('farbtyp.wenig')}
            rechts={t('farbtyp.viel')}
          />
        </View>
      ) : null}

      {schritt === 'ergebnis' ? (
        <Karte style={{ gap: abstand.m }}>
          <Text art="gross">{t('farbtyp.ergebnis')}</Text>
          <View style={styles.palette} accessibilityLabel={t('farbtyp.farbnamen')}>
            {PALETTE.map((f) => (
              <View
                key={f}
                style={[styles.feld, { backgroundColor: f, borderColor: farben.linie }]}
              />
            ))}
          </View>
          <Text>{t('farbtyp.farbnamen')}</Text>
          <Text art="klein" leise>
            {t('farbtyp.ergebnisHinweis')}
          </Text>
        </Karte>
      ) : null}
    </Seite>
  );
}

const styles = StyleSheet.create({
  bild: { alignItems: 'center', borderRadius: radius.l, paddingVertical: abstand.m },
  enden: { flexDirection: 'row', justifyContent: 'space-between' },
  palette: { flexDirection: 'row', flexWrap: 'wrap', gap: abstand.s },
  feld: { width: 48, height: 48, borderRadius: radius.s, borderWidth: 1 },
});
