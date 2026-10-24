import { pruefeServer } from '../hallo';

const konfiguration = { url: 'https://beispiel.supabase.co', schluessel: 'sb_publishable_test' };

function antwortMit(status: number, inhalt: unknown) {
  return jest.fn().mockResolvedValue({ ok: status < 400, json: async () => inhalt });
}

describe('pruefeServer', () => {
  it('meldet "nichtEingerichtet" ohne URL oder Schlüssel', async () => {
    const abrufen = jest.fn();
    await expect(pruefeServer({}, abrufen)).resolves.toBe('nichtEingerichtet');
    expect(abrufen).not.toHaveBeenCalled();
  });

  it('meldet "ok", wenn hallo { ok: true } liefert', async () => {
    const abrufen = antwortMit(200, { ok: true });
    await expect(pruefeServer(konfiguration, abrufen)).resolves.toBe('ok');
    expect(abrufen).toHaveBeenCalledWith('https://beispiel.supabase.co/functions/v1/hallo', {
      headers: { apikey: 'sb_publishable_test' },
    });
  });

  it('meldet "fehler" bei HTTP-Fehler', async () => {
    await expect(pruefeServer(konfiguration, antwortMit(500, {}))).resolves.toBe('fehler');
  });

  it('meldet "fehler" bei unerwarteter Antwort', async () => {
    await expect(pruefeServer(konfiguration, antwortMit(200, { ok: 'ja' }))).resolves.toBe(
      'fehler',
    );
  });

  it('meldet "fehler" ohne Netz', async () => {
    const abrufen = jest.fn().mockRejectedValue(new Error('offline'));
    await expect(pruefeServer(konfiguration, abrufen)).resolves.toBe('fehler');
  });
});
