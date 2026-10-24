import { BEISPIEL_TEILE } from '../../prototyp/beispieldaten';
import { erzeugeTestDatenbank } from '../../../tests/hilfen/testDatenbank';
import { migriere } from '../migrationen';
import {
  alleGewaschen,
  anzahlTeile,
  ladeTeile,
  leereSchrank,
  loescheEintrag,
  loescheTeile,
  speichereTeil,
  trageEin,
} from '../repositories/teile';

const heute = '2026-10-24';

async function neueDb() {
  const db = erzeugeTestDatenbank();
  await migriere(db);
  return db;
}

describe('Teile-Repository', () => {
  it('speichert ein Teil und liest es unverändert zurück', async () => {
    const db = await neueDb();
    const teil = { ...BEISPIEL_TEILE[7], inWaesche: true };
    await speichereTeil(db, teil);
    expect(await ladeTeile(db, heute)).toEqual([teil]);
  });

  it('überschreibt beim zweiten Speichern statt zu verdoppeln', async () => {
    const db = await neueDb();
    await speichereTeil(db, BEISPIEL_TEILE[0]);
    await speichereTeil(db, { ...BEISPIEL_TEILE[0], name: 'Neu' });
    const teile = await ladeTeile(db, heute);
    expect(teile).toHaveLength(1);
    expect(teile[0].name).toBe('Neu');
  });

  it('löscht weich: Teil verschwindet, Zeile bleibt', async () => {
    const db = await neueDb();
    await speichereTeil(db, BEISPIEL_TEILE[0]);
    await loescheTeile(db, [BEISPIEL_TEILE[0].id]);
    expect(await ladeTeile(db, heute)).toEqual([]);
    expect(await anzahlTeile(db)).toBe(0);
    expect(await db.getFirstAsync('SELECT COUNT(*) AS n FROM items', [])).toEqual({ n: 1 });
  });

  it('zählt Tragen und setzt "zuletzt" auf heute; Rückgängig stellt alles wieder her', async () => {
    const db = await neueDb();
    const teil = BEISPIEL_TEILE[0];
    await speichereTeil(db, teil);
    await trageEin(db, 'e1', [teil.id], heute, 'wear_button');
    let geladen = (await ladeTeile(db, heute))[0];
    expect(geladen.getragen).toBe(teil.getragen + 1);
    expect(geladen.zuletzt).toBe('heute');
    expect(
      await db.getFirstAsync('SELECT wears_since_wash AS n FROM laundry_state WHERE item_id = ?', [
        teil.id,
      ]),
    ).toEqual({ n: 1 });

    await loescheEintrag(db, 'e1');
    geladen = (await ladeTeile(db, heute))[0];
    expect(geladen.getragen).toBe(teil.getragen);
    expect(geladen.zuletzt).toBe(teil.zuletzt);
  });

  it('"Fertig gewaschen" holt alles aus der Wäsche', async () => {
    const db = await neueDb();
    await speichereTeil(db, { ...BEISPIEL_TEILE[1], inWaesche: true });
    await alleGewaschen(db);
    expect((await ladeTeile(db, heute))[0].inWaesche).toBe(false);
    expect(await db.getFirstAsync('SELECT washes_total AS n FROM laundry_state', [])).toEqual({
      n: 1,
    });
  });

  it('leert den Schrank vollständig', async () => {
    const db = await neueDb();
    for (const teil of BEISPIEL_TEILE) await speichereTeil(db, teil);
    await trageEin(db, 'e1', ['t1', 't8'], heute, 'wear_button');
    await leereSchrank(db);
    expect(await anzahlTeile(db)).toBe(0);
    expect(await db.getFirstAsync('SELECT COUNT(*) AS n FROM wear_logs', [])).toEqual({ n: 0 });
  });

  it('speichert Text mit Anführungszeichen sicher', async () => {
    const db = await neueDb();
    await speichereTeil(db, { ...BEISPIEL_TEILE[0], name: `Levi's "501"`, marke: "Levi's" });
    expect((await ladeTeile(db, heute))[0].name).toBe(`Levi's "501"`);
  });
});
