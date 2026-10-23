import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { useDatenbank } from '../../db/DatenbankProvider';
import { leseErweiterungsZustand, setzeErweiterung } from '../../db/repositories/erweiterungen';
import { aktiveErweiterungen } from './steckplaetze';
import type { ErweiterungsManifest, ErweiterungsZustand } from './typen';

type Kontext = {
  alle: readonly ErweiterungsManifest[];
  zustand: ErweiterungsZustand[];
  aktive: ErweiterungsManifest[];
  schalte: (id: string, an: boolean, benachrichtigungenErlaubt?: boolean) => Promise<void>;
};

const ErweiterungsKontext = createContext<Kontext>({
  alle: [],
  zustand: [],
  aktive: [],
  schalte: async () => {},
});

/** Lädt den Zustand aller Erweiterungen. Die Manifeste kommen von außen (Plan 7.5). */
export function ErweiterungsProvider({
  alle,
  children,
}: PropsWithChildren<{ alle: readonly ErweiterungsManifest[] }>) {
  const db = useDatenbank();
  const [zustand, setZustand] = useState<ErweiterungsZustand[]>([]);

  useEffect(() => {
    let aktiv = true;
    leseErweiterungsZustand(db).then((z) => aktiv && setZustand(z));
    return () => {
      aktiv = false;
    };
  }, [db]);

  const schalte = useCallback(
    async (id: string, an: boolean, benachrichtigungenErlaubt = false) => {
      const manifest = alle.find((m) => m.id === id);
      if (!manifest) return;
      await setzeErweiterung(db, manifest, an, benachrichtigungenErlaubt);
      setZustand(await leseErweiterungsZustand(db));
    },
    [alle, db],
  );

  const wert = useMemo(
    () => ({ alle, zustand, aktive: aktiveErweiterungen(alle, zustand), schalte }),
    [alle, zustand, schalte],
  );
  return <ErweiterungsKontext.Provider value={wert}>{children}</ErweiterungsKontext.Provider>;
}

export function useErweiterungen(): Kontext {
  return useContext(ErweiterungsKontext);
}
