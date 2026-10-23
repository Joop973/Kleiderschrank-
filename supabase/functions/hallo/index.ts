// Edge Function "hallo": Lebenszeichen für Phase 0. Gibt keine Nutzerdaten zurück.
// CORS erlaubt, weil die Webapp aus dem Browser aufruft.
const corsKoepfe = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'apikey, authorization, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve((anfrage) => {
  if (anfrage.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsKoepfe });
  }
  return Response.json(
    { ok: true, zeit: new Date().toISOString() },
    { headers: { ...corsKoepfe, 'Cache-Control': 'no-store' } },
  );
});
