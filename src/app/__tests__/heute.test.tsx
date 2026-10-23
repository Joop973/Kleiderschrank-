import { render, screen } from '@testing-library/react-native';

import Heute from '../index';

jest.mock('../../services/server/hallo', () => ({
  pruefeServer: jest.fn().mockResolvedValue('ok'),
}));

describe('Heute', () => {
  it('zeigt den Platzhalter und den Serverstatus', async () => {
    await render(<Heute />);
    expect(screen.getByText('Hier erscheint bald dein Outfit für heute.')).toBeTruthy();
    expect(await screen.findByText('Server antwortet.')).toBeTruthy();
  });
});
