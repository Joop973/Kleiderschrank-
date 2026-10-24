import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { alsProzent, werteAus, type Bewertung } from '../../core/vision/auswertung';
import { t } from '../../i18n';
import { speichereDatei } from '../../services/datei/speichereDatei';
import {
  vision,
  type FreistellErgebnis,
  type GesichtsErgebnis,
} from '../../services/vision/vision';
import {
  abstand,
  HauptKnopf,
  Karte,
  NebenKnopf,
  radius,
  Seite,
  Text,
  useThema,
} from '../../shared/design-system';

type Eintrag = {
  original: string;
  freistellen?: FreistellErgebnis;
  gesichter?: GesichtsErgebnis;
  fehler?: string;
  bewertung: Bewertung;
};

const sekunden = (ms: number) => (ms / 1000).toFixed(1).replace('.', ',');

function Frage({
  titel,
  wert,
  onWahl,
  mitKeinem,
}: {
  titel: string;
  wert: boolean | null | undefined;
  onWahl: (wert: boolean | null) => void;
  mitKeinem?: boolean;
}) {
  const { farben } = useThema();
  const knopf = (beschriftung: string, ziel: boolean | null) => (
    <NebenKnopf
      key={beschriftung}
      titel={beschriftung}
      onPress={() => onWahl(ziel)}
      style={wert === ziel ? { borderColor: farben.akzent, borderWidth: 2 } : undefined}
    />
  );
  return (
    <View style={styles.frage}>
      <Text>{titel}</Text>
      <View style={styles.knoepfe}>
        {knopf(t('machbarkeit.ja'), true)}
        {knopf(t('machbarkeit.nein'), false)}
        {mitKeinem ? knopf(t('machbarkeit.keinGesicht'), null) : null}
      </View>
    </View>
  );
}

