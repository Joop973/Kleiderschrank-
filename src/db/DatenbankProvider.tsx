import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useState, type PropsWithChildren, type ReactNode } from 'react';

import { migriere } from './migrationen';
import type { Datenbank } from './typen';

export const DATENBANK_NAME = 'schrank.db';

async function beimOeffnen(db: Datenbank) {
  await migriere(db);
}

/**
 * Öffnet die lokale Datenbank einmal und migriert sie, bevor die App startet.
 * Schlägt das fehl (z. B. Browser ohne Unterstützung), wird statt der App `fehlerAnzeige` gezeigt.
 */
export function DatenbankProvider({
  children,
  fehlerAnzeige,
}: PropsWithChildren<{ fehlerAnzeige: (fehler: Error) => ReactNode }>) {
  const [fehler, setFehler] = useState<Error | null>(null);
  if (fehler) return <>{fehlerAnzeige(fehler)}</>;
  return (
    <SQLiteProvider databaseName={DATENBANK_NAME} onInit={beimOeffnen} onError={setFehler}>
      {children}
    </SQLiteProvider>
  );
}

export function useDatenbank(): Datenbank {
  return useSQLiteContext();
}
