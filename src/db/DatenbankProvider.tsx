import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import type { PropsWithChildren } from 'react';

import { migriere } from './migrationen';
import type { Datenbank } from './typen';

export const DATENBANK_NAME = 'schrank.db';

async function beimOeffnen(db: Datenbank) {
  await migriere(db);
}

/** Öffnet die lokale Datenbank einmal und migriert sie, bevor die App startet. */
export function DatenbankProvider({ children }: PropsWithChildren) {
  return (
    <SQLiteProvider databaseName={DATENBANK_NAME} onInit={beimOeffnen}>
      {children}
    </SQLiteProvider>
  );
}

export function useDatenbank(): Datenbank {
  return useSQLiteContext();
}
