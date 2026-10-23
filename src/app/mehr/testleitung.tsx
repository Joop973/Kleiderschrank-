import { router, type Href } from 'expo-router';

import { useDatenbank } from '../../db/DatenbankProvider';
import { loescheHinweisVerlauf } from '../../db/repositories/hinweise';
import { t, type TextSchluessel } from '../../i18n';
import { usePrototyp, type Szenario } from '../../prototyp/store';
import { Karte, ListenZeile, NebenKnopf, Seite, Text } from '../../shared/design-system';

const AUFGABEN: { szenario: Szenario; text: TextSchluessel; start: Href }[] = [
  { szenario: 'morgens', text: 'testleitung.morgens', start: '/' },
  { szenario: 'schuhe', text: 'testleitung.schuhe', start: '/' },
  { szenario: 'abends', text: 'testleitung.abends', start: '/abend-hinweis' },
  { szenario: 'neuesTeil', text: 'testleitung.neuesTeil', start: '/' },
  { szenario: 'galerie', text: 'testleitung.galerie', start: '/' },
  { szenario: 'kaufcheck', text: 'testleitung.kaufcheck', start: '/' },
  { szenario: 'selfie', text: 'testleitung.selfie', start: '/' },
  { szenario: 'waesche', text: 'testleitung.waesche', start: '/' },
  { szenario: 'verkaufen', text: 'testleitung.verkaufen', start: '/' },
  { szenario: 'farbtyp', text: 'testleitung.farbtyp', start: '/' },
  { szenario: 'erweiterung', text: 'testleitung.erweiterung', start: '/' },
];

/** Nur für Nutzertests (Plan Regel 14): Aufgabe wählen, App springt zum Start. */
export default function Testleitung() {
  const db = useDatenbank();
  const setzeSzenario = usePrototyp((s) => s.setzeSzenario);
  const zeigeLeiste = usePrototyp((s) => s.zeigeLeiste);

  const starte = async (szenario: Szenario, start: Href) => {
    await loescheHinweisVerlauf(db);
    setzeSzenario(szenario);
    router.dismissTo('/');
    if (start !== '/') router.push(start);
  };

  return (
    <Seite titel={t('testleitung.titel')} zurueck={() => router.back()}>
      <Text leise>{t('testleitung.einleitung')}</Text>
      <Karte style={{ padding: 0, overflow: 'hidden' }}>
        {AUFGABEN.map((a) => (
          <ListenZeile
            key={a.szenario}
            titel={t(a.text)}
            onPress={() => starte(a.szenario, a.start)}
          />
        ))}
      </Karte>
      <NebenKnopf
        titel={t('testleitung.zuruecksetzen')}
        symbol="refresh"
        onPress={async () => {
          await loescheHinweisVerlauf(db);
          setzeSzenario('morgens');
          zeigeLeiste(t('testleitung.zurueckgesetzt'));
        }}
      />
    </Seite>
  );
}
