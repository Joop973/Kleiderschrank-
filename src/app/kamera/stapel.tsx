import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { KleidungsBild } from '../../core/wardrobe/KleidungsBild';
import { t } from '../../i18n';
import { GALERIE_TEILE, type Teil } from '../../prototyp/beispieldaten';
import { usePrototyp } from '../../prototyp/store';
import {
  abstand,
  Bestaetigungskarte,
  HauptKnopf,
  Seite,
  Text,
  useWischen,
} from '../../shared/design-system';

let zaehler = 0;

/** Stapel von Bestätigungskarten; Wischen nach rechts heißt Ja (Plan 3.2). */
export default function Stapel() {
  const { ids = '' } = useLocalSearchParams<{ ids?: string }>();
  const teile = GALERIE_TEILE.filter((teil) => ids.split(',').includes(teil.id));
  const [index, setIndex] = useState(0);
  const [angenommen, setAngenommen] = useState<Teil[]>([]);
  const fuegeHinzu = usePrototyp((s) => s.fuegeHinzu);
  const entferne = usePrototyp((s) => s.entferne);
  const zeigeLeiste = usePrototyp((s) => s.zeigeLeiste);
  const kameraLeeren = usePrototyp((s) => s.kameraLeeren);

  const ja = () => {
    const teil = teile[index];
    if (!teil) return;
    const neu = [...angenommen, { ...teil, id: `${teil.id}-${++zaehler}` }];
    setAngenommen(neu);
    if (index + 1 < teile.length) {
      setIndex(index + 1);
      return;
    }
    fuegeHinzu(neu);
    kameraLeeren();
    router.dismissTo('/schrank');
    zeigeLeiste(t('galerie.fertig', { anzahl: neu.length }), () => entferne(neu.map((n) => n.id)));
  };
  const wischHandler = useWischen(ja, 'rechts');

  const teil = teile[index];
  if (!teil) return null;
  return (
    <Seite
      titel={t('galerie.stapel', { nummer: index + 1, gesamt: teile.length })}
      zurueck={() => router.back()}
    >
      <Text leise>{t('galerie.wischen')}</Text>
      <View {...wischHandler}>
        <Bestaetigungskarte
          bild={<KleidungsBild art={teil.art} farbe={teil.farbe} groesse={140} />}
          werte={[
            { id: 'name', text: teil.name },
            { id: 'marke', text: teil.marke, unsicher: teil.marke === 'Unbekannt' },
            { id: 'groesse', text: teil.groesse },
          ]}
          frage={t('kamera.frage')}
          erkanntHinweis={t('allgemein.erkannt')}
          aendernHinweis={t('allgemein.aendernHinweis')}
          aktionen={
            <HauptKnopf
              titel={t('kamera.inDenSchrank')}
              onPress={ja}
              style={{ marginTop: abstand.s }}
            />
          }
        />
      </View>
    </Seite>
  );
}
