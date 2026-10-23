import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { t } from '../i18n';
import { pruefeServer, type ServerStatus } from '../services/server/hallo';

export default function Heute() {
  const [status, setStatus] = useState<ServerStatus | 'pruefe'>('pruefe');

  useEffect(() => {
    let aktiv = true;
    pruefeServer().then((ergebnis) => {
      if (aktiv) setStatus(ergebnis);
    });
    return () => {
      aktiv = false;
    };
  }, []);

  return (
    <View style={styles.seite}>
      <Text style={styles.text}>{t('heute.platzhalter')}</Text>
      <Text style={styles.status} accessibilityLiveRegion="polite">
        {t(`server.${status}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  seite: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  text: { fontSize: 18, textAlign: 'center' },
  status: { fontSize: 16, textAlign: 'center' },
});
