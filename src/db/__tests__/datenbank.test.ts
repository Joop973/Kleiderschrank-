import type { ErweiterungsManifest } from '../../core/steckplaetze/typen';
import { KERN_MIGRATIONEN, migriere } from '../migrationen';
import { leseEinstellung, schreibeEinstellung } from '../repositories/einstellungen';
import {
  leseErweiterungsZustand,
  loescheErweiterungsDaten,
  pruefeErweiterungsMigration,
  setzeErweiterung,
} from '../repositories/erweiterungen';
import { leseHinweisVerlauf, merkeGezeigt, merkeWeggetippt } from '../repositories/hinweise';
import { erzeugeTestDatenbank } from '../../../tests/hilfen/testDatenbank';

const V = KERN_MIGRATIONEN.length;

const testErweiterung: ErweiterungsManifest = {
  id: 'E99',
  name: 'tabs.heute',
  beschreibung: 'tabs.heute',
  plan: 'free',
  benoetigt: [],
  migrationen: ['CREATE TABLE ext_e99_notiz (id TEXT PRIMARY KEY NOT NULL, text TEXT NOT NULL);'],
  steckplaetze: {},
};

async function neueDb() {
  const db = erzeugeTestDatenbank();
  await migriere(db);
  return db;
}

describe('migriere', () => {
  it('legt das Schema an und setzt die Version', async () => {
    const db = erzeugeTestDatenbank();
    expect(await migriere(db)).toBe(V);
    expect(await db.getFirstAsync('PRAGMA user_version')).toEqual({ user_version: V });
  });

  it('ist beim zweiten Start ohne Wirkung und behält Daten', async () => {
    const db = await neueDb();
    await schreibeEinstellung(db, 'thema', 'dunkel');
    expect(await migriere(db)).toBe(V);
    expect(await leseEinstellung(db, 'thema')).toBe('dunkel');
  });

  it('rüstet eine ältere Version nach, ohne Daten zu verlieren', async () => {
    const db = await neueDb();
    await schreibeEinstellung(db, 'thema', 'hell');
    await migriere(db, [...KERN_MIGRATIONEN, 'CREATE TABLE neu (id TEXT);']);
    expect(await db.getFirstAsync('PRAGMA user_version')).toEqual({ user_version: V + 1 });
    expect(await leseEinstellung(db, 'thema')).toBe('hell');
  });

  it('rollt eine fehlgeschlagene Migration vollständig zurück', async () => {
    const db = await neueDb();
    await expect(
      migriere(db, [...KERN_MIGRATIONEN, 'SELECT 1;', 'CREATE TABLE a (id TEXT); KAPUTT;']),
    ).rejects.toThrow();
    expect(await db.getFirstAsync('PRAGMA user_version')).toEqual({ user_version: V });
    expect(await db.getFirstAsync("SELECT name FROM sqlite_master WHERE name = 'a'")).toBeNull();
  });

  it('verweigert eine neuere Datenbank', async () => {
    const db = await neueDb();
    await expect(migriere(db, KERN_MIGRATIONEN.slice(0, 1))).rejects.toThrow('neuer');
  });
});

describe('Einstellungen', () => {
  it('liefert null für Unbekanntes und überschreibt Werte', async () => {
    const db = await neueDb();
    expect(await leseEinstellung(db, 'x')).toBeNull();
    await schreibeEinstellung(db, 'x', "mit 'Anführung'");
    await schreibeEinstellung(db, 'x', 'neu');
    expect(await leseEinstellung(db, 'x')).toBe('neu');
  });
});

describe('Erweiterungen', () => {
  it('speichert Ein/Aus und Zustimmung', async () => {
    const db = await neueDb();
    await setzeErweiterung(db, testErweiterung, true, true);
    expect(await leseErweiterungsZustand(db)).toEqual([
      { id: 'E99', eingeschaltet: true, benachrichtigungenErlaubt: true },
    ]);
    await setzeErweiterung(db, testErweiterung, false, false);
    expect((await leseErweiterungsZustand(db))[0].eingeschaltet).toBe(false);
  });

  it('führt eigene Migrationen genau einmal aus und behält Daten beim Ausschalten', async () => {
    const db = await neueDb();
    await setzeErweiterung(db, testErweiterung, true, false);
    await db.runAsync('INSERT INTO ext_e99_notiz (id, text) VALUES (?, ?)', ['1', 'hallo']);
    await setzeErweiterung(db, testErweiterung, false, false);
    await setzeErweiterung(db, testErweiterung, true, false);
    expect(await db.getAllAsync('SELECT text FROM ext_e99_notiz')).toEqual([{ text: 'hallo' }]);
  });

  it('löscht Daten nur ausgeschaltet und legt Tabellen beim Einschalten neu an', async () => {
    const db = await neueDb();
    await setzeErweiterung(db, testErweiterung, true, false);
    await expect(loescheErweiterungsDaten(db, 'E99')).rejects.toThrow();
    await setzeErweiterung(db, testErweiterung, false, false);
    await loescheErweiterungsDaten(db, 'E99');
    expect(
      await db.getFirstAsync("SELECT name FROM sqlite_master WHERE name = 'ext_e99_notiz'"),
    ).toBeNull();
    await setzeErweiterung(db, testErweiterung, true, false);
    expect(await db.getAllAsync('SELECT * FROM ext_e99_notiz')).toEqual([]);
  });

  it('verbietet Zugriff auf Kern-Tabellen', () => {
    expect(() => pruefeErweiterungsMigration('E99', 'DROP TABLE settings;')).toThrow('fremde');
    expect(() =>
      pruefeErweiterungsMigration('E99', 'CREATE TABLE settings_kopie (id TEXT);'),
    ).toThrow('fremde');
    expect(() =>
      pruefeErweiterungsMigration('E99', 'INSERT INTO settings (key) VALUES (1);'),
    ).toThrow('fremde');
    expect(() =>
      pruefeErweiterungsMigration('E99', 'CREATE INDEX ext_e99_i ON ext_e99_notiz (text);'),
    ).not.toThrow();
  });
});

describe('Hinweis-Verlauf', () => {
  it('merkt Gezeigt und Weggetippt', async () => {
    const db = await neueDb();
    const hinweis = { id: 'h1', art: 'waesche-voll', quelle: 'kern', prioritaet: 5 };
    await merkeGezeigt(db, hinweis, '2026-10-23');
    await merkeGezeigt(db, hinweis, '2026-10-24');
    expect(await leseHinweisVerlauf(db)).toEqual([
      { id: 'h1', art: 'waesche-voll', gezeigtAm: '2026-10-23' },
    ]);
    await merkeWeggetippt(db, 'h1', '2026-10-23');
    expect((await leseHinweisVerlauf(db))[0].weggetipptAm).toBe('2026-10-23');
  });
});
