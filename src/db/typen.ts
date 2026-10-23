import type { SQLiteDatabase } from 'expo-sqlite';

/** Der Teil von expo-sqlite, den die App nutzt (in Tests durch node:sqlite ersetzt). */
export type Datenbank = Pick<
  SQLiteDatabase,
  'execAsync' | 'runAsync' | 'getFirstAsync' | 'getAllAsync' | 'withTransactionAsync'
>;
