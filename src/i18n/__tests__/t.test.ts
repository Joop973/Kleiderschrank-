import de from '../de.json';
import { t } from '..';

describe('t', () => {
  it('liefert den Text zu einem Schlüssel', () => {
    expect(t('tabs.heute')).toBe('Heute');
  });

  it('liefert den Schlüssel, wenn kein Text existiert', () => {
    // @ts-expect-error absichtlich unbekannter Schlüssel
    expect(t('gibt.es.nicht')).toBe('gibt.es.nicht');
  });

  it('ersetzt Platzhalter und lässt unbekannte stehen', () => {
    expect(t('galerie.hinzufuegen', { anzahl: 3 })).toBe('3 hinzufügen');
    expect(t('galerie.hinzufuegen')).toBe('{anzahl} hinzufügen');
  });
});

describe('de.json', () => {
  const alle: string[] = [];
  const sammle = (o: unknown) => {
    if (typeof o === 'string') alle.push(o);
    else if (o && typeof o === 'object') Object.values(o).forEach(sammle);
  };
  sammle(de);

  it('enthält keine leeren Texte', () => {
    expect(alle.filter((s) => s.trim() === '')).toEqual([]);
  });

  it('nutzt die Du-Form, nicht die Sie-Form', () => {
    expect(alle.filter((s) => /\b(Sie|Ihr|Ihre|Ihnen)\b/.test(s))).toEqual([]);
  });

  it('enthält keine Emojis', () => {
    expect(alle.filter((s) => /\p{Extended_Pictographic}/u.test(s))).toEqual([]);
  });
});
