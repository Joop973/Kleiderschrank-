// Edge Function "hallo": Lebenszeichen für Phase 0. Gibt keine Nutzerdaten zurück.
Deno.serve(() =>
  Response.json(
    { ok: true, zeit: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  ),
);
