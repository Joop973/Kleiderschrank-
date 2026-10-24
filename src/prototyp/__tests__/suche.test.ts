import { BEISPIEL_TEILE } from '../beispieldaten';
import { filtereTeile } from '../suche';

describe('filtereTeile', () => {
  it('findet "blaue Jeans"', () => {
    expect(filtereTeile(BEISPIEL_TEILE, 'blaue Jeans', null).map((t) => t.id)).toEqual(['t8']);
  });

  it('ignoriert Groß- und Kleinschreibung und leere Suche', () => {
    expect(filtereTeile(BEISPIEL_TEILE, '  ', null)).toHaveLength(BEISPIEL_TEILE.length);
    expect(filtereTeile(BEISPIEL_TEILE, 'LEVI', null).map((t) => t.id)).toEqual(['t8']);
  });

  it('filtert nach Kategorie', () => {
    expect(filtereTeile(BEISPIEL_TEILE, '', 'schuhe').every((t) => t.kategorie === 'schuhe')).toBe(
      true,
    );
  });

  it('liefert nichts, wenn ein Wort fehlt', () => {
    expect(filtereTeile(BEISPIEL_TEILE, 'rote Jeans', null)).toEqual([]);
  });
});
