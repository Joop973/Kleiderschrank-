import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Hinweis } from '../../core/hints/warteschlange';
import { t } from '../../i18n';
import { teilMitId } from '../../prototyp/beispieldaten';
import { OutfitBild } from '../../prototyp/OutfitBild';
import { usePrototyp } from '../../prototyp/store';
import { useShallow } from 'zustand/react/shallow';
import { useHeutigerHinweis } from '../../prototyp/useHeutigerHinweis';
import {
  abstand,
  HauptKnopf,
  Hinweiskarte,
  NebenKnopf,
  Seite,
  SymbolKnopf,
  Text,
  useThema,
} from '../../shared/design-system';

function HinweisAnzeige({ hinweis, wegtippen }: { hinweis: Hinweis; wegtippen: () => void }) {
  const teile = usePrototyp((s) => s.teile);
  const mantelFertig = usePrototyp((s) => s.mantelFertig);
  const zeigeLeiste = usePrototyp((s) => s.zeigeLeiste);
  const mantel = teilMitId(teile, 't7');

  const gemeinsam = { onWegtippen: wegtippen, wegtippenBeschriftung: t('allgemein.wegtippen') };
  switch (hinweis.art) {
    case 'waesche-voll':
      return (
        <Hinweiskarte
          {...gemeinsam}
          text={t('hinweise.waesche')}
          aktionen={[
            { titel: t('hinweise.waescheAktion'), onPress: () => router.push('/waesche') },
          ]}
        />
      );
    case 'verkaufen':
      return (
        <Hinweiskarte
          {...gemeinsam}
          text={t('hinweise.verkaufen', { teil: mantel?.name ?? '' })}
          aktionen={[
            { titel: t('hinweise.verkaufenAktion'), onPress: () => router.push('/verkaufen') },
            {
              titel: t('hinweise.spendenAktion'),
              onPress: () => {
                mantelFertig();
                zeigeLeiste(t('hinweise.gespendet'));
              },
            },
            {
              titel: t('hinweise.behaltenAktion'),
              onPress: () => {
                mantelFertig();
                zeigeLeiste(t('hinweise.behalten'));
              },
            },
          ]}
        />
      );
    case 'farbtyp-angebot':
      return (
        <Hinweiskarte
          {...gemeinsam}
          text={t('hinweise.farbtyp')}
          aktionen={[
            { titel: t('hinweise.farbtypAktion'), onPress: () => router.push('/farbtyp') },
          ]}
        />
      );
    case 'e00-gruss':
      return (
        <Hinweiskarte
          {...gemeinsam}
          text={t('erweiterungen.e00Hinweis')}
          aktionen={[
            {
              titel: t('erweiterungen.e00Bildschirm'),
              onPress: () => router.push('/mehr/erweiterung/E00/test'),
            },
          ]}
        />
      );
    default:
      return null;
  }
}

export default function Heute() {
  const { farben } = useThema();
  const outfit = usePrototyp(useShallow((s) => s.outfit()));
  const teile = usePrototyp((s) => s.teile);
  const angezogen = usePrototyp((s) => s.angezogen);
  const morgenFest = usePrototyp((s) => s.morgenFest);
  const tausche = usePrototyp((s) => s.tausche);
  const anderes = usePrototyp((s) => s.anderes);
  const anziehen = usePrototyp((s) => s.anziehen);
  const { hinweis, wegtippen } = useHeutigerHinweis();
  const [details, setDetails] = useState(false);

  return (
    <Seite
      titel={t('heute.titel')}
      rechts={
        <SymbolKnopf
          symbol="ellipsis-horizontal-circle-outline"
          beschriftung={t('heute.mehr')}
          groesse={28}
          onPress={() => router.push('/mehr')}
        />
      }
    >
      <OutfitBild outfit={outfit} teile={teile} onTausche={tausche} onWischen={anderes} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('heute.begruendungRegen')}. ${t('heute.begruendungMehr')}`}
        onPress={() => setDetails((d) => !d)}
        style={styles.begruendung}
      >
        <Text art="gross">{t('heute.begruendungRegen')}</Text>
        <Ionicons
          name={details ? 'chevron-up' : 'information-circle-outline'}
          size={22}
          color={farben.textLeise}
        />
      </Pressable>
      {details ? <Text leise>{t('heute.begruendungDetails')}</Text> : null}
      <View style={styles.mitnehmen}>
        <Ionicons name="umbrella-outline" size={20} color={farben.textLeise} />
        <Text leise>{t('heute.mitnehmenJacke')}</Text>
      </View>

      <View style={styles.aktionen}>
        {angezogen ? (
          <View style={styles.status} accessibilityLiveRegion="polite">
            <Ionicons name="checkmark-circle" size={26} color={farben.akzent} />
            <Text art="gross">{t('heute.angezogenStatus')}</Text>
          </View>
        ) : (
          <HauptKnopf
            titel={t('heute.anziehen')}
            hinweis={t('heute.anziehenHinweis')}
            onPress={anziehen}
            style={styles.anziehen}
          />
        )}
        <NebenKnopf
          titel={t('heute.anderes')}
          beschriftung={t('heute.anderesBeschriftung')}
          symbol="arrow-forward"
          onPress={anderes}
        />
      </View>

      {morgenFest ? (
        <View style={styles.mitnehmen}>
          <Ionicons name="moon-outline" size={20} color={farben.textLeise} />
          <Text leise>{t('heute.morgenFest')}</Text>
        </View>
      ) : null}

      {hinweis ? <HinweisAnzeige hinweis={hinweis} wegtippen={wegtippen} /> : null}
    </Seite>
  );
}

const styles = StyleSheet.create({
  begruendung: { flexDirection: 'row', alignItems: 'center', gap: abstand.s, minHeight: 48 },
  mitnehmen: { flexDirection: 'row', alignItems: 'center', gap: abstand.s },
  aktionen: { flexDirection: 'row', alignItems: 'center', gap: abstand.s, marginTop: abstand.s },
  anziehen: { flex: 1 },
  status: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: abstand.s, minHeight: 56 },
});