/** Phase 2, auf dem Gerät: Freistellen und Gesichter verpixeln mit eigenen Fotos prüfen. */
export default function Machbarkeit() {
  const { farben } = useThema();
  const [eintraege, setEintraege] = useState<Eintrag[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const bewerte = (index: number, teil: Partial<Bewertung>) =>
    setEintraege((alle) =>
      alle.map((e, i) => (i === index ? { ...e, bewertung: { ...e.bewertung, ...teil } } : e)),
    );

  const waehlen = async () => {
    if (!vision) return;
    const auswahl = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (auswahl.canceled) return;
    const start = eintraege.length;
    setEintraege((alle) => [
      ...alle,
      ...auswahl.assets.map((a) => ({ original: a.uri, bewertung: {} })),
    ]);
    for (const [n, asset] of auswahl.assets.entries()) {
      setStatus(t('machbarkeit.laedt', { nummer: n + 1, gesamt: auswahl.assets.length }));
      try {
        const freistellen = await vision.stelleFrei(asset.uri);
        const gesichter = await vision.verpixleGesichter(asset.uri);
        setEintraege((alle) =>
          alle.map((e, i) =>
            i === start + n
              ? {
                  ...e,
                  freistellen,
                  gesichter,
                  bewertung: { ...e.bewertung, freistellenDauerMs: freistellen.dauerMs },
                }
              : e,
          ),
        );
      } catch (fehler) {
        const text = fehler instanceof Error ? fehler.message : String(fehler);
        setEintraege((alle) => alle.map((e, i) => (i === start + n ? { ...e, fehler: text } : e)));
      }
    }
    setStatus(null);
  };

  const auswertung = werteAus(eintraege.map((e) => e.bewertung));
  const offen = t('machbarkeit.offen');
  const zusammenfassung = t('machbarkeit.zusammenfassung', {
    anzahl: auswertung.anzahl,
    freistellen: alsProzent(auswertung.freistellenQuote) ?? offen,
    gesichter: alsProzent(auswertung.gesichterQuote) ?? offen,
    sekunden:
      auswertung.freistellenSchnittMs === null ? offen : sekunden(auswertung.freistellenSchnittMs),
  });

  const speichern = () =>
    speichereDatei(
      'machbarkeit.json',
      JSON.stringify(
        {
          datum: new Date().toISOString(),
          geraet: typeof navigator === 'undefined' ? '' : navigator.userAgent,
          auswertung,
          fotos: eintraege.map((e, i) => ({
            nummer: i + 1,
            fehler: e.fehler,
            freistellen: e.freistellen && {
              dauerMs: e.freistellen.dauerMs,
              anteil: e.freistellen.anteil,
              plausibel: e.freistellen.plausibel,
            },
            gesichter: e.gesichter && {
              anzahl: e.gesichter.kaesten.length,
              quelle: e.gesichter.quelle,
              dauerMs: e.gesichter.dauerMs,
            },
            bewertung: e.bewertung,
          })),
        },
        null,
        2,
      ),
      'application/json',
    );

  if (!vision) {
    return (
      <Seite titel={t('machbarkeit.titel')} zurueck={() => router.back()}>
        <Text>{t('machbarkeit.nurBrowser')}</Text>
      </Seite>
    );
  }

  return (
    <Seite
      titel={t('machbarkeit.titel')}
      zurueck={() => router.back()}
      unten={
        status ? (
          <Text accessibilityLiveRegion="polite">{status}</Text>
        ) : (
          <HauptKnopf titel={t('machbarkeit.waehlen')} symbol="images-outline" onPress={waehlen} />
        )
      }
    >
      <Text>{t('machbarkeit.einleitung')}</Text>
      <Text leise>{t('machbarkeit.lokal')}</Text>
      {eintraege.length > 0 ? (
        <Karte style={{ gap: abstand.s }}>
          <Text art="gross" accessibilityLiveRegion="polite">
            {zusammenfassung}
          </Text>
          <Text leise>{t('machbarkeit.ziel')}</Text>
          <NebenKnopf
            titel={t('machbarkeit.speichern')}
            symbol="share-outline"
            onPress={speichern}
          />
        </Karte>
      ) : null}
      {eintraege.map((e, i) => (
        <Karte key={`${e.original}-${i}`} style={{ gap: abstand.s }}>
          <Text art="gross">{t('machbarkeit.foto', { nummer: i + 1 })}</Text>
          <View style={styles.bilder}>
            <Image source={{ uri: e.original }} style={styles.bild} resizeMode="contain" />
            {e.freistellen ? (
              <Image
                source={{ uri: e.freistellen.ergebnisUrl }}
                style={[styles.bild, { backgroundColor: farben.flaecheGedrueckt }]}
                resizeMode="contain"
              />
            ) : null}
            {e.gesichter ? (
              <Image
                source={{ uri: e.gesichter.verpixeltUrl }}
                style={styles.bild}
                resizeMode="contain"
              />
            ) : null}
          </View>
          {e.fehler ? (
            <Text style={{ color: farben.unsicher }}>
              {t('machbarkeit.fehler', { nummer: i + 1, text: e.fehler })}
            </Text>
          ) : null}
          {e.freistellen ? (
            <>
              <Text leise>
                {t('machbarkeit.freigestellt', { sekunden: sekunden(e.freistellen.dauerMs) })}
                {e.freistellen.plausibel ? '' : ` ${t('machbarkeit.unplausibel')}`}
              </Text>
              <Frage
                titel={t('machbarkeit.frageFreistellen')}
                wert={e.bewertung.freistellenBrauchbar}
                onWahl={(w) => bewerte(i, { freistellenBrauchbar: w ?? undefined })}
              />
            </>
          ) : null}
          {e.gesichter ? (
            <>
              <Text leise>
                {t('machbarkeit.gesichter', {
                  anzahl: e.gesichter.kaesten.length,
                  quelle:
                    e.gesichter.quelle === 'gesicht'
                      ? t('machbarkeit.quelleGesicht')
                      : e.gesichter.quelle === 'koerper'
                        ? t('machbarkeit.quelleKoerper')
                        : t('machbarkeit.quelleKeins'),
                  sekunden: sekunden(e.gesichter.dauerMs),
                })}
              </Text>
              <Frage
                titel={t('machbarkeit.frageGesicht')}
                wert={e.bewertung.gesichtUnkenntlich}
                onWahl={(w) => bewerte(i, { gesichtUnkenntlich: w })}
                mitKeinem
              />
            </>
          ) : null}
        </Karte>
      ))}
    </Seite>
  );
}

const styles = StyleSheet.create({
  bilder: { flexDirection: 'row', gap: abstand.xs },
  bild: { flex: 1, aspectRatio: 0.75, borderRadius: radius.s },
  frage: { gap: abstand.xs },
  knoepfe: { flexDirection: 'row', flexWrap: 'wrap', gap: abstand.s },
});
