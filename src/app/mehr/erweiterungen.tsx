import { router } from 'expo-router';
import { Switch, View } from 'react-native';

import { useErweiterungen } from '../../core/steckplaetze/ErweiterungsKontext';
import { t } from '../../i18n';
import { abstand, Karte, Seite, Text, useThema } from '../../shared/design-system';

/** Liste mit einem Satz Erklärung und Schalter (Plan K34, 5). */
export default function Erweiterungen() {
  const { farben } = useThema();
  const { alle, zustand, schalte } = useErweiterungen();
  return (
    <Seite titel={t('erweiterungen.titel')} zurueck={() => router.back()}>
      <Text leise>{t('erweiterungen.einleitung')}</Text>
      {alle.map((m) => {
        const z = zustand.find((x) => x.id === m.id);
        const an = z?.eingeschaltet ?? false;
        return (
          <Karte key={m.id} style={{ gap: abstand.s }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: abstand.m }}>
              <View style={{ flex: 1 }}>
                <Text art="gross">{t(m.name)}</Text>
                <Text leise>{t(m.beschreibung)}</Text>
              </View>
              <Switch
                accessibilityLabel={t(m.name)}
                value={an}
                onValueChange={(neu) => schalte(m.id, neu, z?.benachrichtigungenErlaubt ?? false)}
                trackColor={{ true: farben.akzent, false: farben.linie }}
              />
            </View>
            {an && m.steckplaetze.sendetBenachrichtigungen ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: abstand.m }}>
                <Text style={{ flex: 1 }}>{t('erweiterungen.zustimmung')}</Text>
                <Switch
                  accessibilityLabel={t('erweiterungen.zustimmung')}
                  value={z?.benachrichtigungenErlaubt ?? false}
                  onValueChange={(erlaubt) => schalte(m.id, true, erlaubt)}
                  trackColor={{ true: farben.akzent, false: farben.linie }}
                />
              </View>
            ) : null}
          </Karte>
        );
      })}
    </Seite>
  );
}
