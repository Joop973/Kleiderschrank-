import { DatabaseSync } from 'node:sqlite';

import type { Datenbank } from '../../src/db/typen';

type Parameter = (string | number | null)[];

/** Echte SQLite-Datenbank im Speicher (node:sqlite) mit der async-Schnittstelle von expo-sqlite. */
export function erzeugeTestDatenbank(): Datenbank {
  const db = new DatabaseSync(':memory:');
  const zugriff = {
    async execAsync(sql: string) {
      db.exec(sql);
    },
    async runAsync(sql: string, parameter: Parameter = []) {
      const r = db.prepare(sql).run(...parameter);
      return { changes: Number(r.changes), lastInsertRowId: Number(r.lastInsertRowid) };
    },
    async getFirstAsync(sql: string, parameter: Parameter = []) {
      return db.prepare(sql).get(...parameter) ?? null;
    },
    async getAllAsync(sql: string, parameter: Parameter = []) {
      return db.prepare(sql).all(...parameter);
    },
    async withTransactionAsync(arbeit: () => Promise<void>) {
      db.exec('BEGIN');
      try {
        await arbeit();
        db.exec('COMMIT');
      } catch (fehler) {
        db.exec('ROLLBACK');
        throw fehler;
      }
    },
  };
  return zugriff as unknown as Datenbank;
}
