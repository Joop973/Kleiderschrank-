import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KleidungsBild, type KleidungsArt } from '../../core/wardrobe/KleidungsBild';
import { t } from '../../i18n';
import { NEUE_JEANS } from '../../prototyp/beispieldaten';
import { usePrototyp, type FotoTyp } from '../../prototyp/store';
import { FARB_OPTIONEN, FarbFeld, WertAuswahl } from '../../prototyp/WertAuswahl';
import {
  abstand,
  Bestaetigungskarte,
  HauptKnopf,
  NebenKnopf,
  radius,
  SymbolKnopf,
  Text,
  useThema,
  type KartenWert,
} from '../../shared/design-system';

type Motiv = { typ: FotoTyp; art: KleidungsArt; farbe: string; hinweis: string };

const MOTIVE: Record<FotoTyp, Motiv> = {
  teil: { typ: 'teil', art: 'jeans', farbe: '#4A6FA5', hinweis: t('kamera.motivTeil') },
  groesse: {
    typ: 'groesse',
    art: 'groessenschild',
    farbe: '#F1EEE6',
    hinweis: t('kamera.motivEtikett'),
  },
  pflege: {
    typ: 'pflege',
    art: 'pflegeetikett',
    farbe: '#F1EEE6',
    hinweis: t('kamera.motivPflege'),
  },
  laden: { typ: 'laden', art: 'pullover', farbe: '#8E9190', hinweis: t('kamera.motivLaden') },
  selfie: { typ: 'selfie', art: 'person', farbe: '#F4F4F0', hinweis: t('kamera.motivSelfie') },
};

const TYP_TEXT: Record<FotoTyp, string> = {
  teil: t('kamera.typTeil'),
  laden: t('kamera.typTeil'),
  groesse: t('kamera.typGroesse'),
  pflege: t('kamera.typPflege'),
  selfie: t('kamera.typSelfie'),
};

const GROESSEN = ['W30/L32', 'W31/L32', 'W32/L32', 'W32/L34', 'W33/L32', 'W33/L34', 'W34/L34'];
const ARTEN: { id: KleidungsArt; titel: string }[] = [
  { id: 'jeans', titel: 'Jeans' },
  { id: 'hose', titel: 'Hose' },
  { id: 'rock', titel: 'Rock' },
  { id: 'kleid', titel: 'Kleid' },
];

