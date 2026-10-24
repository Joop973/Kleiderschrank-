import { farbenFuer } from '../thema';

/** Relativer Kontrast nach WCAG 2.1. */
function kontrast(a: string, b: string): number {
  const leuchtdichte = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [h, d] = [leuchtdichte(a), leuchtdichte(b)].sort((x, y) => y - x);
  return (h + 0.05) / (d + 0.05);
}

describe.each([
  ['hell', false],
  ['dunkel', true],
  ['reizarm', false],
] as const)('Farben %s', (bild, systemDunkel) => {
  const f = farbenFuer(bild, systemDunkel);

  it('Text ist gut lesbar (mind. 4,5:1)', () => {
    expect(kontrast(f.text, f.hintergrund)).toBeGreaterThanOrEqual(4.5);
    expect(kontrast(f.textLeise, f.flaeche)).toBeGreaterThanOrEqual(4.5);
    expect(kontrast(f.aufAkzent, f.akzent)).toBeGreaterThanOrEqual(4.5);
    expect(kontrast(f.unsicher, f.unsicherFlaeche)).toBeGreaterThanOrEqual(4.5);
  });
});

it('folgt im Modus "system" dem Gerät', () => {
  expect(farbenFuer('system', true)).toEqual(farbenFuer('dunkel', false));
  expect(farbenFuer('system', false)).toEqual(farbenFuer('hell', true));
});
