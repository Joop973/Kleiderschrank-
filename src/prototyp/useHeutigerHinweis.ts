import { useCallback, useEffect, useMemo, useState } from 'react';

import { waehleHinweis, type Hinweis, type HinweisVerlauf } from '../core/hints/warteschlange';
import { hinweiseAusErweiterungen } from '../core/steckplaetze/steckplaetze';
import { useErweiterungen } from '../core/steckplaetze/ErweiterungsKontext';
import { tagVon } from '../core/zeit/datum';
import { useDatenbank } from '../db/DatenbankProvider';
import { leseHinweisVerlauf, merkeGezeigt, merkeWeggetippt } from '../db/repositories/hinweise';
import { kernHinweise, usePrototyp } from './store';

/** Die eine Hinweiskarte für heute aus Kern und Erweiterungen (Plan K19). */
export function useHeutigerHinweis(): { hinweis: Hinweis | null; wegtippen: () => void } {
  const db = useDatenbank();
  const { aktive } = useErweiterungen();
  const szenario = usePrototyp((s) => s.szenario);
  const waescheErledigt = usePrototyp((s) => s.waescheErledigt);
  const mantelErledigt = usePrototyp((s) => s.mantelErledigt);
  const [verlauf, setVerlauf] = useState<HinweisVerlauf[] | null>(null);
  const heute = tagVon(new Date());

  const laden = useCallback(() => leseHinweisVerlauf(db).then(setVerlauf), [db]);
  useEffect(() => {
    laden();
  }, [laden, szenario]);

  const hinweis = useMemo(() => {
    if (!verlauf) return null;
    const kandidaten = [
      ...kernHinweise(szenario, { waescheErledigt, mantelErledigt }),
      ...hinweiseAusErweiterungen(aktive, { heute }),
    ];
    return waehleHinweis(kandidaten, verlauf, heute);
  }, [verlauf, szenario, waescheErledigt, mantelErledigt, aktive, heute]);

  useEffect(() => {
    if (hinweis && verlauf && !verlauf.some((v) => v.id === hinweis.id && v.gezeigtAm === heute)) {
      merkeGezeigt(db, hinweis, heute).then(laden);
    }
  }, [hinweis, verlauf, db, heute, laden]);

  const wegtippen = useCallback(() => {
    if (hinweis) merkeWeggetippt(db, hinweis.id, heute).then(laden);
  }, [db, hinweis, heute, laden]);

  return { hinweis, wegtippen };
}