/** Ein Kamera-Knopf für alles; die App erkennt den Fototyp selbst (Plan K01, K02). */
export default function Kamera() {
  const { farben } = useThema();
  const szenario = usePrototyp((s) => s.szenario);
  const fotos = usePrototyp((s) => s.kameraFotos);
  const kameraFoto = usePrototyp((s) => s.kameraFoto);
  const kameraLeeren = usePrototyp((s) => s.kameraLeeren);
  const fuegeHinzu = usePrototyp((s) => s.fuegeHinzu);
  const entferne = usePrototyp((s) => s.entferne);
  const zeigeLeiste = usePrototyp((s) => s.zeigeLeiste);

  const [auswahl, setAuswahl] = useState<'art' | 'farbe' | 'groesse' | null>(null);
  const [art, setArt] = useState<KleidungsArt>('jeans');
  const [farbe, setFarbe] = useState('Blau');
  const [groesse, setGroesse] = useState<string | null>(null);

  const motiv: Motiv = useMemo(() => {
    if (szenario === 'kaufcheck') return MOTIVE.laden;
    if (szenario === 'selfie') return MOTIVE.selfie;
    const folge: FotoTyp[] = ['teil', 'groesse', 'pflege'];
    return MOTIVE[folge[Math.min(fotos.length, folge.length - 1)]];
  }, [szenario, fotos.length]);

  const schliessen = () => {
    kameraLeeren();
    router.back();
  };

  const ausloesen = () => {
    kameraFoto(motiv.typ);
    if (motiv.typ === 'selfie') router.replace('/kamera/selfie');
  };

  const hatTeil = fotos.includes('teil') || fotos.includes('laden');
  const imLaden = fotos.includes('laden');
  const artTitel = ARTEN.find((a) => a.id === art)?.titel ?? 'Jeans';

  const werte: KartenWert[] = imLaden
    ? [
        { id: 'name', text: 'Strickpullover' },
        { id: 'farbe', text: 'Grau' },
        { id: 'material', text: 'Wolle-Mix', unsicher: true },
      ]
    : [
        { id: 'name', text: artTitel, onPress: () => setAuswahl('art') },
        { id: 'farbe', text: farbe, onPress: () => setAuswahl('farbe') },
        ...(fotos.includes('groesse')
          ? [
              { id: 'marke', text: "Levi's" },
              {
                id: 'groesse',
                text: groesse ?? 'W32/L34',
                unsicher: groesse === null,
                onPress: () => setAuswahl('groesse'),
              },
              { id: 'material', text: '98 % Baumwolle' },
            ]
          : []),
        ...(fotos.includes('pflege') ? [{ id: 'pflege', text: '40 °C' }] : []),
      ];

  const inDenSchrank = () => {
    const neu = {
      ...NEUE_JEANS,
      id: `neu-${Date.now()}`,
      art,
      name: `${farbe === 'Blau' ? 'Blaue' : farbe} ${artTitel}`,
      farbname: farbe,
      farbe: FARB_OPTIONEN.find((f) => f.id === farbe)?.farbe ?? NEUE_JEANS.farbe,
      groesse: groesse ?? (fotos.includes('groesse') ? 'W32/L34' : ''),
    };
    fuegeHinzu([neu]);
    kameraLeeren();
    router.dismissTo('/schrank');
    zeigeLeiste(t('kamera.gespeichert', { teil: neu.name }), () => entferne([neu.id]));
  };

  const nurPruefen = () => {
    kameraLeeren();
    router.replace('/kamera/kaufcheck');
  };

  return (
    <SafeAreaView style={[styles.seite, { backgroundColor: farben.sucher }]}>
      <View style={styles.kopf}>
        <SymbolKnopf
          symbol="close"
          beschriftung={t('kamera.schliessen')}
          farbe="#FFFFFF"
          onPress={schliessen}
        />
      </View>
      <View style={[styles.sucher, hatTeil && styles.sucherKlein]}>
        <View
          style={[styles.rahmen, hatTeil && styles.rahmenKlein]}
          accessibilityLabel={motiv.hinweis}
        >
          <KleidungsBild art={motiv.art} farbe={motiv.farbe} groesse={hatTeil ? 72 : 200} />
        </View>
        <Text style={[styles.hinweis, hatTeil && styles.hinweisKlein]}>{motiv.hinweis}</Text>
      </View>
      <View style={styles.leiste}>
        <SymbolKnopf
          symbol="images-outline"
          beschriftung={t('kamera.galerie')}
          farbe="#FFFFFF"
          groesse={30}
          onPress={() => router.push('/kamera/galerie')}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('kamera.ausloeser')}
          onPress={ausloesen}
          style={({ pressed }) => [styles.ausloeser, { opacity: pressed ? 0.7 : 1 }]}
        >
          <View style={styles.ausloeserInnen} />
        </Pressable>
        <View style={styles.zaehler}>
          {fotos.length > 0 ? <Text style={styles.zaehlerText}>{fotos.length}</Text> : null}
        </View>
      </View>

      {hatTeil ? (
        <ScrollView style={styles.karte} contentContainerStyle={{ padding: abstand.m }}>
          <Bestaetigungskarte
            werte={werte}
            frage={t('kamera.frage')}
            erkanntHinweis={`${fotos.map((f) => TYP_TEXT[f]).join(' + ')}. ${t('allgemein.erkannt')}`}
            aendernHinweis={t('allgemein.aendernHinweis')}
            aktionen={
              <View style={{ gap: abstand.s }}>
                {!imLaden && fotos.length < 3 ? (
                  <View style={styles.tipp}>
                    <Ionicons name="pricetag-outline" size={18} color={farben.textLeise} />
                    <Text art="klein" leise style={{ flex: 1 }}>
                      {t('kamera.tippEtikett')}
                    </Text>
                  </View>
                ) : null}
                <HauptKnopf titel={t('kamera.inDenSchrank')} onPress={inDenSchrank} />
                <NebenKnopf titel={t('kamera.nurPruefen')} onPress={nurPruefen} />
              </View>
            }
          />
        </ScrollView>
      ) : null}

      {auswahl === 'farbe' ? (
        <WertAuswahl
          titel={t('werte.titel', { wert: t('werte.farbe') })}
          optionen={FARB_OPTIONEN.map((f) => ({
            id: f.id,
            titel: f.titel,
            bild: <FarbFeld farbe={f.farbe} />,
          }))}
          gewaehlt={farbe}
          onWahl={setFarbe}
          onSchliessen={() => setAuswahl(null)}
        />
      ) : null}
      {auswahl === 'groesse' ? (
        <WertAuswahl
          titel={t('werte.titel', { wert: t('werte.groesse') })}
          optionen={GROESSEN.map((g) => ({
            id: g,
            titel: g,
            bild: <Text art="gross">{g.split('/')[0]}</Text>,
          }))}
          gewaehlt={groesse ?? undefined}
          onWahl={setGroesse}
          onSchliessen={() => setAuswahl(null)}
        />
      ) : null}
      {auswahl === 'art' ? (
        <WertAuswahl
          titel={t('werte.titel', { wert: artTitel })}
          optionen={ARTEN.map((a) => ({
            id: a.id,
            titel: a.titel,
            bild: <KleidungsBild art={a.id} farbe="#4A6FA5" groesse={48} />,
          }))}
          gewaehlt={art}
          onWahl={(id) => setArt(id as KleidungsArt)}
          onSchliessen={() => setAuswahl(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  seite: { flex: 1 },
  kopf: { flexDirection: 'row', paddingHorizontal: abstand.s, flexShrink: 0 },
  sucher: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: abstand.m },
  // flex: 0 heißt im Browser "Höhe 0"; deshalb Grundgröße ausdrücklich automatisch.
  sucherKlein: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    flexDirection: 'row',
    paddingHorizontal: abstand.l,
    paddingVertical: abstand.xs,
  },
  rahmenKlein: { padding: abstand.s },
  hinweisKlein: { flex: 1, textAlign: 'left' },
  rahmen: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.l,
    padding: abstand.l,
    backgroundColor: '#3A3D3B',
  },
  hinweis: { color: '#FFFFFF', textAlign: 'center' },
  leiste: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: abstand.l,
    paddingVertical: abstand.m,
  },
  ausloeser: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ausloeserInnen: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#FFFFFF' },
  zaehler: { width: 48, alignItems: 'center' },
  zaehlerText: { color: '#FFFFFF', fontWeight: '700' },
  // minHeight 0: sonst wächst die Liste im Browser über den Bildschirm hinaus
  karte: { flex: 1, minHeight: 0 },
  tipp: { flexDirection: 'row', gap: abstand.s, alignItems: 'center' },
});
