export type ServerStatus = 'ok' | 'fehler' | 'nichtEingerichtet';

export type ServerKonfiguration = {
  url?: string;
  schluessel?: string;
};

const standardKonfiguration: ServerKonfiguration = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL,
  schluessel: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

/** Fragt die Edge Function "hallo" ab und meldet, ob der Server antwortet. */
export async function pruefeServer(
  konfiguration: ServerKonfiguration = standardKonfiguration,
  abrufen: typeof fetch = fetch,
): Promise<ServerStatus> {
  const { url, schluessel } = konfiguration;
  if (!url || !schluessel) return 'nichtEingerichtet';
  try {
    const antwort = await abrufen(`${url}/functions/v1/hallo`, {
      headers: { apikey: schluessel },
    });
    if (!antwort.ok) return 'fehler';
    const daten = (await antwort.json()) as { ok?: unknown };
    return daten.ok === true ? 'ok' : 'fehler';
  } catch {
    return 'fehler';
  }
}
