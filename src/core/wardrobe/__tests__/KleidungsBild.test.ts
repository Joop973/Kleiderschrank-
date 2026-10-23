import { abgedunkelt } from '../KleidungsBild';

describe('abgedunkelt', () => {
  it('dunkelt Weiß und Farben ab', () => {
    expect(abgedunkelt('#FFFFFF')).toBe('#999999');
    expect(abgedunkelt('#000000')).toBe('#000000');
    expect(abgedunkelt('#3366CC', 0.5)).toBe('#1a3366');
  });
});
