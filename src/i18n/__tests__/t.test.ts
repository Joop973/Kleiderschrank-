import { t } from '..';

describe('t', () => {
  it('liefert den Text zu einem Schlüssel', () => {
    expect(t('tabs.heute')).toBe('Heute');
  });

  it('liefert den Schlüssel, wenn kein Text existiert', () => {
    // @ts-expect-error absichtlich unbekannter Schlüssel
    expect(t('gibt.es.nicht')).toBe('gibt.es.nicht');
  });
});
