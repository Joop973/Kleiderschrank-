import { router } from 'expo-router';
import { useState } from 'react';

import { KleidungsBild } from '../../core/wardrobe/KleidungsBild';
import { t } from '../../i18n';
import { GALERIE_TEILE } from '../../prototyp/beispieldaten';
import { Bildauswahl, HauptKnopf, Seite, Text } from '../../shared/design-system';

/** Viele Teile auf einmal aus den eigenen Fotos (Plan K03). */
export default function Galerie() {
  const [gewaehlt, setGewaehlt] = useState<string[]>([]);
  const umschalten = (id: string) =>
    setGewaehlt((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));

  return (
    <Seite
      titel={t('galerie.titel')}
      zurueck={() => router.back()}
      zurueckBeschriftung={t('allgemein.zurueck')}
      unten={
        gewaehlt.length > 0 ? (
          <HauptKnopf
            titel={t('galerie.hinzufuegen', { anzahl: gewaehlt.length })}
            onPress={() =>
              router.replace({ pathname: '/kamera/stapel', params: { ids: gewaehlt.join(',') } })
            }
          />
        ) : (
          <Text leise>{t('galerie.nichtsGewaehlt')}</Text>
        )
      }
    >
      <Bildauswahl
        spalten={3}
        optionen={GALERIE_TEILE.map((teil, i) => ({
          id: teil.id,
          titel: `Foto ${i + 1}`,
          bild: <KleidungsBild art={teil.art} farbe={teil.farbe} groesse={72} />,
        }))}
        gewaehlt={gewaehlt}
        onWahl={umschalten}
      />
    </Seite>
  );
}
