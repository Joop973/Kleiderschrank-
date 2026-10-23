import { StyleSheet, Text, View } from 'react-native';

import { t } from '../i18n';

export default function Kamera() {
  return (
    <View style={styles.seite}>
      <Text style={styles.text}>{t('kamera.platzhalter')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  seite: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { fontSize: 18, textAlign: 'center' },
});
